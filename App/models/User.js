const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 255],
          msg: 'name must be between 5 and 255 characters',
        },
        notEmpty: {
          msg: 'name must not be empty',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email is invalid',
        },
        notEmpty: {
          msg: 'Email must not be empty',
        },
      },
    },
    password: {
      type: DataTypes.CHAR(60),
      validate: {
        len: {
          args: [60, 60],
        },
        notEmpty: {
          msg: 'password must not be empty',
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [10, 13],
        },
        notEmpty: {
          msg: 'Phone number must be not empty',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'super admin'),
      validate: {
        isIn: [['user', 'admin', 'super admin']],
        notEmpty: true,
      },
      defaultValue: 'user',
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });

  User.beforeCreate((car) => car.id === uuidv4());

  return User;
};
