const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize, Product } = require('./models');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/detect'));
app.use('/api', require('./routes/history'));
app.use('/api', require('./routes/products'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan pada server!' });
});

// Seed data produk skincare
const seedProducts = [
  {
    name: "Salicylic Acid 2% Serum",
    brand: "The Ordinary",
    category: "Treatment",
    acneType: "Comedonal",
    severity: "Mild",
    description: "Membantu membersihkan pori-pori dan mengurangi komedo.",
    ingredients: "Salicylic Acid 2%, Witch Hazel, Rose Water",
    howToUse: "Gunakan pagi atau malam setelah cleanser.",
    price: 150000,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300",
    rating: 4.5
  },
  {
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "Treatment",
    acneType: "Inflammatory",
    severity: "Moderate",
    description: "Mengurangi peradangan dan kemerahan akibat jerawat.",
    ingredients: "Niacinamide 10%, Zinc PCA 1%",
    howToUse: "Gunakan pagi dan malam setelah serum.",
    price: 120000,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300",
    rating: 4.7
  },
  {
    name: "Retinol 0.5% in Squalane",
    brand: "The Ordinary",
    category: "Treatment",
    acneType: "Cystic",
    severity: "Severe",
    description: "Membantu mengatasi jerawat kistik dan bekas jerawat.",
    ingredients: "Retinol 0.5%, Squalane, Vitamin E",
    howToUse: "Gunakan malam hari, mulai 2x seminggu.",
    price: 180000,
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403b8d?w=300",
    rating: 4.3
  },
  {
    name: "Gentle Hydrating Cleanser",
    brand: "Cetaphil",
    category: "Cleanser",
    acneType: "Hormonal",
    severity: "Mild",
    description: "Membersihkan tanpa menghilangkan kelembaban alami kulit.",
    ingredients: "Water, Cetyl Alcohol, Propylene Glycol, Panthenol",
    howToUse: "Gunakan pagi dan malam. Pijat lembut lalu bilas.",
    price: 95000,
    imageUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300",
    rating: 4.6
  },
  {
    name: "Centella Asiatica Toner",
    brand: "SKIN1004",
    category: "Toner",
    acneType: "Inflammatory",
    severity: "Mild",
    description: "Menenangkan kulit berjerawat dan meradang.",
    ingredients: "Centella Asiatica Extract, PHA, Madecassoside",
    howToUse: "Gunakan setelah cleanser. Tepuk-tepuk ke wajah.",
    price: 135000,
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?w=300",
    rating: 4.8
  },
  {
    name: "Azelaic Acid Suspension 10%",
    brand: "The Ordinary",
    category: "Treatment",
    acneType: "Hormonal",
    severity: "Moderate",
    description: "Mengatasi jerawat hormonal dan bekas jerawat.",
    ingredients: "Azelaic Acid 10%, Vitamin C",
    howToUse: "Gunakan pagi atau malam setelah serum.",
    price: 160000,
    imageUrl: "https://images.unsplash.com/photo-1620916566390-22f5e5f846e7?w=300",
    rating: 4.4
  },
  {
    name: "Oil-Free Moisturizer",
    brand: "Neutrogena",
    category: "Moisturizer",
    acneType: "Comedonal",
    severity: "Mild",
    description: "Melembabkan tanpa menyumbat pori-pori.",
    ingredients: "Glycerin, Hyaluronic Acid, Dimethicone",
    howToUse: "Gunakan pagi dan malam setelah treatment.",
    price: 85000,
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300",
    rating: 4.5
  },
  {
    name: "Benzoyl Peroxide 5% Gel",
    brand: "AcneFree",
    category: "Treatment",
    acneType: "Cystic",
    severity: "Severe",
    description: "Membunuh bakteri penyebab jerawat.",
    ingredients: "Benzoyl Peroxide 5%, Aloe Vera",
    howToUse: "Gunakan 1x sehari malam hari.",
    price: 110000,
    imageUrl: "https://images.unsplash.com/photo-1581091870622-1c9a7bb4c1e8?w=300",
    rating: 4.2
  },
  {
    name: "Tea Tree Oil Spot Treatment",
    brand: "The Body Shop",
    category: "Treatment",
    acneType: "Inflammatory",
    severity: "Moderate",
    description: "Spot treatment untuk mengeringkan jerawat meradang.",
    ingredients: "Tea Tree Oil, Lemon Oil",
    howToUse: "Oleskan tipis-tipis pada jerawat 2x sehari.",
    price: 75000,
    imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300",
    rating: 4.3
  },
  {
    name: "Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "Moisturizer",
    acneType: "Comedonal",
    severity: "Mild",
    description: "Menghidrasi kulit tanpa menyumbat pori-pori.",
    ingredients: "Hyaluronic Acid 2%, Vitamin B5",
    howToUse: "Gunakan pagi dan malam sebelum moisturizer.",
    price: 130000,
    imageUrl: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=300",
    rating: 4.6
  }
];

// Start server
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connection established successfully');
    return sequelize.sync({ alter: true });
  })
  .then(async () => {
    console.log('✅ Database synced');
    
    // Cek apakah sudah ada data produk
    const count = await Product.count();
    if (count === 0) {
      await Product.bulkCreate(seedProducts);
      console.log(`✅ ${seedProducts.length} products seeded to database`);
    } else {
      console.log(`✅ Database already has ${count} products`);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 API: http://localhost:${PORT}/api`);
      console.log(`🐘 PostgreSQL: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
    });
  })
  .catch(err => {
    console.error('❌ Unable to connect to PostgreSQL:', err);
    process.exit(1);
  });