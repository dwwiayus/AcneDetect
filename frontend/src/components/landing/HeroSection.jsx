import React from 'react'

const HeroSection = () => {
  const scrollToUpload = () => {
    const el = document.getElementById('upload-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative bg-gradient-to-br from-[#3c8b89] via-[#2d7a78] to-[#2a6360] text-white overflow-hidden">
      <div className="absolute top-[-60px] right-[-60px] w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute bottom-[-40px] left-[-40px] w-40 h-40 bg-yellow/20 rounded-full blur-xl" />
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center relative z-10">
        <h1 className="text-hero md:text-5xl font-bold mb-4 leading-tight text-yellow">
          Deteksi Jerawat dengan AI Cerdas
        </h1>
        <p className="text-white/80 max-w-xl mx-auto mb-8 text-body md:text-base">
          Unggah foto wajah Anda dan biarkan kecerdasan buatan kami menganalisis kondisi kulit Anda,
          mendeteksi jerawat, dan memberikan rekomendasi skincare yang tepat.
        </p>
        <div className="flex justify-center">
          <button
            onClick={scrollToUpload}
            className="bg-yellow text-text px-8 py-3 rounded-full font-semibold text-sm hover:bg-yellow-dark hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
          >
            Coba Sekarang
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

