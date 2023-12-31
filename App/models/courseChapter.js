const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class courseChapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /**
       * Belongs To Relationship
       */
      this.belongsTo(models.course, {
        foreignKey: 'course_uuid',
        onDelete: 'CASCADE',
      });

      /**
       * Has Many Relationship
       */
      this.hasMany(models.chapterModule, {
        foreignKey: 'course_chapter_id',
        onDelete: 'CASCADE',
      });
    }
  }
  courseChapter.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      course_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      chapter: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'courseChapter',
      tableName: 'course_chapters',
      timestamps: true,
    },
  );
  return courseChapter;
};
