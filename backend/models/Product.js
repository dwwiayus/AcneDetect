module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    acneType: { type: DataTypes.STRING, allowNull: false },
    severity: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    ingredients: { type: DataTypes.TEXT },
    howToUse: { type: DataTypes.TEXT },
    price: { type: DataTypes.INTEGER, allowNull: false },
    imageUrl: { type: DataTypes.STRING },
    rating: { type: DataTypes.FLOAT, defaultValue: 4.0 }
  }, {
    tableName: 'products'
  });
};