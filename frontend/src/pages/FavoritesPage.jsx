import React, { useEffect, useState } from 'react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import PageTransition from '../components/shared/PageTransition'
import ProductCard from '../components/result/ProductCard'
import { favoritesApi } from '../utils/api'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { data } = await favoritesApi.getAll()
        setFavorites(Array.isArray(data) ? data : data?.favorites || [])
      } catch {
        toast.error('Gagal memuat Favorite')
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          'linear-gradient(to bottom, #3c8b89, #2a6360 120px, #f0f7f7 120px)',
      }}
    >
      <Navbar />

      <PageTransition>
        <div className="flex justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <div className="card-yellow shadow-sm p-6">
              <h1 className="text-section-title md:text-xl font-semibold text-text mb-2">
                Favorite
              </h1>

              <p className="text-text-muted text-xs mb-6">
                Produk skincare yang Anda simpan.
              </p>

              {loading ? (
                <p className="text-sm text-text-muted text-center py-10">
                  Memuat Favorite...
                </p>
              ) : favorites.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart size={34} className="text-pink-500" />
                  </div>

                  <h3 className="text-sm font-semibold text-text mb-1">
                    Belum Ada Favorite
                  </h3>

                  <p className="text-xs text-text-muted">
                    Produk yang disimpan akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((product, index) => (
                    <ProductCard
                      key={product.id || product.product_id || index}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </PageTransition>

      <Footer />
    </div>
  )
}

export default FavoritesPage