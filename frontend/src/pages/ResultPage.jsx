import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import PageTransition from '../components/shared/PageTransition'
import { useAppStore } from '../store/useAppStore'
import {
  saveHistory as saveHistoryApi,
  saveFavoriteProduct,
} from '../utils/api'
import {
  ArrowLeft,
  Bookmark,
  User,
  Calendar,
  Circle,
  Sparkles,
  Camera,
  Heart,
  Copy,
  Check,
} from 'lucide-react'

const getConfidencePercent = (value) => {
  if (!value) return 0
  if (typeof value === 'string') return parseFloat(value.replace('%', '').trim()) || 0
  if (typeof value === 'number') return value <= 1 ? value * 100 : value
  return 0
}

const getMasalahKulit = (level) => {
  if (level === 0) return ['Kulit normal', 'Pencegahan jerawat']
  if (level === 1) return ['Jerawat ringan', 'Komedo', 'Pori tersumbat']
  if (level === 2) return ['Jerawat', 'Pori besar', 'Kusam', 'Bekas jerawat']
  return ['Jerawat berat', 'Peradangan', 'Bekas jerawat']
}

const getSeverityInfo = (level) => {
  if (level === 0) {
    return {
      label: 'Tidak ada jerawat / sangat ringan',
      badge: 'bg-green-50 text-green-600 border-green-200',
      description: 'Kulit dalam kondisi baik. Fokus pada perawatan dan pencegahan.',
    }
  }

  if (level === 1) {
    return {
      label: 'Jerawat Ringan',
      badge: 'bg-blue-50 text-blue-600 border-blue-200',
      description: 'Beberapa komedo atau jerawat kecil. Butuh perawatan rutin.',
    }
  }

  if (level === 2) {
    return {
      label: 'Jerawat Sedang',
      badge: 'bg-orange-50 text-orange-600 border-orange-200',
      description: 'Jerawat cukup banyak. Perlu bahan aktif yang lebih targeted.',
    }
  }

  return {
    label: 'Jerawat Berat',
    badge: 'bg-red-50 text-red-600 border-red-200',
    description: 'Jerawat parah dan meluas. Skincare intensif dan konsultasi dokter disarankan.',
  }
}

const getRecommendedProductCount = (level, totalProducts) => {
  if (level === 0) return Math.min(2, totalProducts)
  if (level === 1) return Math.min(4, totalProducts)
  if (level === 2) return Math.min(6, totalProducts)
  return Math.min(6, totalProducts)
}

const getProductName = (product) => {
  if (product.brand && product.produk) return `${product.brand} - ${product.produk}`
  return product.name || product.produk || 'Produk Skincare'
}

const getProductIngredient = (product) => {
  return product.bahan_aktif || product.ingredients || '-'
}

const getProductDescription = (product) => {
  return product.catatan || product.description || 'Rekomendasi skincare untuk kulit Anda.'
}

const getProductType = (product) => {
  return product.jenis_produk || product.category || product.type || 'Skincare'
}

const getProductSearchLink = (product) => {
  const productName = getProductName(product)
  const encodedName = encodeURIComponent(productName)
  return `https://www.tokopedia.com/search?st=product&q=${encodedName}`
}

const ResultPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { detectionResult, historyList = [] } = useAppStore()

  const [historySaved, setHistorySaved] = React.useState(false)
  const [copiedProductId, setCopiedProductId] = React.useState(null)
  const [favoriteProducts, setFavoriteProducts] = React.useState({})

  const isFromHistory = !!id
  const result = isFromHistory
    ? historyList.find((item) => String(item.id) === String(id))
    : detectionResult

  if (!result) {
    return (
      <div className="min-h-screen mesh-bg flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 text-center">
          <div className="card-yellow p-8 shadow-sm">
            <p className="text-text-muted text-sm mb-4">
              Data hasil deteksi tidak ditemukan.
            </p>

            <button
              onClick={() => navigate('/detect')}
              className="bg-teal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-dark transition"
            >
              Mulai Deteksi Baru
            </button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  const acne = result.acne || {}
  const acneLevel = result.acneLevel ?? acne.acne_level ?? 0
  const severityInfo = getSeverityInfo(acneLevel)

  const acneLabel =
    result.acneLabel ||
    acne.acne_label ||
    `Tingkat ${acneLevel} — ${severityInfo.label}`

  const acneDescription =
    result.acneDeskripsi ||
    acne.acne_deskripsi ||
    severityInfo.description

  const confidence = getConfidencePercent(
    result.confidencePct ||
      acne.confidence_pct ||
      result.confidence ||
      acne.confidence
  )

  const skinType = result.jenis_kulit || result.skinType || 'Berminyak'
  const products = result.rekomendasi || result.products || []
  const maxProducts = getRecommendedProductCount(acneLevel, products.length)
  const displayedProducts = products.slice(0, maxProducts)

  const masalahKulit = getMasalahKulit(acneLevel)
  const needsDoctor = acne.saran_dokter ?? result.saranDokter ?? acneLevel === 3

  const date = result.date
    ? new Date(result.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })

  const handleSaveHistory = async () => {
    if (historySaved || isFromHistory) return

    try {
      await saveHistoryApi({
        imageUrl: result.imageUrl,
        acne: result.acne,
        jenis_kulit: result.jenis_kulit || skinType,
        rekomendasi: result.rekomendasi || products,
      })

      setHistorySaved(true)
    } catch (error) {
      console.error('Save history error:', error.response?.data || error)
    }
  }

  const handleCopyProduct = (product, index) => {
    const productName = getProductName(product)
    const productLink = getProductSearchLink(product)
    const copyText = `${productName}\nCari di e-commerce: ${productLink}`

    navigator.clipboard.writeText(copyText).then(() => {
      setCopiedProductId(index)
      setTimeout(() => setCopiedProductId(null), 1500)
    })
  }

  const handleSaveFavorite = async (product, index) => {
    try {
      await saveFavoriteProduct(product)

      setFavoriteProducts((prev) => ({
        ...prev,
        [index]: true,
      }))
    } catch (error) {
      console.error('Save favorite error:', error.response?.data || error)
    }
  }

  const isProductFavorite = (index) => {
    return !!favoriteProducts[index]
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <Navbar />

      <PageTransition>
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 text-sm mb-6 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>

          <div className="grid md:grid-cols-[300px_1fr] gap-6 mb-8">
            <div className="card-yellow p-4 shadow-sm">
              <div className="h-64 rounded-xl overflow-hidden bg-teal/30 flex items-center justify-center">
                {result.imageUrl ? (
                  <img
                    src={result.imageUrl}
                    alt="Hasil deteksi"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={56} className="text-white/80" />
                )}
              </div>

              <div className="flex justify-center mt-4">
                <span className="px-4 py-2 rounded-full bg-teal/10 text-teal text-xs font-semibold border border-teal/20 inline-flex items-center gap-1">
                  <Camera size={13} />
                  Hasil Deteksi
                </span>
              </div>
            </div>

            <div className="card-yellow p-6 shadow-sm">
              <h1 className="text-xl font-bold text-text mb-4">
                Hasil Analisis AI
              </h1>

              <div className="mb-4">
                <p className="text-xs font-bold text-text-muted uppercase mb-2">
                  ▣ Level Jerawat
                </p>

                <span
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border ${severityInfo.badge}`}
                >
                  {acneLabel}
                </span>
              </div>

              <div className="flex gap-1 mb-3">
                <div className="h-2 flex-1 rounded-full bg-green-500" />
                <div className="h-2 flex-1 rounded-full bg-yellow" />
                <div className="h-2 flex-1 rounded-full bg-orange-500" />
                <div className="h-2 flex-1 rounded-full bg-gray-200" />
              </div>

              <p className="text-sm text-text-muted mb-4">
                {acneDescription}
              </p>

              <div className="mb-4">
                <p className="text-xs font-bold text-text-muted uppercase mb-2">
                  ⚕ Butuh Pengawasan Dokter
                </p>

                <span
                  className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border ${
                    needsDoctor
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-green-50 text-green-600 border-green-200'
                  }`}
                >
                  {needsDoctor
                    ? 'Ya — Perlu konsultasi dokter'
                    : 'Tidak — Bisa ditangani mandiri'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-text-muted uppercase mb-2">
                  ⓘ Masalah Kulit
                </p>

                <div className="flex flex-wrap gap-2">
                  {masalahKulit.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-text-muted uppercase mb-1">
                  ⓘ Akurasi AI
                </p>

                <h2 className="text-3xl font-extrabold text-text mb-2">
                  {confidence.toFixed(2)}%
                </h2>

                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-5">
                <span className="flex items-center gap-2">
                  <Calendar size={15} />
                  Tanggal <strong className="text-text">{date}</strong>
                </span>

                <span className="flex items-center gap-2">
                  <Circle size={15} />
                  Jenis Kulit <strong className="text-text">{skinType}</strong>
                </span>
              </div>

              {!isFromHistory && (
                <button
                  onClick={handleSaveHistory}
                  disabled={historySaved}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${
                    historySaved
                      ? 'bg-teal/20 text-teal cursor-not-allowed'
                      : 'bg-teal text-white hover:bg-teal-dark'
                  }`}
                >
                  <Bookmark
                    size={18}
                    className={historySaved ? 'fill-teal text-teal' : ''}
                  />
                  {historySaved ? 'Tersimpan di History' : 'Simpan ke History'}
                </button>
              )}
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-text">
                Rekomendasi Skincare
              </h2>

              {displayedProducts[0] && (
                <span className="hidden md:inline-flex px-4 py-2 rounded-full border border-yellow text-orange-600 text-xs font-bold bg-yellow/20">
                  ✦ {getProductName(displayedProducts[0]).slice(0, 24)}... — #1 AI Pick
                </span>
              )}
            </div>

            <div className="max-h-[720px] overflow-y-auto pr-2">
              <div className="grid md:grid-cols-3 gap-5">
                {displayedProducts.map((product, index) => {
                  const rank = index + 1
                  const isTopPick = rank === 1
                  const isFavorite = isProductFavorite(index)
                  const isCopied = copiedProductId === index

                  return (
                    <div
                      key={product.rank || index}
                      className="card-yellow card-hover p-5 shadow-sm min-h-[240px] flex flex-col"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            isTopPick
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-text-muted'
                          }`}
                        >
                          {isTopPick ? '★ Terbaik #1' : `Rank #${rank}`}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleSaveFavorite(product, index)}
                          className="p-1 rounded-full hover:bg-pink-50 transition"
                          aria-label="Tambah ke favorit"
                        >
                          <Heart
                            size={18}
                            className={
                              isFavorite
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400'
                            }
                          />
                        </button>
                      </div>

                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-violet-50 text-violet-500">
                        <Sparkles size={25} />
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

                      <div className="flex items-center justify-between mt-2">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-teal/10 text-teal border border-teal/20">
                          {getProductType(product)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCopyProduct(product, index)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                          {isCopied ? (
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
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </div>
  )
}

export default ResultPage