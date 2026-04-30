import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Droplet, Star, Home, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Result({ isLoggedIn: propsIsLoggedIn, username, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [detection, setDetection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(propsIsLoggedIn || false);

  // Cek status login
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    // Cek apakah data dari state (hasil deteksi baru)
    if (location.state?.detection) {
      setDetection(location.state.detection);
      setLoading(false);
    } else {
      // Tidak ada data, redirect ke halaman deteksi
      toast.error('Data deteksi tidak ditemukan');
      navigate('/detect');
    }
  }, [location.state, navigate]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Mild': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Severe': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Mild': return '🟢';
      case 'Moderate': return '🟡';
      case 'Severe': return '🔴';
      default: return '⚪';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'Mild': return 'Ringan';
      case 'Moderate': return 'Sedang';
      case 'Severe': return 'Parah';
      default: return severity;
    }
  };

  const handleSaveToHistory = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/detect' } });
      return;
    }

    setSaving(true);
    try {
      // Kirim hasil deteksi ke backend untuk disimpan
      const token = localStorage.getItem('token');
      const response = await api.post('/detect/save', {
        detection: detection
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success('Berhasil disimpan ke riwayat!');
        navigate('/history');
      }
    } catch (error) {
      toast.error('Gagal menyimpan ke riwayat');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!detection) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />
      
      <div className="container mx-auto max-w-3xl py-8 px-4">
        {/* Tombol Kembali */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/detect')}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            Beranda
          </button>
        </div>

        {/* Hasil Deteksi */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Hasil Analisis</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Informasi */}
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Jenis Jerawat</p>
                <p className="text-2xl font-bold text-gray-800">{detection.acneType}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Tingkat Keparahan</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(detection.severity)}`}>
                  <span>{getSeverityIcon(detection.severity)}</span>
                  {getSeverityText(detection.severity)}
                </span>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Tingkat Keyakinan AI</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${(detection.confidence || 0.85) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-700">{(detection.confidence || 0.85) * 100}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rekomendasi Skincare */}
        {detection.products && detection.products.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-600" />
              Rekomendasi Skincare untuk {detection.acneType}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {detection.products.map((product, idx) => (
                <Link
                  key={idx}
                  to={`/product/${product.id}`}
                  className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64?text=Product';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{product.rating || 4.5}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 font-semibold">
                        Rp {(product.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tips Perawatan */}
        {detection.tips && detection.tips.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Tips Perawatan untuk {detection.acneType}
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              {detection.tips.map((tip, idx) => (
                <li key={idx}>• {tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tombol Save - hanya muncul jika belum login */}
        {!isLoggedIn && (
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
            <p className="text-blue-700 text-sm mb-3">
              💾 Ingin menyimpan hasil analisis ini ke riwayat?
            </p>
            <button
              onClick={handleSaveToHistory}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all disabled:opacity-50 inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Login untuk Simpan Riwayat'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}