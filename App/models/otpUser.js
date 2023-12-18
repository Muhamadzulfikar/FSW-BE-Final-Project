const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class otpUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, {
        foreignKey: 'user_uuid',
      });
    }
  }
  otpUser.init(
    {
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
      otp_code: {
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
      timestamps: false,
    },
  );

  otpUser.beforeCreate((otpUserInstance) => {
    otpUserInstance.set('expiredAt', new Date(Date.now() + 24 * 60 * 60 * 1000));
    otpUserInstance.set('uuid', uuidv4());
  });

  return otpUser;
};
