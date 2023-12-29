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
        onDelete: 'CASCADE',
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
        allowNull: true,
        validate: {
          isIn: {
            args: [['credit card', 'bank transfer']],
            msg: 'Payment method must be credit card or bank transfer',
          },
        },
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
        defaultValue: false,
      },
      expiredAt: {
        type: DataTypes.DATE,
        defaultValue: Date.now() + 24 * 60 * 60 * 1000,
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
