import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import UploadArea from '../components/upload/UploadArea'
import ImagePreview from '../components/upload/ImagePreview'
import DetectButton from '../components/upload/DetectButton'
import LoadingOverlay from '../components/upload/LoadingOverlay'
import PageTransition from '../components/shared/PageTransition'
import { useDetection } from '../hooks/useDetection'
import { compressImage } from '../utils/imageCompressor'
import toast from 'react-hot-toast'

const UploadDetectPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const { detect, loading } = useDetection()

  useEffect(() => {
    if (location.state?.file) {
      setFile(location.state.file)
    }
  }, [location.state])

  const handleFileSelect = async (selectedFile) => {
    try {
      const compressed = await compressImage(selectedFile)
      setFile(compressed)
    } catch {
      toast.error('Gagal mengompres gambar')
      setFile(selectedFile)
    }
  }

  const handleDetect = async () => {
    if (!file) return
    try {
      await detect(file)
      navigate('/result')
    } catch {
      // error handled in hook
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <PageTransition>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-section-title md:text-xl font-semibold text-text text-center mb-2">
            Deteksi Jerawat
          </h1>
          <p className="text-text-muted text-xs text-center mb-8">
            Unggah foto wajah Anda untuk analisis AI
          </p>

          {!file ? (
            <UploadArea onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-4">
              <ImagePreview file={file} onRemove={() => setFile(null)} />
              <DetectButton onClick={handleDetect} disabled={!file} loading={loading} />
            </div>
          )}
        </div>
      </PageTransition>
      {loading && <LoadingOverlay />}
    </div>
  )
}

export default UploadDetectPage
