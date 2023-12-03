const { Op } = require('sequelize');
const {
  course,
  courseDetail,
  courseChapter,
  chapterModule,
  courseCategory,
} = require('../models');

const baseCourseQuery = {
  include: [
    {
      model: courseCategory,
      attributes: ['name'],
    },
    {
      model: courseChapter,
      attributes: ['duration'],
    },
  ],
  order: [
    ['id', 'ASC'],
  ],
  attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
};

module.exports = {
  getAllCourses() {
    return course.findAll(baseCourseQuery);
  },

  getCourseById(id) {
    return course.findByPk(id, {
      include: [
        {
          model: courseCategory,
          attributes: ['name'],
        },
        {
          model: courseDetail,
          attributes: ['description', 'class_target', 'telegram', 'onboarding'],
        },
        {
          model: courseChapter,
          attributes: ['duration', 'chapter'],
          order: ['id', 'ASC'],
          include: [
            {
              model: chapterModule,
              attributes: ['title', 'course_link'],
              order: ['id', 'ASC'],
            },
          ],
        },
      ],
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    });
  },

  CourseByCategory(categoryIds) {
    return course.findAll({
      where: {
        course_category_id: {
          [Op.in]: categoryIds,
        },
      },
      ...baseCourseQuery,
    });
  },

  CourseByLevel(levels) {
    return course.findAll({
      where: {
        level: {
          [Op.in]: levels,
        },
      },
      ...baseCourseQuery,
    });
  },

  CourseByCategoryAndLevel(categoryIds, levels) {
    return course.findAll({
      where: {
        course_category_id: {
          [Op.in]: categoryIds,
        },
        level: {
          [Op.in]: levels,
        },
      },
      ...baseCourseQuery,
    });
  },
};
