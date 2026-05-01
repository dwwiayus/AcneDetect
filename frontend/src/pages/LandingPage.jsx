import React from 'react'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import FeatureSection from '../components/landing/FeatureSection'
import UploadPreviewSection from '../components/landing/UploadPreviewSection'
import Footer from '../components/landing/Footer'
import PageTransition from '../components/shared/PageTransition'

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(to bottom, #3c8b89, #2a6360 120px, #f0f7f7 120px)' }}>
      <Navbar />
      <PageTransition>
        <div className="flex justify-center px-4">
          <div style={{ width: '90%', maxWidth: '1152px' }}>
            <div className="bg-white rounded-2xl border border-yellow shadow-sm p-6">
              <HeroSection />
            </div>
          </div>
        </div>
        <HowItWorksSection />
        <FeatureSection />
        <UploadPreviewSection />
      </PageTransition>
      <Footer />
    </div>
  )
}

export default LandingPage
