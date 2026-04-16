const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Detection, Product } = require('../models');
const { predictAcne } = require('../services/aiService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Setup multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file harus JPEG/PNG'));
    }
  }
});

// DETECT - POST /api/detect
router.post('/detect', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Gambar wajib diupload' });
    }
    
    // Baca file gambar
    const imageBuffer = req.file.buffer || require('fs').readFileSync(req.file.path);
    
    // Prediksi menggunakan AI
    const prediction = await predictAcne(imageBuffer);
    
    // Cari rekomendasi produk dari database
    const products = await Product.findAll({
      where: {
        acneType: prediction.acneType,
        severity: prediction.severity
      },
      limit: 4
    });
    
    // Simpan ke database
    const detection = await Detection.create({
      userId: req.user.id,
      imageUrl: `/uploads/${req.file.filename}`,
      acneType: prediction.acneType,
      severity: prediction.severity,
      confidence: prediction.confidence,
      recommendations: products.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        imageUrl: p.imageUrl
      }))
    });
    
    res.json({
      detectionId: detection.id,
      acneType: prediction.acneType,
      severity: prediction.severity,
      confidence: prediction.confidence,
      allTypes: prediction.allTypes,
      allSeverities: prediction.allSeverities,
      tips: prediction.tips,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        description: p.description,
        howToUse: p.howToUse,
        price: p.price,
        imageUrl: p.imageUrl,
        rating: p.rating
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Deteksi gagal: ' + error.message });
  }
});

module.exports = router;