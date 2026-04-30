const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Koneksi ke PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'acne_detection_db',
  logging: false,  // Matikan log SQL (biar tidak berantakan)
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import models
const User = require('./User')(sequelize, DataTypes);
const Detection = require('./Detection')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);

// Setup relasi antar tabel
User.hasMany(Detection, { foreignKey: 'userId', as: 'detections' });
Detection.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Detection,
  Product
};