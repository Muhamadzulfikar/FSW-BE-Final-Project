const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class userChapterModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.chapterModule, {
        foreignKey: 'chapter_module_uuid',
      });

      this.belongsTo(models.user, {
        foreignKey: 'user_uuid',
      });
    }
  }
  userChapterModule.init({
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    chapter_module_uuid: {
      type: DataTypes.UUID,
      validate: {
        notEmpty: true,
      },
    },
    user_uuid: {
      type: DataTypes.UUID,
      validate: {
        notEmpty: true,
      },
    },
    is_complete: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'userChapterModule',
    tableName: 'user_chapter_modules',
    timestamps: true,
  });
  return userChapterModule;
};
