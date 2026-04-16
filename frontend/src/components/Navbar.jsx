import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Camera, User, LogOut, Menu, X } from 'lucide-react'

export default function Navbar({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <Camera className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AcneDetect AI
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5" />
                <span className="font-medium">{username}</span>
              </div>
              <button onClick={() => navigate('/detect')} className="btn-primary">
                Deteksi Sekarang
              </button>
              <button onClick={() => navigate('/history')} className="text-gray-600 hover:text-primary">
                Riwayat
              </button>
              <button onClick={onLogout} className="flex items-center space-x-1 text-red-500 hover:text-red-600">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-primary">Login</Link>
              <Link to="/register" className="btn-primary">Daftar</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
          {isLoggedIn ? (
            <div className="space-y-3">
              <p className="text-gray-600">Halo, {username}!</p>
              <button onClick={() => { navigate('/detect'); setIsMenuOpen(false) }} className="btn-primary w-full">
                Deteksi Sekarang
              </button>
              <button onClick={() => { navigate('/history'); setIsMenuOpen(false) }} className="btn-outline w-full">
                Riwayat
              </button>
              <button onClick={() => { onLogout(); setIsMenuOpen(false) }} className="w-full text-red-500 py-2">
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link to="/login" className="btn-outline w-full block text-center" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn-primary w-full block text-center" onClick={() => setIsMenuOpen(false)}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}