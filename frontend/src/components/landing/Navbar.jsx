import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Menu, X, User, LogOut, Home, Clock, Info, Mail } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/about', label: 'About Us', icon: Info },
  { to: '/contact', label: 'Contact Us', icon: Mail },
]

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-teal shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 font-semibold text-lg">
          <span className="text-yellow">Acne</span>
          <span className="text-white">Detect</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 group
                  ${isActive 
                    ? 'text-white border border-yellow shadow-[0_0_12px_rgba(234,227,141,0.5)]' 
                    : 'text-white/90 hover:text-white hover:border hover:border-yellow/50 hover:shadow-[0_0_12px_rgba(234,227,141,0.3)] hover:scale-105'
                  }`}
              >
                <span className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Icon size={16} />
                </span>
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-teal-xlight text-teal-dark px-3 py-1.5 rounded-full text-sm font-medium"
              >
                <User size={16} />
                {user?.name || 'User'}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); navigate('/login') }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="border-2 border-yellow text-yellow px-5 py-2 rounded-full text-sm font-medium hover:bg-yellow hover:text-teal-dark transition-all duration-300 hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-teal-dark border-t border-teal-light/30 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block text-sm text-white/90 hover:text-yellow transition">Home</Link>
          <Link to="/history" onClick={() => setMobileOpen(false)} className="block text-sm text-white/90 hover:text-yellow transition">History</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block text-sm text-white/90 hover:text-yellow transition">About Us</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-sm text-white/90 hover:text-yellow transition">Contact Us</Link>
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); setMobileOpen(false); navigate('/login') }}
              className="flex items-center gap-2 text-sm text-yellow hover:text-white transition"
            >
              <LogOut size={16} /> Keluar
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-yellow font-medium hover:text-white transition">Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
