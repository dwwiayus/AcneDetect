import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, TrendingUp, Droplet, Clock, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function Result({ userId }) {
  const { detectionId } = useParams()
  const navigate = useNavigate()
  const [detection, setDetection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDetection()
  }, [detectionId])

  const fetchDetection = async () => {
    try {
      const response = await api.get(`/detection/${detectionId}`)
      setDetection(response.data)
    } catch (error) {
      toast.error('Gagal mengambil hasil deteksi')
      navigate('/history')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Mild': return 'text-green-600 bg-green-100'
      case 'Moderate': return 'text-yellow-600 bg-yellow-100'
      case 'Severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Mild': return '🟢'
      case 'Moderate': return '🟡'
      case 'Severe': return '🔴'
      default: return '⚪'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!detection) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali ke Riwayat
        </button>

        {/* Hasil Deteksi */}
        <div className="card animate-fade-in mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hasil Deteksi</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gambar */}
            <div>
              <img
                src={detection.imageUrl}
                alt="Detected"
                className="w-full rounded-xl border border-gray-200"
              />
            </div>

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
                  {detection.severity}
                </span>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Confidence Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-500"
                      style={{ width: `${detection.confidence * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold">{(detection.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rekomendasi Skincare */}
        {detection.recommendations && detection.recommendations.length > 0 && (
          <div className="card animate-slide-up mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Droplet className="w-6 h-6 text-secondary" />
              Rekomendasi Skincare
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {detection.recommendations.map((product, idx) => (
                <Link
                  key={idx}
                  to={`/product/${product.id}`}
                  className="flex gap-3 p-3 border border-gray-100 rounded-xl hover:shadow-md transition-all hover:border-primary"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">4.5</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 font-semibold">
                        Rp {product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-green-50 rounded-xl p-4">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Tips Perawatan
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Gunakan skincare sesuai rekomendasi secara rutin</li>
            <li>• Jangan memencet jerawat untuk menghindari bekas</li>
            <li>• Gunakan sunscreen setiap hari (SPF 30+)</li>
            <li>• Konsultasi ke dermatologis jika kondisi memburuk</li>
          </ul>
        </div>
      </div>
    </div>
  )
}