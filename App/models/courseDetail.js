const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class courseDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  courseDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      class_uuid: {
        type: DataTypes.UUID,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          min: 5,
          max: 255,
        },
      },
      class_target: {
        type: DataTypes.JSON,
        validate: {
          notEmpty: true,
        },
      },
      telegram: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      onboarding: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'courseDetail',
      tableName: 'course_detail',
      timestamps: true,
    },
  );
  return courseDetail;
};