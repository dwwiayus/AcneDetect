const path = require('path')
const pool = require('../config/db')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'
const DEFAULT_SKIN_TYPE = 'Berminyak'
const MAX_RECOMMENDATIONS = 6

// Panggil AI FastAPI
const callAIAnalyze = async (filePath, filename, jenisKulit = DEFAULT_SKIN_TYPE) => {
  const formData = new FormData()

  formData.append('file', fs.createReadStream(filePath), {
    filename,
    contentType: 'image/jpeg',
  })

  formData.append('jenis_kulit', jenisKulit)
  formData.append('top_n', String(MAX_RECOMMENDATIONS))

  const response = await axios.post(`${FASTAPI_URL}/acne/analyze`, formData, {
    headers: formData.getHeaders(),
    timeout: 30000,
  })

  return response.data
}

// Mapping level AI (0-3) ke severity untuk frontend
const mapLevelToSeverity = (level) => {
  if (level === 0 || level === 1) return 'Mild'
  if (level === 2) return 'Moderate'
  return 'Severe'
}

// Konversi final_score ke rating (3.5 - 5.0)
const calculateRating = (finalScore) => {
  const baseRating = 3.5
  const bonus = (finalScore || 0.5) * 1.5
  return parseFloat((baseRating + Math.min(bonus, 1.5)).toFixed(1))
}

// Mapping rekomendasi AI ke format frontend
const mapRecommendationsToProducts = (recommendations = []) => {
  return recommendations.slice(0, MAX_RECOMMENDATIONS).map((rec, index) => ({
    id: `ai-${index + 1}`,
    name: `${rec.brand || 'Brand'} - ${rec.produk || 'Produk Skincare'}`,
    description: rec.catatan || `Rekomendasi untuk kulit ${rec.untuk_kulit || 'berminyak'}`,
    category: rec.jenis_produk || 'Skincare',
    ingredients: rec.bahan_aktif || 'Tidak tersedia',
    usage: rec.peringatan || 'Gunakan sesuai petunjuk produk',
    rating: calculateRating(rec.final_score),
  }))
}

// Mapping AI result ke frontend (HANYA dari AI, tanpa random)
const mapAIResultToFrontend = (aiResult, imageUrl) => {
  const acneData = aiResult.acne || {}
  const level = acneData.acne_level ?? 0
  const confidencePercent = acneData.confidence_pct || '0%'
  const confidence = parseFloat(confidencePercent.replace('%', '')) || 0

  return {
    imageUrl,
    severity: mapLevelToSeverity(level),
    severityLevel: level,
    severityLabel: acneData.acne_label || `Tingkat ${level}`,
    severityDescription: acneData.acne_deskripsi || 'Hasil deteksi dari sistem AI.',
    confidence: confidence,
    confidenceRaw: acneData.confidence || 0,
    saranDokter: acneData.saran_dokter || false,
    skinType: aiResult.jenis_kulit || DEFAULT_SKIN_TYPE,
    products: mapRecommendationsToProducts(aiResult.rekomendasi),
  }
}

// Fallback jika AI error
const getFallbackResult = async (imageUrl) => {
  const { rows: products } = await pool.query(
    `SELECT 
      id, name, description, category, ingredients,
      usage_instruction AS usage, rating
     FROM products
     ORDER BY rating DESC
     LIMIT $1`,
    [MAX_RECOMMENDATIONS]
  )

  return {
    imageUrl,
    severity: 'Mild',
    severityLevel: 0,
    severityLabel: 'Tidak Terdeteksi',
    severityDescription: 'Sistem tidak dapat mendeteksi dengan optimal. Silakan coba upload foto lain dengan pencahayaan yang lebih baik.',
    confidence: 0,
    confidenceRaw: 0,
    saranDokter: false,
    skinType: DEFAULT_SKIN_TYPE,
    products: products.map(p => ({ ...p, rating: p.rating || 4.0 })),
  }
}

// POST /api/detect
const detect = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File gambar wajib diunggah' })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    const jenisKulit = req.body.jenis_kulit || DEFAULT_SKIN_TYPE
    const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename)

    console.log('📸 File:', req.file.filename)
    console.log('🖼️ Image URL:', imageUrl)
    console.log('🧴 Jenis Kulit:', jenisKulit)

    let result

    try {
      const aiResult = await callAIAnalyze(filePath, req.file.filename, jenisKulit)
      console.log('📦 AI Response (acne):', JSON.stringify(aiResult.acne, null, 2))
      
      result = mapAIResultToFrontend(aiResult, imageUrl)
      
      console.log(`🤖 AI: Level ${result.severityLevel} → ${result.severity} | ${result.confidence}% | ${result.products.length} produk`)
      if (result.saranDokter) {
        console.log('⚠️ Saran: Konsultasi dengan dokter kulit')
      }
    } catch (aiError) {
      console.error('❌ AI Error:', aiError.message)
      if (aiError.response) {
        console.error('📄 Detail:', aiError.response.data)
      }
      result = await getFallbackResult(imageUrl)
    }

    res.json(result)
  } catch (err) {
    console.error('💥 Error:', err)
    res.status(500).json({ message: 'Terjadi kesalahan saat mendeteksi' })
  }
}

module.exports = { detect }