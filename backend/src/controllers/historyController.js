const pool = require('../config/db')

// GET /api/history
const getHistory = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
         id, image_url as "imageUrl", acne_count as "acneCount",
         severity, areas, accuracy, products, detections,
         created_at as date
       FROM detection_history
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    )
    res.json(rows)
  } catch (err) {
    console.error('Get history error:', err)
    res.status(500).json({ message: 'Gagal mengambil riwayat' })
  }
}

// GET /api/history/:id
const getHistoryById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
         id, image_url as "imageUrl", acne_count as "acneCount",
         severity, areas, accuracy, products, detections,
         created_at as date
       FROM detection_history
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Riwayat tidak ditemukan' })
    }

    res.json(rows[0])
  } catch (err) {
    console.error('Get history by id error:', err)
    res.status(500).json({ message: 'Gagal mengambil riwayat' })
  }
}

// POST /api/history
const saveHistory = async (req, res) => {
  const { imageUrl, acneCount, severity, areas, accuracy, products, detections } = req.body

  if (!imageUrl || !acneCount || !severity || !areas) {
    return res.status(400).json({ message: 'Data tidak lengkap' })
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO detection_history 
         (user_id, image_url, acne_count, severity, areas, accuracy, products, detections)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, created_at as date`,
      [
        req.user.id,
        imageUrl,
        acneCount,
        severity,
        areas,
        accuracy || 94.0,
        JSON.stringify(products || []),
        JSON.stringify(detections || []),
      ]
    )

    res.status(201).json({
      message: 'Riwayat berhasil disimpan',
      id: rows[0].id,
      date: rows[0].date,
    })
  } catch (err) {
    console.error('Save history error:', err)
    res.status(500).json({ message: 'Gagal menyimpan riwayat' })
  }
}

// DELETE /api/history/:id
const deleteHistory = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM detection_history WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Riwayat tidak ditemukan' })
    }

    res.json({ message: 'Riwayat berhasil dihapus' })
  } catch (err) {
    console.error('Delete history error:', err)
    res.status(500).json({ message: 'Gagal menghapus riwayat' })
  }
}

module.exports = { getHistory, getHistoryById, saveHistory, deleteHistory }
