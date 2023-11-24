const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class classDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  classDetail.init({
    id: DataTypes.INTEGER,
    class_uuid: DataTypes.UUID,
    description: DataTypes.STRING,
    class_target: DataTypes.JSON,
    telegram: DataTypes.STRING,
    onboarding: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'class_detail',
  });
  return classDetail;
};
