module.exports = (sequelize, DataTypes) => {
  const Detection = sequelize.define('Detection', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'image_url'
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
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 1
      }
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
    timestamps: true,
    underscored: true
  });

  return Detection;
};