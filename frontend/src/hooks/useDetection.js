import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { aiApi, USE_MOCK } from '../utils/api'
import { mockDetectionResult } from '../mock/mockData'
import toast from 'react-hot-toast'

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const useDetection = () => {
  const [loading, setLoading] = useState(false)
  const { setResult } = useAppStore()

  const detect = async (file, jenis_kulit = 'Berminyak') => {
    setLoading(true)

    try {
      const imageBase64 = await fileToBase64(file)

      if (USE_MOCK) {
        const result = {
          ...mockDetectionResult,
          imageUrl: imageBase64,
          skinType: jenis_kulit,
          jenis_kulit,
        }

        setResult(result)
        toast.success('Deteksi berhasil!')
        return result
      }

      const formData = new FormData()
      formData.append('image', file)
      formData.append('file', file)
      formData.append('jenis_kulit', jenis_kulit)
      formData.append('skin_type', jenis_kulit)

      const { data } = await aiApi.post('/acne/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const acne = data.acne || data

      const result = {
        ...data,
        imageUrl: imageBase64,

        severity: acne.acne_label || data.severity,
        severityLevel: acne.acne_level ?? data.severityLevel,
        severityLabel: acne.acne_label || data.severityLabel,
        severityDescription: acne.acne_deskripsi || data.severityDescription,

        confidence: acne.confidence_pct || data.confidencePct || data.confidence,
        confidencePct: acne.confidence_pct || data.confidencePct,

        saranDokter: acne.saran_dokter ?? data.saranDokter,

        skinType: jenis_kulit,
        jenis_kulit,

        masalahKulit: data.masalah_kulit || data.masalahKulit || acne.masalah_kulit || [],

        products: data.rekomendasi || data.products || [],
        rekomendasi: data.rekomendasi || data.products || [],

        date: new Date().toISOString(),
      }

      console.log('RESULT FINAL:', result)

      setResult(result)
      toast.success('Deteksi berhasil!')
      return result
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Terjadi kesalahan saat mendeteksi'

      toast.error(msg)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { detect, loading }
}