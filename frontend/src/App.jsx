import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Landing from './pages/Landing'
import Detect from './pages/Detect'
import Result from './pages/Result'
import History from './pages/History'
import ProductDetail from './pages/ProductDetail'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setIsLoggedIn(true)
        setUserId(user.id)
        setUsername(user.username)
      } catch (e) {
        console.error('Error parsing user', e)
      }
    }
  }, [])

  const handleLogin = (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setIsLoggedIn(true)
    setUserId(user.id)
    setUsername(user.username)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUserId(null)
    setUsername('')
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/detect" element={<Detect />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={
          isLoggedIn ? <History userId={userId} /> : <Navigate to="/login" />
        } />
        <Route path="/product/:productId" element={<ProductDetail />} />
      </Routes>
    </Router>
  )
}

export default App