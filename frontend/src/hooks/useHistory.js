import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { api, USE_MOCK } from '../utils/api'
import toast from 'react-hot-toast'

export const useHistory = () => {
  const [loading, setLoading] = useState(false)
  const { historyList, setHistory, addToHistory, removeFromHistory, detectionResult } = useAppStore()

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      if (USE_MOCK) {
        // Only seed mock data if historyList is completely empty (first run)
        // Zustand persist already restores saved history from localStorage
        // Do NOT overwrite existing data
        setLoading(false)
        return
      }
      const { data } = await api.get('/api/history')
      setHistory(data)
    } catch (error) {
      toast.error('Gagal memuat riwayat')
    } finally {
      setLoading(false)
    }
  }, [setHistory])

  const saveResult = async () => {
    if (!detectionResult) return
    const newRecord = {
      id: Date.now().toString(),
      imageUrl: detectionResult.imageUrl,
      date: new Date().toISOString(),
      acneCount: detectionResult.acneCount,
      severity: detectionResult.severity,
      areas: detectionResult.areas,
    }

    addToHistory(newRecord)
    toast.success('Disimpan ke riwayat!')

    if (!USE_MOCK) {
      try {
        await api.post('/api/history', detectionResult)
      } catch {
        removeFromHistory(newRecord.id)
        toast.error('Gagal menyimpan riwayat')
      }
    }
  }

  const deleteHistory = async (id) => {
    removeFromHistory(id)
    toast.success('Riwayat dihapus')
    if (!USE_MOCK) {
      try {
        await api.delete(`/api/history/${id}`)
      } catch {
        toast.error('Gagal menghapus riwayat')
      }
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { historyList, loading, fetchHistory, saveResult, deleteHistory }
}

