import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, ArrowRight } from 'lucide-react';

export default function Navbar({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Sembunyikan navbar di halaman login/register? (opsional)
  const hideNavbarPaths = ['/login', '/register'];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              AcneDetect<span className="text-blue-600">AI</span>
            </span>
          </div>

          {/* Menu tengah (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">
              Fitur
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">
              Cara Kerja
            </a>
            {isLoggedIn && (
              <button 
                onClick={() => navigate('/history')} 
                className="text-gray-600 hover:text-blue-600 transition text-sm font-medium"
              >
                Riwayat
              </button>
            )}
          </div>

          {/* Menu kanan */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">👋 Halo, {username}</span>
                <button 
                  onClick={onLogout} 
                  className="px-4 py-2 text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Keluar
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-md hover:shadow-blue-500/30 hover:shadow-lg"
              >
                <span className="relative z-10">Masuk</span>
                {/* Efek glow saat hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
              </button>
            )}
            
             <button 
                onClick={() => navigate('/history')}
                className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-md hover:shadow-blue-500/30 hover:shadow-lg"
                >
                <span className="relative z-10">Riwayat</span>
                {/* Efek glow saat hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
          </div>
        </div>
      </div>
    </nav>
  );
}