const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /**
       * belongs to relationship
       */

      this.belongsTo(models.courseCategory, {
        foreignKey: 'course_category_id',
      });

      /**
       * has Many relationship
       */

      this.hasMany(models.userCourse, {
        foreignKey: 'course_uuid',
      });

      this.hasMany(models.courseDetail, {
        foreignKey: 'course_uuid',
      });

      this.hasMany(models.courseChapter, {
        foreignKey: 'course_uuid',
      });
    }
  }
  course.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      course_category_id: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      image: {
        type: DataTypes.STRING,
        validate: {
          min: 5,
          max: 255,
          notEmpty: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          min: 5,
          max: 255,
        },
      },
      author: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          min: 5,
          max: 255,
        },
      },
      price: {
        type: DataTypes.DOUBLE,
        validate: {
          notEmpty: true,
          min: 1,
        },
      },
      level: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        validate: {
          notEmpty: true,
          isIn: [['advanced', 'beginner', 'intermediate']],
        },
      },
      rating: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          min: 5,
          max: 255,
        },
      },
      isPremium: {
        type: DataTypes.BOOLEAN,
        validate: {
          notEmpty: true,
        },
      },
      code: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          min: 5,
          max: 255,
        },
      },
    },
    {
      sequelize,
      modelName: 'course',
      tableName: 'courses',
    },
  );
  return course;
};
