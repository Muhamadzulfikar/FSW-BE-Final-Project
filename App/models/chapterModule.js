const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class chapterModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.courseChapter, {
        foreignKey: 'course_chapter_id',
      });

      this.hasMany(models.userChapterModule, {
        foreignKey: 'chapter_module_uuid',
      });
    }
  }
  chapterModule.init(
    {
      uuid: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      course_chapter_id: {
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
    },
    {
      sequelize,
      modelName: 'chapterModule',
      tableName: 'chapter_modules',
      timestamps: true,
    },
  );

  chapterModule.beforeCreate((ChapterModule) => ChapterModule.uuid === uuidv4());

  return chapterModule;
};
