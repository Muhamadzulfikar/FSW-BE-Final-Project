const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userClassPayments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  userClassPayments.init({
    id: DataTypes.INTEGER,
    uuid: DataTypes.UUID,
    user_class: DataTypes.UUID,
    payment_method: DataTypes.ENUM,
    is_paid: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'user_class_payments',
  });
  return userClassPayments;
};
