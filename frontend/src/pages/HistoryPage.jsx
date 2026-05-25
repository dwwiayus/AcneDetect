import React from 'react'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import HistoryList from '../components/history/HistoryList'
import PageTransition from '../components/shared/PageTransition'
import { useHistory } from '../hooks/useHistory'

const HistoryPage = () => {
  const { historyList, loading, deleteHistory } = useHistory()

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <Navbar />

      <main className="flex-1">
        <PageTransition>
          <section className="flex justify-center px-4 pt-8 pb-16">
            <div className="w-full max-w-[676px]">
              <div
                className="
                  relative overflow-hidden
                  bg-[#fbfdfd]
                  border border-[#efe56f]
                  rounded-[20px]
                  shadow-xl
                  px-6 py-6
                "
              >
                <div
                  // className="
                  //   absolute right-0 bottom-0
                  //   w-[135px] h-full
                  //   bg-[#f2ec80]
                  //   opacity-90
                  //   [clip-path:polygon(70%_0,100%_0,100%_100%,0_100%)]
                  // "
                />

                <div className="relative z-10">
                  <h1 className="text-[23px] font-bold text-[#102c2b] leading-tight">
                    Riwayat Deteksi
                  </h1>

                  <p className="text-[13px] text-[#55706f] mt-1 mb-5">
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
          </section>
        </PageTransition>
      </main>

      <Footer />
    </div>
  )
}

export default HistoryPage