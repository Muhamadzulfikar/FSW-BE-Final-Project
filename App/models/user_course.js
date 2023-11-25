const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userClass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  userClass.init({
    id: DataTypes.INTEGER,
    uuid: DataTypes.UUID,
    user_uuid: DataTypes.UUID,
    class_uuid: DataTypes.UUID,
    is_onboarding: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'user_class',
  });
  return userClass;
};
