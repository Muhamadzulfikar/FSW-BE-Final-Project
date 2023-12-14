const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  class userCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.course, {
        foreignKey: 'course_uuid',
      });

      this.belongsTo(models.user, {
        foreignKey: 'user_uuid',
      });
    }
  }
  userCourse.init(
    {
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
      course_uuid: {
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
    },
    {
      sequelize,
      modelName: 'userCourse',
      tableName: 'user_courses',
      timestamps: true,
    },
  );
  // eslint-disable-next-line no-return-assign, no-param-reassign, no-undef
  userCourse.beforeCreate((userCourseUUID) => (userCourseUUID.uuid = uuidv4()));
  return userCourse;
};
