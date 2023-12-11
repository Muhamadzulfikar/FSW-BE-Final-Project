const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class userCoursePayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.userCourse, {
        foreignKey: 'user_course_uuid',
      });
    }
  }
  userCoursePayment.init(
    {
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
        type: DataTypes.ENUM('credit card', 'bank transfer'),
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
    },
    {
      sequelize,
      modelName: 'userCoursePayment',
      tableName: 'user_course_payments',
    },
  );
  return userCoursePayment;
};
