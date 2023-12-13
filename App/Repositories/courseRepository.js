const {
  course,
  courseDetail,
  courseChapter,
  chapterModule,
  courseCategory,
  userCourse,
  userCoursePayment,
  user,
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
  getAllCourses(filter) {
    return course.findAll({
      where: filter,
      ...baseCourseQuery,
    });
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
          attributes: ['duration', 'id'],
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

  getCourseByIdAdmin(id) {
    return course.findByPk(id);
  },

  CourseByCategory(categoryIds) {
    return course.findAll({
      where: {
        course_category_id: {
          // eslint-disable-next-line no-undef
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
          // eslint-disable-next-line no-undef
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
          // eslint-disable-next-line no-undef
          [Op.in]: categoryIds,
        },
        level: {
          // eslint-disable-next-line no-undef
          [Op.in]: levels,
        },
      },
      ...baseCourseQuery,
    });
  },

  getCoursesAdmin() {
    return userCoursePayment.findAll({
      include: [
        {
          model: userCourse,
          attributes: ['user_uuid'],
          include: [
            {
              model: user,
              attributes: ['name', 'uuid'],
            },
            {
              model: course,
              attributes: ['course_category_id', 'name'],
              include: [
                {
                  model: courseCategory,
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    })
      .then((data) => data.map((item) => ({
        user_name: item.userCourse.user.name,
        course_category: item.userCourse.course.courseCategory.name,
        course_name: item.userCourse.course.name,
        is_paid: item.is_paid,
        payment_method: item.payment_method,
        buy_at: item.createdAt,
        uuid: item.uuid,
        user_course_uuid: item.user_course_uuid,
      })));
  },
  createCourse(dataCourse) {
    return course.create(dataCourse);
  },

  updateCourse(uuid, dataCourse) {
    return course.update(dataCourse, { where: { uuid }, returnig: true });
  },

  deleteCourse(uuid) {
    return course.destroy({ where: { uuid }, returnig: true });
  },

};
