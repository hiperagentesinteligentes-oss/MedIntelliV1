import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export const PacienteHomePage: React.FC = () => {
  const { paciente, signOut } = useAuth()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: 'white',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Olá, {paciente?.nome ?? 'Paciente'}
      </h1>
      <p style={{ opacity: 0.85, marginBottom: '1.5rem' }}>
        Este é o início do seu painel MedIntelliV1. Aqui depois vamos colocar:
        agenda, histórico, chat com IA, exames, receituário etc.
      </p>

      <button
        onClick={signOut}
        style={{
          padding: '0.5rem 0.8rem',
          borderRadius: 8,
          border: 'none',
          background: '#ef4444',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Sair
      </button>
    </div>
  )
}
