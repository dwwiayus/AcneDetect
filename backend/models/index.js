const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

const User = require('./User')(sequelize, DataTypes);
const Detection = require('./Detection')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);

// Associations
User.hasMany(Detection, { foreignKey: 'userId' });
Detection.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Detection,
  Product
};