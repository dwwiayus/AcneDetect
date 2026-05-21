import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import ResultCard from '../components/result/ResultCard'
import AcneSummary from '../components/result/AcneSummary'
import SkincareRecommendation from '../components/result/SkincareRecommendation'
import PageTransition from '../components/shared/PageTransition'
import { useAppStore } from '../store/useAppStore'
import { ArrowLeft, CheckCircle } from 'lucide-react'

const ResultPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { detectionResult, historyList } = useAppStore()

  const isFromHistory = !!id
  const result = isFromHistory
    ? historyList.find((h) => h.id === id)
    : detectionResult

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f7f7] to-[#e6f3f3]">
        <Navbar />
        <PageTransition>
          <div className="max-w-3xl mx-auto px-4 py-8 text-center">
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
          </div>
        </PageTransition>
      </div>
    )
  }

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
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-text-muted text-sm hover:text-text transition"
                >
                  <ArrowLeft size={18} />
                  Kembali ke Home
                </button>

                <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full">
                  <CheckCircle size={14} />
                  <span className="text-tiny font-medium">Deteksi Berhasil</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <ResultCard
                    imageUrl={result.imageUrl}
                    severity={result.severity || result.acneLabel}
                    severityDescription={
                      result.severityDescription || result.acneDeskripsi
                    }
                    confidence={result.confidencePct || result.confidence}
                  />
                </div>

                <div className="md:w-1/2">
                  <AcneSummary
                    severity={result.severity || result.acneLabel}
                    severityLevel={result.severityLevel || result.acneLevel}
                    severityLabel={result.severityLabel || result.acneLabel}
                    confidence={result.confidencePct || result.confidence}
                    skinType={result.skinType}
                    date={
                      result.date
                        ? new Date(result.date).toLocaleDateString('id-ID')
                        : null
                    }
                    saranDokter={result.saranDokter}
                    masalahKulit={result.masalahKulit || result.masalah_kulit || []}
                  />
                </div>
              </div>

              <div className="mt-10">
                <SkincareRecommendation
                  products={result.products || result.rekomendasi || []}
                />
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="bg-teal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-dark transition"
                >
                  + Deteksi Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>

      <Footer />
    </div>
  )
}

export default ResultPage