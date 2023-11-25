'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_chapter_module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_chapter_module.init({
    id: DataTypes.INTEGER,
    uuid: DataTypes.UUID,
    chapter_module_uuid: DataTypes.UUID,
    user_uuid: DataTypes.UUID,
    is_complete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user_chapter_module',
  });
  return user_chapter_module;
};