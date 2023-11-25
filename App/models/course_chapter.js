const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class classChapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  classChapter.init({
    id: DataTypes.INTEGER,
    class_uuid: DataTypes.UUID,
    chapter: DataTypes.STRING,
    duration: DataTypes.STRING,
    is_free: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'class_chapter',
  });
  return classChapter;
};
