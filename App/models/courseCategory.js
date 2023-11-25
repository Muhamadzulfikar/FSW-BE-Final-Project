const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class courseCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
    }
  }
  courseCategory.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        min: 5,
        max: 255,
      },
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        min: 5,
        max: 255,
      },
    },
  }, {
    sequelize,
    modelName: 'classCategory',
    tableName: 'class_categories',
    timestamps: true,
  });
  return courseCategory;
};
