const { course, courseCategory } = require('../models');

module.exports = {
  getAllCourses() {
    return course.findAll({
      include: [
        {
          model: courseCategory,
          as: 'category',
        },
      ],
    });
  },

  getCourseById(id) {
    return course.action(id);
  },

  CourseByCategory(categoryId) {
    return course.findAll({
      where: {
        course_category_id: categoryId,
      },

      include: [
        {
          model: courseCategory,
          as: 'category',
        },
      ],
    });
  },

  CourseByLevel(level) {
    return course.findAll({
      where: {
        level,
      },
    });
  },

  CourseByCategoryAndLevel(categoryId, level) {
    return course.findAll({
      where: {
        course_category_id: categoryId,
        level,
      },
    });
  },
};
