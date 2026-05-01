require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth')
const detectRoutes = require('./routes/detect')
const historyRoutes = require('./routes/history')
const productRoutes = require('./routes/products')
const contactRoutes = require('./routes/contact')

const app = express()
const PORT = process.env.PORT || 5000

// ── Middlewares ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve upload imge
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Routes 
app.use('/api/auth', authRoutes)
app.use('/api/detect', detectRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/products', productRoutes)
app.use('/api/contact', contactRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} tidak ditemukan` })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File terlalu besar (max 5MB)' })
  }
  // Multer file type error
  if (err.message && err.message.includes('Format file')) {
    return res.status(400).json({ message: err.message })
  }

  res.status(500).json({ message: 'Terjadi kesalahan server' })
})

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 AcneDetect API running on http://localhost:${PORT}`)
  console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`)
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`)
})

module.exports = app
