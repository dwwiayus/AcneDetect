const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000'
const DEFAULT_SKIN_TYPE = 'Berminyak'
const MAX_RECOMMENDATIONS = 5

const callAIAnalyze = async (filePath, filename, jenisKulit) => {
  const formData = new FormData()

  formData.append('file', fs.createReadStream(filePath), {
    filename,
    contentType: 'image/jpeg',
  })

  const response = await axios.post(`${FASTAPI_URL}/acne/analyze`, formData, {
    params: {
      jenis_kulit: jenisKulit,
      top_n: MAX_RECOMMENDATIONS,
    },
    headers: formData.getHeaders(),
    timeout: 30000,
  })

  return response.data
}

const detect = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File gambar wajib diunggah' })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    const jenisKulit = req.body.jenis_kulit || DEFAULT_SKIN_TYPE
    const filePath = path.join(__dirname, '..', '..', 'uploads', req.file.filename)

    const aiResult = await callAIAnalyze(filePath, req.file.filename, jenisKulit)

    res.json({
      imageUrl,
      filename: aiResult.filename,
      inference_time_ms: aiResult.inference_time_ms,
      acne: aiResult.acne,
      jenis_kulit: aiResult.jenis_kulit,
      total_rekomendasi: aiResult.total_rekomendasi,
      rekomendasi: aiResult.rekomendasi || [],
    })
  } catch (err) {
    console.error('Detect error:', err.response?.data || err.message)

    res.status(500).json({
      message: 'Gagal menganalisis gambar dengan AI',
      detail: err.response?.data || err.message,
    })
  }
}

module.exports = { detect }