import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import Footer from '../components/landing/Footer'
import ImagePreview from '../components/upload/ImagePreview'
import DetectButton from '../components/upload/DetectButton'
import LoadingOverlay from '../components/upload/LoadingOverlay'
import PageTransition from '../components/shared/PageTransition'
import { useDetection } from '../hooks/useDetection'

const NormalIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M12 20l6 6 10-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BerminyakIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path d="M20 4 C20 4 8 18 8 26 C8 32.627 13.373 38 20 38 C26.627 38 32 32.627 32 26 C32 18 20 4 20 4Z" fill="currentColor" opacity="0.85" />
    <path d="M14 28 C14 28 14 22 20 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const KeringIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path d="M20 4 C20 4 8 18 8 26 C8 32.627 13.373 38 20 38 C26.627 38 32 32.627 32 26 C32 18 20 4 20 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M26 26 C26 22.686 23.314 20 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const KombinasiIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path d="M14 5 C14 5 6 15 6 21 C6 25.418 9.582 29 14 29 C18.418 29 22 25.418 22 21 C22 15 14 5 14 5Z" fill="currentColor" opacity="0.7" />
    <path d="M26 10 C26 10 18 20 18 26 C18 30.418 21.582 34 26 34 C30.418 34 34 30.418 34 26 C34 20 26 10 26 10Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
  </svg>
)

const SensitifIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path d="M20 34 L8 22 C5 19 5 14 8 11 C11 8 16 8 19 11 L20 12 L21 11 C24 8 29 8 32 11 C35 14 35 19 32 22 Z" fill="currentColor" opacity="0.8" />
    <path d="M10 21 L13 16 L16 22 L19 18 L22 24 L25 20 L28 21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const skinTypeOptions = [
  { label: 'Berminyak', Icon: BerminyakIcon },
  { label: 'Kering', Icon: KeringIcon },
  { label: 'Normal', Icon: NormalIcon },
  { label: 'Kombinasi', Icon: KombinasiIcon },
  { label: 'Sensitif', Icon: SensitifIcon },
]

const UploadDetectPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [file, setFile] = useState(null)
  const [skinType, setSkinType] = useState('Berminyak')
  const { detect, loading } = useDetection()

  useEffect(() => {
    if (location.state?.file) {
      setFile(location.state.file)
    }
  }, [location])

  const handleDetect = async () => {
    if (!file) return

    try {
      await detect(file, skinType)
      navigate('/result')
    } catch {
      // error handled in hook
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(to bottom, #3c8b89, #2a6360 120px, #f0f7f7 120px)',
      }}
    >
      <Navbar />

      <main className="flex-1">
        <PageTransition>
          <div className="flex justify-center px-4 py-8">
            <div className="w-full max-w-2xl">
              <div className="card-yellow shadow-sm p-6">
                <h1 className="text-xl font-semibold text-text text-center mb-2">
                  Deteksi Jerawat
                </h1>

                <p className="text-text-muted text-xs text-center mb-6">
                  Pilih jenis kulit Anda, lalu klik deteksi
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-text mb-2">
                    Jenis Kulit
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {skinTypeOptions.map(({ label, Icon }) => {
                      const active = skinType === label

                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setSkinType(label)}
                          className={`px-3 py-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition ${
                            active
                              ? 'border-teal bg-teal-xlight text-teal-dark'
                              : 'border-gray-200 bg-white text-text-muted hover:border-teal'
                          }`}
                        >
                          <Icon />
                          {label}
                        </button>
                      )
                    })}
                  </div>

                  <p className="text-tiny text-text-muted mt-2">
                    Pilih jenis kulit Anda untuk rekomendasi yang lebih akurat
                  </p>
                </div>

                {file ? (
                  <div className="space-y-4">
                    <ImagePreview file={file} onRemove={() => setFile(null)} />
                    <DetectButton onClick={handleDetect} disabled={!file} loading={loading} />
                  </div>
                ) : (
                  <div className="text-center text-xs text-text-muted bg-white/70 rounded-xl p-4">
                    Silakan kembali ke halaman utama dan upload foto wajah terlebih dahulu.
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageTransition>
      </main>

      <Footer />

      {loading && <LoadingOverlay />}
    </div>
  )
}

export default UploadDetectPage