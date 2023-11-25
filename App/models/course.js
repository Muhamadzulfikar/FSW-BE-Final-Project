const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.classCategory, {
        foreignKey: 'classCategoryID',
        as: 'classCategory',
      });
    }
  }
  course.init({
    class_category_Id: {
      DataTypes: DataTypes.INTEGER,
      validate: {
        isNull: false,
      },
    },
    image: {
      DataTypes: DataTypes.STRING,
      validate: {
        min: 5,
        max: 255,
      },
    },
    name: {
      DataTypes: DataTypes.STRING,
      validate: {
        isNull: false,
        min: 5,
        max: 255,
      },
    },
    author: {
      DataTypes: DataTypes.STRING,
      validate: {
        isNull: false,
        min: 5,
        max: 255,
      },
    },
    price: DataTypes.DOUBLE,
    level: {
      DataTypes: DataTypes.ENUM,
      validate: {
        isNull: false,
        isIn: [['advance', 'beginner', 'intermediate']],
      },
    },
    rating: {
      DataTypes: DataTypes.STRING,
      validate: {
        isNull: false,
        min: 5,
        max: 255,
      },
    },
    isPremium: {
      DataTypes: DataTypes.BOOLEAN,
      validate: {
        isNull: false,
      },
    },
    code: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'course',
    tableName: 'course',
    primaryKey: 'uuid',
  });
  return course;
};
