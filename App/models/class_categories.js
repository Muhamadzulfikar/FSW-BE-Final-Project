const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class classCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  classCategories.init({
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'class_categories',
  });
  return classCategories;
};
