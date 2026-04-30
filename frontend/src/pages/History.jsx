import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Activity, Search, ChevronRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function History({ isLoggedIn, username, onLogout }) {
  const navigate = useNavigate();
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // Cek login
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history');
      setDetections(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Gagal mengambil riwayat deteksi');
      }
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      Mild: 'bg-green-100 text-green-700',
      Moderate: 'bg-yellow-100 text-yellow-700',
      Severe: 'bg-red-100 text-red-700'
    };
    return styles[severity] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />
      
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Riwayat Deteksi</h1>
          <p className="text-gray-500 mt-2">Semua hasil analisis jerawat Anda</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan jenis atau tingkat keparahan..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all bg-white/70 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* List Detections */}
        {detections.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-12 text-center">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada riwayat deteksi</p>
            <button 
              onClick={() => navigate('/detect')}
              className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-md transition-all"
            >
              Analisis Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {detections
              .filter(d => d.acneType.toLowerCase().includes(filter.toLowerCase()) ||
                          d.severity.toLowerCase().includes(filter.toLowerCase()))
              .map((detection) => (
                <Link
                  key={detection.id}
                  to={`/result/${detection.id}`}
                  className="block bg-white/70 backdrop-blur-sm rounded-xl border border-white/30 p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={detection.imageUrl}
                      alt="Thumbnail"
                      className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg bg-gray-100"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/96?text=No+Image';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{detection.acneType}</h3>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSeverityBadge(detection.severity)}`}>
                            {detection.severity === 'Mild' ? 'Ringan' : detection.severity === 'Moderate' ? 'Sedang' : 'Parah'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(detection.createdAt)}
                        </div>
                      </div>
                      
                      {detection.recommendations && detection.recommendations.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {detection.recommendations.slice(0, 2).map((rec, idx) => (
                            <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {rec.name}
                            </span>
                          ))}
                          {detection.recommendations.length > 2 && (
                            <span className="text-xs text-gray-400">+{detection.recommendations.length - 2} produk</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}