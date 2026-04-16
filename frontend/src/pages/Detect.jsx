import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Camera, Upload, X, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function Detect({ userId }) {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setPreview(URL.createObjectURL(uploadedFile))
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const removeImage = () => {
    setFile(null)
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
    setError(null)
  }

  const handleDetect = async () => {
    if (!file) {
      setError('Silakan pilih gambar terlebih dahulu')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await api.post('/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      if (response.data.detectionId) {
        toast.success('Deteksi berhasil!')
        navigate(`/result/${response.data.detectionId}`)
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Deteksi gagal'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Deteksi Jerawat</h1>
          <p className="text-gray-600 mt-2">Upload foto area kulit yang ingin dideteksi</p>
        </div>

        <div className="card animate-fade-in">
          {/* Dropzone */}
          {!preview ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {isDragActive ? 'Lepaskan gambar di sini' : 'Seret & lepas gambar di sini'}
              </p>
              <p className="text-gray-400 text-sm mt-2">atau klik untuk memilih file</p>
              <p className="text-gray-400 text-xs mt-4">Format: JPG, PNG (Maks 5MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-96 object-contain rounded-xl border border-gray-200"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          {preview && (
            <div className="mt-6">
              <button
                onClick={handleDetect}
                disabled={loading}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mendeteksi...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Deteksi Sekarang
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Tips Hasil Terbaik</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Gunakan pencahayaan yang cukup (cahaya alami lebih baik)</li>
            <li>• Foto area jerawat dengan fokus yang jelas</li>
            <li>• Hindari penggunaan makeup atau filter</li>
            <li>• Pastikan area yang difoto tidak terlalu gelap atau silau</li>
          </ul>
        </div>
      </div>
    </div>
  )
}