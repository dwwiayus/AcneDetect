import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import PageTransition from '../components/shared/PageTransition'
import { getFavoriteProducts, deleteFavoriteProduct } from '../utils/api'
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Trash2,
  Copy,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react'

const getProductName = (product) => {
  if (product.brand && product.produk) return `${product.brand} - ${product.produk}`
  return product.name || product.produk || 'Produk Skincare'
}

const getProductIngredient = (product) => {
  return product.bahan_aktif || product.ingredients || product.ingredient || '-'
}

const getProductDescription = (product) => {
  return product.catatan || product.description || 'Rekomendasi skincare untuk kulit Anda.'
}

const getProductType = (product) => {
  return product.jenis_produk || product.category || product.type || 'Skincare'
}

const DeleteFavoriteModal = ({ productName, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} />
        </div>

        <h2 className="text-lg font-bold text-center text-text mb-2">
          Hapus Produk Favorit?
        </h2>

        <p className="text-sm text-text-muted text-center mb-6">
          Produk <span className="font-semibold text-text">{productName}</span> akan dihapus dari daftar favorit.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-text-muted text-sm font-semibold hover:bg-gray-50 transition"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

const FavoritesPage = () => {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const loadFavorites = async () => {
    try {
      const res = await getFavoriteProducts()
      setFavorites(res.data || [])
    } catch (error) {
      console.error('Get favorite products error:', error.response?.data || error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()
  }, [])

  const openDeleteModal = (item) => {
    setDeleteTarget(item)
  }

  const closeDeleteModal = () => {
    setDeleteTarget(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return

    try {
      await deleteFavoriteProduct(deleteTarget.id)

      setFavorites((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id)
      )

      setDeleteTarget(null)
    } catch (error) {
      console.error('Delete favorite error:', error.response?.data || error)
    }
  }

  const handleCopy = async (item) => {
    const product = item.product || item.product_data || item
    const productName = getProductName(product)

    try {
      await navigator.clipboard.writeText(productName)
      setCopiedId(item.id)

      setTimeout(() => {
        setCopiedId(null)
      }, 1500)
    } catch (error) {
      console.error('Copy error:', error)
    }
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <Navbar />

      <PageTransition>
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 text-sm mb-6 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>

          <section className="card-yellow shadow-xl p-8 min-h-[360px]">
            <div className="flex items-start gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center">
                <Heart size={22} className="fill-pink-500" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-text">
                  Produk Favorit
                </h1>
                <p className="text-sm text-text-muted">
                  {favorites.length} produk tersimpan
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-text-muted">
                Memuat produk favorit...
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-500 mx-auto flex items-center justify-center mb-4">
                  <Heart size={34} />
                </div>

                <h2 className="text-lg font-bold text-text mb-2">
                  Belum Ada Favorit
                </h2>

                <p className="text-sm text-text-muted mb-6">
                  Tap ikon ♡ pada produk rekomendasi untuk menyimpannya
                </p>

                <button
                  onClick={() => navigate('/detect')}
                  className="bg-teal text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-teal-dark transition"
                >
                  Mulai Deteksi
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {favorites.map((item) => {
                  const product = item.product || item.product_data || item

                  return (
                    <div
                      key={item.id}
                      className="card-yellow card-hover p-5 shadow-sm min-h-[220px] flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet-50 text-violet-500">
                          <Sparkles size={25} />
                        </div>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(item)}
                          className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition"
                          title="Hapus produk favorit"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <h3 className="font-bold text-base mb-1 line-clamp-1">
                        {getProductName(product)}
                      </h3>

                      <p className="text-xs text-text-muted mb-2">
                        · {getProductIngredient(product)}
                      </p>

                      <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-4 flex-1">
                        {getProductDescription(product)}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-teal/10 text-teal border border-teal/20">
                          {getProductType(product)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCopy(item)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check size={12} />
                              Tersalin
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              Salin
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </main>
      </PageTransition>

      <Footer />

      {deleteTarget && (
        <DeleteFavoriteModal
          productName={getProductName(
            deleteTarget.product || deleteTarget.product_data || deleteTarget
          )}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

export default FavoritesPage