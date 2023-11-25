const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class courseChapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  courseChapter.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    class_uuid: {
      type: DataTypes.UUID,
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
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'classChapter',
    tableName: 'class_chapter',
    timestamps: true,
  });
  return courseChapter;
};
