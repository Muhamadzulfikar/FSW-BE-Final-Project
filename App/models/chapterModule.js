const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class chapterModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  chapterModule.init({
    uuid: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
    class_chapter_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        min: 5,
        max: 225,
      },
    },
    course_link: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        min: 5,
        max: 255,
      },
    },
  }, {
    sequelize,
    modelName: 'chapterModule',
    tableName: 'chapter_modules',
    timestamps: true,
  });
  return chapterModule;
};
