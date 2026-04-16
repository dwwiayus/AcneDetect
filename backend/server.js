const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize } = require('./models');

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan pada server!' });
});

// Sync database dan start server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
  console.log('Database connected');
  
  // Seed data produk skincare
  const { Product } = require('./models');
  const count = await Product.count();
  if (count === 0) {
    await Product.bulkCreate(seedProducts);
    console.log('Seed products added');
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Seed data
const seedProducts = [
  {
    name: "Salicylic Acid 2% Serum",
    brand: "The Ordinary",
    category: "Treatment",
    acneType: "Comedonal",
    severity: "Mild",
    description: "Membantu membersihkan pori-pori dan mengurangi komedo. Efektif untuk komedo putih dan komedo hitam.",
    ingredients: "Salicylic Acid 2%, Witch Hazel, Rose Water",
    howToUse: "Gunakan pagi atau malam setelah cleanser. Aplikasikan 2-3 tetes ke area bermasalah.",
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
    description: "Mengurangi peradangan, kemerahan, dan memperkuat skin barrier.",
    ingredients: "Niacinamide 10%, Zinc PCA 1%",
    howToUse: "Gunakan pagi dan malam setelah serum/toner.",
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
    description: "Membantu mengatasi jerawat kistik, mempercepat regenerasi sel, dan mengurangi bekas jerawat.",
    ingredients: "Retinol 0.5%, Squalane, Vitamin E",
    howToUse: "Gunakan malam hari, mulai 2x seminggu, tingkatkan frekuensi secara bertahap.",
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
    description: "Membersihkan tanpa menghilangkan kelembaban alami kulit. Cocok untuk kulit sensitif.",
    ingredients: "Water, Cetyl Alcohol, Propylene Glycol, Panthenol",
    howToUse: "Gunakan pagi dan malam. Pijat lembut ke kulit basah, lalu bilas.",
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
    description: "Menenangkan kulit berjerawat dan meradang. Mengandung 100% Centella Asiatica.",
    ingredients: "Centella Asiatica Extract, PHA, Madecassoside",
    howToUse: "Gunakan setelah cleanser. Tuang ke kapas atau tangan, tepuk-tepuk ke wajah.",
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
    description: "Mengatasi jerawat hormonal, bekas jerawat, dan kemerahan.",
    ingredients: "Azelaic Acid 10%, Vitamin C, Silicone",
    howToUse: "Gunakan pagi atau malam setelah serum. Aplikasikan tipis-tipis.",
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
    description: "Melembabkan tanpa menyumbat pori-pori. Formula oil-free dan non-comedogenic.",
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
    description: "Membunuh bakteri penyebab jerawat dan mengeringkan jerawat kistik.",
    ingredients: "Benzoyl Peroxide 5%, Aloe Vera",
    howToUse: "Gunakan 1x sehari malam hari. Hindari area mata dan bibir.",
    price: 110000,
    imageUrl: "https://images.unsplash.com/photo-1581091870622-1c9a7bb4c1e8?w=300",
    rating: 4.2
  }
];