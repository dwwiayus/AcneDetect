module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Detection', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    acneType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    recommendations: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('recommendations');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('recommendations', JSON.stringify(value));
      }
    }
  }, {
    tableName: 'detections',
    timestamps: true
  });
};