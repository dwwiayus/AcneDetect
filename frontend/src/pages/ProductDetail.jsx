import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Clock, Package, Droplet, Shield, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`)
      setProduct(response.data)
    } catch (error) {
      toast.error('Gagal mengambil detail produk')
      navigate('/history')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'cleanser': return <Droplet className="w-5 h-5" />
      case 'moisturizer': return <Shield className="w-5 h-5" />
      default: return <Package className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        <div className="card animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Gambar */}
            <div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full rounded-2xl border border-gray-200"
              />
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-500">{product.brand}</span>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary`}>
                  {product.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary`}>
                  Untuk {product.acneType}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{product.description}</p>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-primary" />
                  Kandungan Aktif
                </h3>
                <p className="text-gray-600 text-sm">{product.ingredients}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Cara Penggunaan
                </h3>
                <p className="text-gray-600 text-sm">{product.howToUse}</p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-gray-500 text-sm">Harga</p>
                  <p className="text-2xl font-bold text-primary">
                    Rp {product.price.toLocaleString()}
                  </p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Beli Produk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}