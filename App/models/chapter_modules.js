const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class chapterModules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  chapterModules.init({
    id: DataTypes.INTEGER,
    class_chapter_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    course_link: DataTypes.STRING,
    is_complete: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'chapter_modules',
  });
  return chapterModules;
};
