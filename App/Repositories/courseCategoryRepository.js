const { courseCategory } = require('../models');

module.exports = {
  getAllCourseCategories() {
    return courseCategory.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
  },
};
