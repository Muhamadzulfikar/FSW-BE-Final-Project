const course = require('../models/course');

module.exports = {
  getAllCourses() {
    return course.action();
  },

  getCourseById(id) {
    return course.action(id);
  },

  filterCourseByCategory(category) {
    return course.action(category);
  },

  filterCourseByLevel(level) {
    return course.action(level);
  },

  filterCourseByCategoryAndLevel(category, level) {
    return course.action(category, level);
  },
};
