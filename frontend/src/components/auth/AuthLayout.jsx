import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal to-teal-dark p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout

