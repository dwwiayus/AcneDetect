import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Camera, Sparkles, Shield, Clock, LogOut, User, Activity, Droplet, Zap } from 'lucide-react'

export default function Landing({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AcneDetect AI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">{username}</span>
                </div>
                <button
                  onClick={() => navigate('/detect')}
                  className="btn-primary text-sm sm:text-base"
                >
                  Deteksi Sekarang
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="px-3 py-2 text-gray-600 hover:text-primary transition-colors text-sm sm:text-base"
                >
                  Riwayat
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Deteksi Jerawat dengan AI
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Identifikasi jenis dan tingkat keparahan jerawat secara instan, 
            dapatkan rekomendasi skincare yang tepat untuk kulit Anda.
          </p>
          {!isLoggedIn && (
            <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
              Mulai Sekarang
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Akurasi Tinggi</h3>
            <p className="text-gray-600">
              Model CNN dengan akurasi hingga 90% dalam mengidentifikasi 4 jenis jerawat
            </p>
          </div>
          <div className="card text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplet className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rekomendasi Skincare</h3>
            <p className="text-gray-600">
              Dapatkan rekomendasi produk yang sesuai dengan jenis jerawat Anda
            </p>
          </div>
          <div className="card text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hasil Instan</h3>
            <p className="text-gray-600">
              Proses deteksi cepat, hasil dalam hitungan detik
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Cara Kerja</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Upload Foto</h3>
              <p className="text-gray-600">Ambil atau upload foto area kulit yang bermasalah</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">AI akan menganalisis jenis & tingkat keparahan</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Dapatkan Rekomendasi</h3>
              <p className="text-gray-600">Terima saran skincare yang dipersonalisasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AcneDetect AI. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2">Powered by TensorFlow & Express.js</p>
        </div>
      </footer>
    </div>
  )
}