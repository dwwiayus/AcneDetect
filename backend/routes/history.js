const express = require('express');
const { Detection } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET HISTORY - GET /api/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const detections = await Detection.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(detections.map(d => ({
      id: d.id,
      acneType: d.acneType,
      severity: d.severity,
      confidence: d.confidence,
      imageUrl: d.imageUrl,
      createdAt: d.createdAt,
      recommendations: d.recommendations
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil riwayat' });
  }
});

// GET DETECTION BY ID - GET /api/detection/:id
router.get('/detection/:id', authMiddleware, async (req, res) => {
  try {
    const detection = await Detection.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!detection) {
      return res.status(404).json({ error: 'Deteksi tidak ditemukan' });
    }
    
    res.json({
      id: detection.id,
      acneType: detection.acneType,
      severity: detection.severity,
      confidence: detection.confidence,
      imageUrl: detection.imageUrl,
      createdAt: detection.createdAt,
      recommendations: detection.recommendations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil detail deteksi' });
  }
});

module.exports = router;