import React from 'react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import HistoryList from '../components/history/HistoryList'
import PageTransition from '../components/shared/PageTransition'
import { useHistory } from '../hooks/useHistory'

const HistoryPage = () => {
  const { historyList, loading, deleteHistory } = useHistory()

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          'linear-gradient(to bottom, #3c8b89, #2a6360 120px, #f0f7f7 120px)',
      }}
    >
      <Navbar />

      <main className="flex-1">
        <PageTransition>
          <div className="flex justify-center px-4 py-8">
            <div className="w-full max-w-4xl">
              <div className="card-yellow shadow-sm p-6">
                <h1 className="text-section-title md:text-xl font-semibold text-text mb-2">
                  Riwayat Deteksi
                </h1>

                <p className="text-text-muted text-xs mb-6">
                  Lihat dan kelola riwayat deteksi jerawat Anda
                </p>

                <HistoryList
                  historyList={historyList}
                  loading={loading}
                  onDelete={deleteHistory}
                />
              </div>
            </div>
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  )
}

export default HistoryPage