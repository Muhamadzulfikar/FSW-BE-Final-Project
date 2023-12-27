const { Op } = require('sequelize');
const {
  course,
  courseDetail,
  courseChapter,
  chapterModule,
  courseCategory,
  userCourse,
  userCoursePayment,
  userChapterModule,
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

  getCourseById(id, userUuid) {
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
              attributes: ['title', 'uuid'],
              order: ['id', 'ASC'],
              include: [
                {
                  model: userChapterModule,
                  where: {
                    user_uuid: userUuid,
                  },
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: userCourse,
          where: {
            user_uuid: userUuid,
          },
          required: false,
          include: [
            {
              model: userCoursePayment,
              required: false,
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
        user: item.userCourse.user.name,
        courseCategory: item.userCourse.course.courseCategory.name,
        courseName: item.userCourse.course.name,
        is_paid: item.is_paid,
        paymentMethod: item.payment_method,
        buyAt: item.createdAt,
      })));
  },

  getCoursesAdminManagement() {
    return course.findAll({
      include: [
        {
          model: courseCategory,
          attributes: ['name'],
        },
      ],
    })
      .then((data) => data.map((item) => ({
        code: item.code,
        course_category: item.courseCategory.name,
        course_name: item.name,
        isPremium: item.isPremium,
        level: item.level,
        price: item.price,
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

  isOnboarding(userUuid, courseUuid, payload) {
    return userCourse.update(payload, {
      where: {
        user_uuid: userUuid,
        course_uuid: courseUuid,
      },
    });
  },

  getUserCourse(userUuid, courseUuid) {
    return userCourse.findOne({
      where: {
        user_uuid: userUuid,
        course_uuid: courseUuid,
      },
      attributes: ['uuid'],
    });
  },

  completingModule(userChapterModuleUuid) {
    return userChapterModule.update({ is_complete: true }, { where: { uuid: userChapterModuleUuid } });
  },

  getUserModule(userUuid, chapterModuleUuid) {
    return userChapterModule.findOne({
      where: {
        user_uuid: userUuid,
        chapter_module_uuid: chapterModuleUuid,
      },
    });
  },

  getVideoCourse(chapterModuleUuid) {
    return chapterModule.findByPk(chapterModuleUuid, {
      attributes: ['course_link'],
    });
  },

  getCourseByChapterModule(chapterModuleUuid) {
    return course.findOne({
      include: [
        {
          model: courseChapter,
          attributes: ['id', 'chapter'],
          include: [
            {
              model: chapterModule,
              attributes: ['uuid'],
              where: {
                uuid: chapterModuleUuid,
              },
            },
          ],
        },
      ],
      attributes: ['uuid', 'isPremium'],
    });
  },

  getPaymentStatusByUserCourse(userUuid, courseUuid) {
    return userCourse.findOne({
      where: {
        user_uuid: userUuid,
        course_uuid: courseUuid,
      },
      include: [
        {
          model: userCoursePayment,
          attributes: ['is_paid'],
        },
      ],
      attributes: ['uuid'],
    });
  },

  getChapterModuleByCourse(courseUuid) {
    return courseChapter.findAll({
      where: {
        course_uuid: courseUuid,
      },
      attributes: ['id'],
      include: [
        {
          model: chapterModule,
          attributes: ['uuid'],
        },
        {
          model: course,
          attributes: ['isPremium'],
        },
      ],
    });
  },

  countTotalProgress(userChapterModuleUuid, userUuid) {
    return userChapterModule.count({
      where: {
        uuid: {
          [Op.in]: userChapterModuleUuid,
        },
        user_uuid: userUuid,
      },
    });
  },
};
