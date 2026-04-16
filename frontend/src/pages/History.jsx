import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Activity, Search, ChevronRight, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function History({ userId }) {
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history')
      setDetections(response.data)
    } catch (error) {
      toast.error('Gagal mengambil riwayat deteksi')
    } finally {
      setLoading(false)
    }
  }

  const filteredDetections = detections.filter(d =>
    d.acneType.toLowerCase().includes(filter.toLowerCase()) ||
    d.severity.toLowerCase().includes(filter.toLowerCase())
  )

  const getSeverityBadge = (severity) => {
    const styles = {
      Mild: 'bg-green-100 text-green-700',
      Moderate: 'bg-yellow-100 text-yellow-700',
      Severe: 'bg-red-100 text-red-700'
    }
    return styles[severity] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Riwayat Deteksi</h1>
          <p className="text-gray-600 mt-2">Semua hasil deteksi jerawat Anda</p>
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
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* List Detections */}
        {filteredDetections.length === 0 ? (
          <div className="card text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada riwayat deteksi</p>
            <Link to="/detect" className="btn-primary mt-4 inline-block">
              Deteksi Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDetections.map((detection) => (
              <Link
                key={detection.id}
                to={`/result/${detection.id}`}
                className="card block hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={detection.imageUrl}
                    alt="Thumbnail"
                    className="w-full md:w-24 h-32 md:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{detection.acneType}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSeverityBadge(detection.severity)}`}>
                          {detection.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {formatDate(detection.createdAt)}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {detection.recommendations?.slice(0, 2).map((rec, idx) => (
                        <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {rec.name}
                        </span>
                      ))}
                      {detection.recommendations?.length > 2 && (
                        <span className="text-xs text-gray-400">+{detection.recommendations.length - 2} produk</span>
                      )}
                    </div>
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
  )
}