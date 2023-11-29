const { courseCategory } = require('../models/index');

module.exports = {
  getAllCourseCategories() {
    return courseCategory.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
  },
};
