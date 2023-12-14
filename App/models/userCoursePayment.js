const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

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
          isIn: [['credit card', 'bank transfer']],
        },
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        validate: {
          notEmpty: true,
        },
      },
      expiredAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now() + 43200,
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
  // eslint-disable-next-line no-return-assign, no-param-reassign, no-undef
  userCoursePayment.beforeCreate((userPaymentUUID) => (userPaymentUUID.uuid = uuidv4()));
  return userCoursePayment;
};
