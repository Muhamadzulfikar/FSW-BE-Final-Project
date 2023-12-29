const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

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
        onDelete: 'CASCADE',
      });

      this.belongsTo(models.user, {
        foreignKey: 'user_uuid',
        onDelete: 'CASCADE',
      });
    }
  }
  userChapterModule.init(
    {
      uuid: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      chapter_module_uuid: {
        allowNull: false,
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
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'userChapterModule',
      tableName: 'user_chapter_modules',
      timestamps: true,
    },
  );

  userChapterModule.beforeCreate((userModule) => {
    userModule.set('uuid', uuidv4());
  });

  return userChapterModule;
};
