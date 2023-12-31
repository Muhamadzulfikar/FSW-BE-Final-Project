const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

/** @param {any} sequelize  */
module.exports = (sequelize) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.userChapterModule, {
        foreignKey: 'user_uuid',
        onDelete: 'CASCADE',
      });

      this.hasMany(models.userCourse, {
        foreignKey: 'user_uuid',
        onDelete: 'CASCADE',
      });

      this.hasMany(models.otpUser, {
        foreignKey: 'user_uuid',
        onDelete: 'CASCADE',
      });

      this.hasMany(models.userNotification, {
        foreignKey: 'user_uuid',
        onDelete: 'CASCADE',
      });
    }
  }
  user.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
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
        unique: {
          msg: 'Phone number already exists',
        },
      },
      is_verify: {
        type: DataTypes.BOOLEAN,
        validate: {
          notEmpty: true,
        },
        defaultValue: false,
      },
      country: {
        type: DataTypes.STRING,
        validate: {
          min: 5,
          max: 255,
        },
      },
      city: {
        type: DataTypes.STRING,
        validate: {
          min: 5,
          max: 255,
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
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'users',
      timestamps: true,
    },
  );

  user.beforeCreate((User) => User.uuid === uuidv4());

  return user;
};
