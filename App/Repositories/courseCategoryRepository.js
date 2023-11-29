const courseCategory = require('../models/courseCategory');

module.exports = {
  getAllCourseCategories() {
    return courseCategory.action();
  },

  getCourseCategoryById(id) {
    return courseCategory.action(id);
  },
};
