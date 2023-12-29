const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

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
        onDelete: 'CASCADE',
      });

      /**
       * has Many relationship
       */

      this.hasMany(models.userCourse, {
        foreignKey: 'course_uuid',
        onDelete: 'CASCADE',
      });

      this.hasOne(models.courseDetail, {
        foreignKey: 'course_uuid',
        onDelete: 'CASCADE',
      });

      this.hasMany(models.courseChapter, {
        foreignKey: 'course_uuid',
        onDelete: 'CASCADE',
      });
    }
  }
  course.init({
    id: {
      type: DataTypes.INTEGER,
    },
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    course_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isInt: {
          msg: 'course_category_id must be an integer',
        },
        min: {
          args: [1],
          msg: 'course_category_id must be greater than 0',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'image must not be empty',
        },
        isUrl: {
          msg: 'image must be a valid url',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'name must not be empty',
        },
        len: {
          args: [5, 255],
          msg: 'name must be between 5 and 255 characters',
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'author must not be empty',
        },
        len: {
          args: [5, 255],
          msg: 'author must be between 5 and 255 characters',
        },
      },
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'price must be a decimal',
        },
        notEmpty: {
          msg: 'price must not be empty',
        },
        min: {
          args: [20000],
          msg: 'price must be greater than 20000',
        },
      },
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'level must not be empty',
        },
        isIn: {
          args: [['beginner', 'intermediate', 'advanced']],
          msg: 'level must be beginner, intermediate, or advanced',
        },
      },
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'rating must not be empty',
        },
        isInt: {
          msg: 'rating must be an integer',
        },
        min: {
          args: [1],
          msg: 'rating must be greater than 0',
        },
        max: {
          args: [5],
          msg: 'rating must be less than 6',
        },
      },
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'isPremium must not be empty',
        },
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'code must not be empty',
        },
        len: {
          args: [5, 255],
          msg: 'code must be between 5 and 255 characters',
        },
      },
    },
    intro_video: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'intro_video must not be empty',
        },
        isUrl: {
          msg: 'intro_video must be a valid url',
        },
      },
    },
  }, {
    sequelize,
    modelName: 'course',
    tableName: 'courses',
  });
  // eslint-disable-next-line no-return-assign, no-param-reassign
  course.beforeCreate((courseUUID) => (courseUUID.uuid = uuidv4()));
  return course;
};
