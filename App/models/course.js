const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
        },
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          isNull: false,
          min: 5,
          max: 255,
        },
      },
      author: {
        type: DataTypes.STRING,
        validate: {
          isNull: false,
          min: 5,
          max: 255,
        },
      },
      price: DataTypes.DOUBLE,
      level: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        validate: {
          isNull: false,
          isIn: [['advanced', 'beginner', 'intermediate']],
        },
      },
      rating: {
        type: DataTypes.STRING,
        validate: {
          isNull: false,
          min: 5,
          max: 255,
        },
      },
      isPremium: {
        type: DataTypes.BOOLEAN,
        validate: {
          isNull: false,
        },
      },
      code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'course',
      tableName: 'courses',
    },
  );
  return course;
};
