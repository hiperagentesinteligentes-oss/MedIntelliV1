import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const LoginPage: React.FC = () => {
  const { signIn, signUpPaciente, loading } = useAuth()
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    try {
      setErro(null)
      await signIn(email, password)
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao fazer login.')
    }
  }

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    try {
      setErro(null)
      await signUpPaciente({
        nome,
        email,
        password,
        telefone,
        data_nascimento: dataNascimento,
      })
    } catch (err: any) {
      setErro(err.message ?? 'Erro ao cadastrar paciente.')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #1d4ed8, #020617)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(15,23,42,0.9)',
          borderRadius: 16,
          padding: '2rem',
          boxShadow: '0 25px 70px rgba(0,0,0,0.7)',
          border: '1px solid rgba(148,163,184,0.4)',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>MedIntelliV1</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.5rem' }}>
          Acesse ou crie sua conta de paciente.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: '1.5rem',
            background: '#020617',
            padding: 4,
            borderRadius: 999,
          }}
        >
          <button
            onClick={() => setModo('login')}
            style={{
              flex: 1,
              borderRadius: 999,
              border: 'none',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
              background: modo === 'login' ? '#2563eb' : 'transparent',
              color: 'white',
              fontSize: 14,
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => setModo('cadastro')}
            style={{
              flex: 1,
              borderRadius: 999,
              border: 'none',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
              background: modo === 'cadastro' ? '#2563eb' : 'transparent',
              color: 'white',
              fontSize: 14,
            }}
          >
            Sou paciente novo
          </button>
        </div>

        {erro && (
          <div
            style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(248,113,113,0.6)',
              borderRadius: 8,
              padding: '0.5rem 0.75rem',
              fontSize: 13,
              marginBottom: '0.75rem',
            }}
          >
            {erro}
          </div>
        )}

        {modo === 'login' ? (
          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <label style={{ fontSize: 13 }}>
              E-mail
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '0.45rem 0.6rem',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  background: '#020617',
                  color: 'white',
                }}
              />
            </label>
            <label style={{ fontSize: 13 }}>
              Senha
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '0.45rem 0.6rem',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  background: '#020617',
                  color: 'white',
                }}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: '#22c55e',
                color: '#020617',
                fontWeight: 600,
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleCadastro}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <label style={{ fontSize: 13 }}>
              Nome completo
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '0.45rem 0.6rem',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  background: '#020617',
                  color: 'white',
                }}
              />
            </label>
            <label style={{ fontSize: 13 }}>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '0.45rem 0.6rem',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  background: '#020617',
                  color: 'white',
                }}
              />
            </label>
            <label style={{ fontSize: 13 }}>
              Telefone / WhatsApp
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '0.45rem 0.6rem',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  background: '#020617',
                  color: 'white',
                }}
              />
            </label>
            <label style={{ fontSize: 13 }}>
              Data de nascimento
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '0.45rem 0.6rem',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  background: '#020617',
                  color: 'white',
                }}
              />
            </label>
            <label style={{ fontSize: 13 }}>
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '0.45rem 0.6rem',
                  borderRadius: 8,
                  border: '1px solid #334155',
                  background: '#020617',
                  color: 'white',
                }}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: '#22c55e',
                color: '#020617',
                fontWeight: 600,
              }}
            >
              {loading ? 'Criando conta...' : 'Criar conta de paciente'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
