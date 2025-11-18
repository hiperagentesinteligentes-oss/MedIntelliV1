import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Role = 'paciente' | 'admin' | 'medico' | 'secretaria'

type Paciente = {
  id: string
  auth_user_id: string
  nome: string
  email: string
  telefone?: string | null
  data_nascimento?: string | null
}

type AuthContextType = {
  user: User | null
  session: Session | null
  paciente: Paciente | null
  role: Role | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUpPaciente: (dados: {
    nome: string
    email: string
    password: string
    telefone?: string
    data_nascimento?: string
  }) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  // Carrega sessão inicial
  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!error && data?.session) {
        setSession(data.session)
        setUser(data.session.user)
        await carregarPerfil(data.session.user)
      }
      setLoading(false)
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null)
      setUser(session?.user ?? null)
      if (session?.user) {
        await carregarPerfil(session.user)
      } else {
        setPaciente(null)
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function carregarPerfil(user: User) {
    // por enquanto vamos assumir que todo mundo é paciente
    const userRole = (user.user_metadata?.role as Role | undefined) ?? 'paciente'
    setRole(userRole)

    if (userRole === 'paciente') {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (error) {
        console.warn('Paciente não encontrado para este usuário:', error.message)
        setPaciente(null)
      } else {
        setPaciente(data as Paciente)
      }
    } else {
      setPaciente(null)
    }
  }

  async function signIn(email: string, password: string) {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      if (!data.session?.user) throw new Error('Sessão inválida após login.')

      setSession(data.session)
      setUser(data.session.user)
      await carregarPerfil(data.session.user)
    } finally {
      setLoading(false)
    }
  }

  async function signUpPaciente(dados: {
    nome: string
    email: string
    password: string
    telefone?: string
    data_nascimento?: string
  }) {
    setLoading(true)
    try {
      // cria usuário no auth
      const { data, error } = await supabase.auth.signUp({
        email: dados.email,
        password: dados.password,
        options: {
          data: {
            role: 'paciente',
            nome: dados.nome,
          },
        },
      })
      if (error) throw error

      const user = data.user
      if (!user) throw new Error('Usuário não retornado pelo Supabase.')

      // cria paciente na tabela pacientes
      const { error: insertError } = await supabase.from('pacientes').insert({
        auth_user_id: user.id,
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone ?? null,
        data_nascimento: dados.data_nascimento ?? null,
      })
      if (insertError) throw insertError

      await carregarPerfil(user)
      setUser(user)
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setPaciente(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        paciente,
        role,
        loading,
        signIn,
        signUpPaciente,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
