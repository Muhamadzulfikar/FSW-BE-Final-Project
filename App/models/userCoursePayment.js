const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userCoursePayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  userCoursePayment.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    user_course_uuid: {
      type: DataTypes.UUID,
      validate: {
        notEmpty: true,
      },
    },
    payment_method: {
      type: DataTypes.ENUM,
      validate: {
        notEmpty: true,
        isIn: [['credit card', 'bank transfer']],
      },
    },
    is_paid: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'user_class_payments',
  });
  return userCoursePayment;
};
