const express = require('express');
const { Product } = require('../models');

const router = express.Router();

// GET ALL PRODUCTS - GET /api/products
router.get('/products', async (req, res) => {
  try {
    const { acneType, severity } = req.query;
    const where = {};
    
    if (acneType) where.acneType = acneType;
    if (severity) where.severity = severity;
    
    const products = await Product.findAll({ where });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil produk' });
  }
});

// GET PRODUCT DETAIL - GET /api/products/:id
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil detail produk' });
  }
});

// GET RECOMMENDATIONS - GET /api/recommendations/:acneType/:severity
router.get('/recommendations/:acneType/:severity', async (req, res) => {
  try {
    const { acneType, severity } = req.params;
    
    const products = await Product.findAll({
      where: { acneType, severity },
      limit: 5
    });
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil rekomendasi' });
  }
});

module.exports = router;