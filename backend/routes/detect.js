const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { Detection, Product } = require('../models');
const { predictAcne } = require('../services/aiService');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Setup multer untuk upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file harus JPEG/PNG'));
    }
  }
});

// ============================================
// 🔥 ENDPOINT DETEKSI - TANPA AUTH (bisa diakses semua orang)
// ============================================
router.post('/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Gambar wajib diupload' });
    }
    
    // Baca file gambar
    const imageBuffer = fs.readFileSync(req.file.path);
    
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
    
    // Cek apakah user login (dari token di header)
    let detectionId = null;
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.log('Token invalid, tidak menyimpan ke database');
      }
    }
    
    // SIMPAN KE DATABASE (hanya jika user login)
    if (userId) {
      const detection = await Detection.create({
        userId: userId,
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
      detectionId = detection.id;
      console.log(`✅ Detection saved for user ${userId}, ID: ${detectionId}`);
    } else {
      console.log(`⚠️ Anonymous detection (not saved to database)`);
    }
    
    // KIRIM RESPONSE (tetap sama, dengan atau tanpa detectionId)
    res.json({
      detectionId: detectionId,
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