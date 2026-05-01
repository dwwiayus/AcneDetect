import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { api, USE_MOCK } from '../utils/api'
import { mockDetectionResult } from '../mock/mockData'
import toast from 'react-hot-toast'

export const useDetection = () => {
  const [loading, setLoading] = useState(false)
  const { setResult } = useAppStore()

  const detect = async (file) => {
    setLoading(true)
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        const result = { ...mockDetectionResult, imageUrl: base64 }
        setResult(result)
        toast.success('Deteksi berhasil!')
        return result
      }

      const formData = new FormData()
      formData.append('image', file)

      const { data } = await api.post('/api/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
      toast.success('Deteksi berhasil!')
      return data
    } catch (error) {
      const msg = error.response?.data?.message || 'Terjadi kesalahan saat mendeteksi'
      toast.error(msg)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { detect, loading }
}

