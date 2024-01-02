const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class courseDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.course, {
        foreignKey: 'course_uuid',
        onDelete: 'CASCADE',
      });
    }
  }
  courseDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      course_uuid: {
        type: DataTypes.UUID,
        validate: {
          notEmpty: {
            msg: 'course_uuid must be provided',
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          len: {
            args: [10, 255],
            msg: 'description must be between 10 and 255 characters',
          },
        },
      },
      class_target: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        validate: {
          notEmpty: {
            msg: 'class_target must be provided',
          },
        },
      },
      telegram: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: 'telegram must be provided',
          },
          isUrl: {
            msg: 'telegram must be a valid url',
          },
        },
      },
      onboarding: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          len: {
            args: [10, 255],
            msg: 'onboarding must be between 10 and 255 characters',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'courseDetail',
      tableName: 'course_details',
      timestamps: true,
    },
  );
  return courseDetail;
};
