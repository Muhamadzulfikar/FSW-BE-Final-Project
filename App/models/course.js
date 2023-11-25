const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Classes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Classes.init({
    id: DataTypes.INTEGER,
    classCategoryId: DataTypes.INTEGER,
    uuid: DataTypes.UUID,
    image: DataTypes.STRING,
    name: DataTypes.STRING,
    author: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    level: DataTypes.STRING,
    rating: DataTypes.STRING,
    isPremium: DataTypes.BOOLEAN,
    code: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Classes',
  });
  return Classes;
};
