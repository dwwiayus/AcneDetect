module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    acneType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'acne_type'
    },
    severity: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ingredients: {
      type: DataTypes.TEXT
    },
    howToUse: {
      type: DataTypes.TEXT,
      field: 'how_to_use'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      field: 'image_url'
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 4.0,
      validate: {
        min: 0,
        max: 5
      }
    }
  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true
  });

  return Product;
};