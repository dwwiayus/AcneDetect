import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import ResultCard from '../components/result/ResultCard'
import AcneSummary from '../components/result/AcneSummary'
import SkincareRecommendation from '../components/result/SkincareRecommendation'
import SaveResultButton from '../components/result/SaveResultButton'
import PageTransition from '../components/shared/PageTransition'
import { useAppStore } from '../store/useAppStore'
import { useHistory } from '../hooks/useHistory'
import { mockProducts } from '../mock/mockData'
import { ArrowLeft, Calendar } from 'lucide-react'

const ResultPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { detectionResult, historyList } = useAppStore()
  const { saveResult } = useHistory()

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
            <p className="text-text-muted text-sm mb-4">Data hasil deteksi tidak ditemukan.</p>
            <button
              onClick={() => navigate('/detect')}
              className="bg-teal text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Mulai Deteksi
            </button>
          </div>
        </PageTransition>
      </div>
    )
  }

  const formattedDate = result.date
    ? new Date(result.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #3c8b89, #2a6360 120px, #f0f7f7 120px)' }}>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center px-4 py-8">
          <div style={{ width: '75%', maxWidth: '720px' }}>
            <div className="bg-white rounded-2xl border border-yellow shadow-sm p-6">
              {isFromHistory && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-text-muted text-sm mb-6 hover:text-text transition"
                >
                  <ArrowLeft size={18} /> Kembali
                </button>
              )}

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <ResultCard
                    imageUrl={result.imageUrl}
                    severity={result.severity}
                    acneCount={result.acneCount}
                    areas={result.areas}
                  />
                </div>

                <div className="md:w-1/2 space-y-4">
                  <AcneSummary
                    acneCount={result.acneCount}
                    areas={result.areas}
                  />
                  {formattedDate && (
                    <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-xlight rounded-full flex items-center justify-center shrink-0">
                        <Calendar size={18} className="text-teal" />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted">Tanggal Deteksi</p>
                        <p className="text-sm font-medium text-text">{formattedDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!isFromHistory && (
                <div className="mt-6 flex justify-center">
                  <SaveResultButton onSave={saveResult} />
                </div>
              )}

              <div className="mt-10">
                <SkincareRecommendation products={result.products || mockProducts} />
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
