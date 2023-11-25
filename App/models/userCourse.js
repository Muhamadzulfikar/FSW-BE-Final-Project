const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
    }
  }
  userCourse.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    user_uuid: {
      type: DataTypes.UUID,
      validate: {
        notEmpty: true,
      },
    },
    class_uuid: {
      type: DataTypes.UUID,
      validate: {
        notEmpty: true,
      },
    },
    is_onboarding: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'userCourse',
    tableName: 'user_course',
    timestamps: true,
  });
  return userCourse;
};
