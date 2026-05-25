import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const AI_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
})

export const aiApi = axios.create({
  baseURL: AI_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const USE_MOCK = false

export const saveHistory = (data) => {
  return api.post('/api/history', data)
}

export const getHistory = () => {
  return api.get('/api/history')
}

export const deleteHistory = (id) => {
  return api.delete(`/api/history/${id}`)
}

export const getFavoriteProducts = () => {
  return api.get('/api/favorites')
}

export const deleteFavoriteProduct = (id) => {
  return api.delete(`/api/favorites/${id}`)
}

export const saveFavoriteProduct = (product) => {
  return api.post('/api/favorites', { product })
}