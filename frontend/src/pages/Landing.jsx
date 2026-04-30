import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Shield, 
  Droplet, 
  Zap, 
  Sparkles,
  Upload,
  Activity,
  Eye,
  TrendingUp,
  ChevronRight,
  Star,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Landing({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: Activity, title: "Analisis Real-time", desc: "Deteksi jenis & tingkat keparahan jerawat dalam hitungan detik", color: "from-blue-500 to-cyan-500" },
    { icon: Eye, title: "Akurasi Tinggi", desc: "Model CNN dengan akurasi hingga 90%", color: "from-purple-500 to-pink-500" },
    { icon: Droplet, title: "Rekomendasi Skincare", desc: "Produk yang sesuai dengan kondisi kulit Anda", color: "from-green-500 to-emerald-500" },
    { icon: TrendingUp, title: "Pantau Perkembangan", desc: "Simpan & lihat riwayat deteksi (login required)", color: "from-orange-500 to-red-500" },
  ];

  const steps = [
    { number: "01", title: "Upload Foto", desc: "Ambil atau upload foto wajah dengan pencahayaan alami", icon: Upload },
    { number: "02", title: "AI Analysis", desc: "Kecerdasan buatan kami menganalisis kondisi kulit", icon: Sparkles },
    { number: "03", title: "Dapatkan Hasil", desc: "Lihat jenis jerawat & rekomendasi skincare", icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />

      {/* Hero Section - Glassmorphism */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-cyan-100/30 pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-blue-700 border border-blue-100 mb-6 animate-on-scroll">
              <Sparkles className="w-4 h-4" />
              AI-Powered Skin Analyzer
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent animate-on-scroll">
              Kenali Kulitmu,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Dengan Kekuatan AI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-on-scroll">
              Cukup upload foto wajah, AI kami akan mendeteksi jenis & tingkat keparahan jerawat, 
              lalu berikan rekomendasi skincare yang tepat untukmu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll">
              <button 
                onClick={() => navigate('/detect')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Analisis Kulit Gratis
              </button>
              <a 
                href="#how-it-works" 
                className="border border-gray-300 bg-white/50 backdrop-blur-sm text-gray-700 px-8 py-3 rounded-full text-lg font-medium hover:bg-white hover:border-blue-300 transition-all duration-300 inline-flex items-center gap-2"
              >
                Pelajari Lebih Lanjut
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">AcneDetectAI</span>?
            </h2>
            <p className="text-gray-600 text-lg">Solusi cerdas untuk masalah jerawat Anda</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-on-scroll"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Kerja</span>
            </h2>
            <p className="text-gray-600 text-lg">Hanya 3 langkah mudah, hasil instan!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="relative text-center animate-on-scroll">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-3xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {step.number}
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/3 left-full transform -translate-y-1/2 w-12">
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 p-8 md:p-12 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Siap Mulai Analisis Kulit?
              </h2>
              <p className="text-white/90 mb-8 max-w-md mx-auto">
                Gratis, cepat, dan akurat. Tidak perlu login untuk mencoba!
              </p>
              <button 
                onClick={() => navigate('/detect')}
                className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Analisis Sekarang
              </button>
              {!isLoggedIn && (
                <p className="text-white/70 text-sm mt-4">
                  💡 Login untuk menyimpan riwayat deteksi
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2026 AcneDetectAI. Memberdayakan kesehatan kulit dengan kecerdasan buatan.</p>
          <p className="text-xs mt-4">Dibuat untuk kulit Indonesia yang lebih sehat</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-on-scroll {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}