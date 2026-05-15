import React, { useState } from 'react'
import {
  Droplets, Sun, FlaskConical, Sparkles, Shield,
  Moon, Droplet, Eye, Info, Heart,
  Copy, CheckCircle
} from 'lucide-react'

// Mapping kategori ke ikon
const getCategoryIcon = (category) => {
  const icons = {
    Cleanser: Droplets,
    'Facial Wash': Droplets,
    Moisturizer: Droplet,
    Sunscreen: Sun,
    SPF: Sun,
    Serum: FlaskConical,
    Treatment: Sparkles,
    'Spot Treatment': Sparkles,
    'Night Cream': Moon,
    Retinol: Moon,
    Toner: Eye,
    default: Shield
  }

  return icons[category] || icons.default
}

// Mapping kategori ke warna
const getCategoryColor = (category) => {
  const colors = {
    Cleanser: 'bg-blue-100 text-blue-600',
    'Facial Wash': 'bg-blue-100 text-blue-600',
    Moisturizer: 'bg-green-100 text-green-600',
    Sunscreen: 'bg-yellow-100 text-yellow-600',
    SPF: 'bg-yellow-100 text-yellow-600',
    Serum: 'bg-purple-100 text-purple-600',
    Treatment: 'bg-orange-100 text-orange-600',
    'Spot Treatment': 'bg-orange-100 text-orange-600',
    'Night Cream': 'bg-indigo-100 text-indigo-600',
    Retinol: 'bg-indigo-100 text-indigo-600',
    Toner: 'bg-teal-100 text-teal-600',
    default: 'bg-gray-100 text-gray-600'
  }

  return colors[category] || colors.default
}

const ProductCard = ({ product }) => {
  const [showDetail, setShowDetail] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const Icon = getCategoryIcon(product.category)
  const iconColorClass = getCategoryColor(product.category)

  const mainIngredient = product.ingredients?.split(',')[0] || 'Bahan aktif'

  const shortDescription =
    product.description?.length > 55
      ? `${product.description.substring(0, 55)}...`
      : product.description || 'Deskripsi produk belum tersedia'

  const handleSave = (e) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const handleCopyName = () => {
    navigator.clipboard.writeText(product.name || 'Nama produk')
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      {/* Icon Section */}
      <div
        className={`w-12 h-12 rounded-xl ${iconColorClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon size={24} />
      </div>

      {/* Nama Produk */}
      <h4 className="text-sm font-semibold text-text mb-1 line-clamp-1">
        {product.name || 'Nama Produk'}
      </h4>

      {/* Bahan Aktif Singkat */}
      <div className="mb-2">
        <span className="text-tiny font-medium text-teal bg-teal-xlight px-2 py-0.5 rounded-full">
          ✨ {mainIngredient}
        </span>
      </div>

      {/* Tampilan Sebelum Detail */}
      {!showDetail && (
        <>
          <p className="text-text-muted text-xs mb-2 line-clamp-2">
            {shortDescription}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <span className="text-yellow">⭐</span>
              <span className="text-xs text-text font-medium">
                {product.rating || '4.0'}
              </span>
            </div>

            <span className="text-tiny text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
              {product.category || 'Skincare'}
            </span>
          </div>
        </>
      )}

      {/* Tampilan Setelah Klik Detail */}
      {showDetail && (
        <div className="space-y-3 mb-3">
          <div className="bg-teal-xlight rounded-xl p-3">
            <p className="text-tiny font-medium text-teal mb-1">
              ✨ Bahan Aktif Utama
            </p>
            <p className="text-xs text-text">
              {product.ingredients || 'Tidak tersedia'}
            </p>
          </div>

          <div>
            <p className="text-tiny font-medium text-text-muted mb-1">
              📋 Deskripsi
            </p>
            <p className="text-xs text-text">
              {product.description || 'Deskripsi belum tersedia'}
            </p>
          </div>

          {product.usage && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-tiny font-medium text-text-muted mb-1">
                💡 Cara Penggunaan
              </p>
              <p className="text-xs text-text">{product.usage}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-yellow">⭐</span>
              <span className="text-xs font-semibold text-text">
                {product.rating || '4.0'}
              </span>
              <span className="text-tiny text-text-muted">/ 5.0</span>
            </div>

            <span className="text-tiny text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
              {product.category || 'Skincare'}
            </span>
          </div>

          <button
            onClick={handleCopyName}
            className="w-full flex items-center justify-center gap-1 text-xs bg-gray-100 px-2 py-1.5 rounded-lg hover:bg-gray-200 transition"
          >
            {copied ? (
              <CheckCircle size={14} className="text-green-500" />
            ) : (
              <Copy size={14} />
            )}
            {copied ? 'Tersalin' : 'Salin Nama Produk'}
          </button>
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="flex-1 flex items-center justify-center gap-1 bg-teal text-white py-1.5 rounded-lg text-xs font-medium hover:bg-teal-dark transition"
        >
          <Info size={12} />
          {showDetail ? 'Tutup Detail' : 'Detail'}
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center justify-center gap-1 w-8 py-1.5 rounded-lg transition ${
            isSaved
              ? 'bg-red-100 text-red-500'
              : 'bg-gray-100 text-text-muted hover:bg-gray-200'
          }`}
        >
          <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}

export default ProductCard