import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { PacienteHomePage } from './pages/PacienteHomePage'

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#020617',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Carregando...
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to="/paciente" replace /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/paciente" replace /> : <LoginPage />}
      />
      <Route
        path="/paciente"
        element={user ? <PacienteHomePage /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
