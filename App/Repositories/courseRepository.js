const {
  course,
  courseDetail,
  courseChapter,
  chapterModule,
} = require('../models');

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
    return course.findByPk(id, {
      include: [
        {
          model: courseDetail,
          attributes: ['description', 'class_target', 'telegram', 'onboarding'],
        },
        {
          model: courseChapter,
          attributes: ['duration', 'chapter'],
          include: [
            {
              model: chapterModule,
              attributes: ['title', 'course_link'],
            },
          ],
        },
      ],
    });
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
