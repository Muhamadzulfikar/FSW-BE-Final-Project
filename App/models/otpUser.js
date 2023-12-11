const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class otpUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  otpUser.init(
    {
      id: {
        type: DataTypes.INTEGER,
      },
      uuid: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      user_uuid: {
        type: DataTypes.UUID,
        validate: {
          notEmpty: true,
        },
      },
      otp: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      expiredAt: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'otpUser',
      tableName: 'otp_users',
    },
  );

  otpUser.beforeCreate((OtpUser) => OtpUser.uuid === uuidv4());

  return otpUser;
};
