const path = require('path')
const pool = require('../config/db')

const simulateAIDetection = (imageUrl) => {
  const acneCount = Math.floor(Math.random() * 20) + 1
  const severities = ['Mild', 'Moderate', 'Severe']
  const allAreas = ['Pipi Kiri', 'Pipi Kanan', 'Dahi', 'Hidung', 'Dagu', 'Pelipis']

  let severity
  if (acneCount <= 5) severity = 'Mild'
  else if (acneCount <= 15) severity = 'Moderate'
  else severity = 'Severe'

  const areaCount = Math.floor(Math.random() * 3) + 1
  const shuffled = allAreas.sort(() => 0.5 - Math.random())
  const areas = shuffled.slice(0, areaCount)

  const detections = areas.map(() => ({
    x: Math.floor(Math.random() * 200) + 50,
    y: Math.floor(Math.random() * 200) + 50,
    w: Math.floor(Math.random() * 30) + 10,
    h: Math.floor(Math.random() * 30) + 10,
    confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
  }))

  return { acneCount, severity, areas, detections, accuracy: 94.0 }
}

// POST /api/detect
const detect = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File gambar wajib diunggah' })
    }

    const imageUrl = `/uploads/${req.file.filename}`
    const aiResult = simulateAIDetection(imageUrl)

    // Get product recommendations based on severity
    const { rows: products } = await pool.query(
      `SELECT id, name, description, category, ingredients, usage_instruction as usage, rating, image_url as image
       FROM products 
       WHERE $1 = ANY(for_severity)
       ORDER BY rating DESC
       LIMIT 6`,
      [aiResult.severity]
    )

    const result = {
      imageUrl,
      acneCount: aiResult.acneCount,
      severity: aiResult.severity,
      areas: aiResult.areas,
      accuracy: aiResult.accuracy,
      detections: aiResult.detections,
      products,
    }

    res.json(result)
  } catch (err) {
    console.error('Detect error:', err)
    res.status(500).json({ message: 'Terjadi kesalahan saat mendeteksi' })
  }
}

module.exports = { detect }
