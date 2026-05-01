import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import PageTransition from '../components/shared/PageTransition'

const AuthPage = () => {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const [mode, setMode] = useState(isLogin ? 'login' : 'register')

  useEffect(() => {
    setMode(isLogin ? 'login' : 'register')
  }, [isLogin])

  return (
    <AuthLayout>
      <PageTransition>
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-text mb-1">
            {mode === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h1>
          <p className="text-text-muted text-xs">
            {mode === 'login'
              ? 'Masuk untuk melanjutkan deteksi jerawat'
              : 'Daftar untuk mulai menggunakan AcneDetect'}
          </p>
        </div>

        {mode === 'login' ? <LoginForm /> : <RegisterForm />}

        <div className="mt-6 text-center">
          <p className="text-text-muted text-xs">
            {mode === 'login' ? (
              <>
                Belum punya akun?{' '}
                <Link to="/register" onClick={() => setMode('register')} className="text-teal font-medium">
                  Daftar
                </Link>
              </>
            ) : (
              <>
                Sudah punya akun?{' '}
                <Link to="/login" onClick={() => setMode('login')} className="text-teal font-medium">
                  Masuk
                </Link>
              </>
            )}
          </p>
        </div>
      </PageTransition>
    </AuthLayout>
  )
}

export default AuthPage
