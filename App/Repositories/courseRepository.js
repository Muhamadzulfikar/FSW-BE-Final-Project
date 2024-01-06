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
  sequelize,
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
      order: [
        [courseChapter, 'id', 'ASC'],
        [courseChapter, chapterModule, 'id', 'ASC'],
      ],
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
                  attributes: ['is_complete', 'uuid'],
                  where: {
                    user_uuid: userUuid,
                  },
                  required: false,
                  order: ['chapter_module_uuid', 'ASC'],
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
    return course.findByPk(id, {
      include: [
        {
          model: courseCategory,
          attributes: ['name', 'id'],
        },
        {
          model: courseDetail,
          attributes: ['description', 'class_target', 'telegram', 'onboarding'],
        },
        {
          model: courseChapter,
          attributes: ['duration', 'chapter', 'id'],
          include: [
            {
              model: chapterModule,
              attributes: ['title', 'course_link', 'uuid'],
            },
          ],
        },
      ],
    });
  },

  async getCoursesStatisticDetail() {
    const activeUsers = await user.count();
    const activeClass = await course.count();
    const premiumClass = await course.count({
      where: {
        isPremium: true,
      },
    });

    return {
      activeUsersItem: activeUsers,
      activeClassItem: activeClass,
      premiumClassItem: premiumClass,
    };
  },

  getCoursesAdmin() {
    return userCoursePayment.findAll({
      include: [
        {
          model: userCourse,
          attributes: ['user_uuid', 'is_onboarding'],
          include: [
            {
              model: user,
              attributes: ['name', 'uuid'],
            },
            {
              model: course,
              attributes: ['course_category_id', 'name', 'isPremium'],
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

  createCourseAdmin(payload) {
    return course.create(payload, {
      include: [
        {
          model: courseDetail,
        },
        {
          model: courseChapter,
          include: [
            {
              model: chapterModule,
            },
          ],
        },
      ],
    });
  },

  createCourseChapter(payloads) {
    return sequelize.transaction(async (t) => {
      payloads.forEach(async (payload) => {
        courseChapter.create(payload, {
          include: [
            {
              model: chapterModule,
              include: [
                {
                  model: userChapterModule,
                },
              ],
            },
          ],
        }, { transaction: t });
      });
    });
  },

  createChapterModule(payloads) {
    return sequelize.transaction(async (t) => {
      payloads.forEach((payload) => {
        chapterModule.create(payload, {
          include: [
            {
              model: userChapterModule,
            },
          ],
        }, { transaction: t });
      });
    });
  },

  deleteCourseChapter(payloads) {
    return sequelize.transaction((t) => {
      payloads.forEach((payload) => {
        courseChapter.destroy({
          where: {
            id: payload.id,
          },
        }, { transaction: t });
      });
    });
  },

  deleteChapterModule(payloads) {
    return sequelize.transaction(async (t) => {
      payloads.forEach((payload) => {
        chapterModule.destroy({
          where: {
            uuid: payload.uuid,
          },
        }, { transaction: t });
      });
    });
  },

  updateCourse(courseUuid, payload) {
    return course.update(payload, {
      where: {
        uuid: courseUuid,
      },
    });
  },

  updateCourseDetail(courseUuid, payload) {
    return courseDetail.update(payload, {
      where: {
        course_uuid: courseUuid,
      },
    });
  },

  updateCourseChapter(courseChapters) {
    courseChapters.forEach((chapter) => {
      courseChapter.update(chapter, {
        where: {
          id: chapter.id,
        },
      });
    });
  },

  updateChapterModule(chapterModules) {
    chapterModules.forEach((module) => {
      chapterModule.update(module, {
        where: {
          uuid: module.uuid,
        },
      });
    });
  },

  deleteCourse(courseUuid) {
    return course.destroy({ where: { uuid: courseUuid } });
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

  getUserModuleByCourse(courseUuid) {
    return courseChapter.findAll({
      attributes: ['id'],
      where: {
        course_uuid: courseUuid,
      },
      include: [
        {
          model: chapterModule,
          attributes: ['uuid'],
          include: [
            {
              model: userChapterModule,
              attributes: ['user_uuid'],
            },
          ],
        },
      ],
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
          attributes: ['id'],
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

  getMyCourse(userUuid, filter) {
    return course.findAll({
      where: filter,
      include: [
        {
          model: userCourse,
          where: {
            user_uuid: userUuid,
          },
          include: [
            {
              model: userCoursePayment,
              attributes: ['uuid'],
              where: {
                is_paid: true,
              },
            },
          ],
          attributes: ['uuid'],
        },
        {
          model: courseCategory,
          attributes: ['name'],
        },
        {
          model: courseChapter,
          attributes: ['duration'],
          include: [
            {
              model: chapterModule,
              attributes: ['uuid'],
              include: [
                {
                  model: userChapterModule,
                  attributes: ['is_complete'],
                  where: {
                    user_uuid: userUuid,
                  },
                },
              ],
            },
          ],
        },
      ],
      attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'intro_video'] },
    });
  },

  getChapterAndModuleUuid(courseUuid) {
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
      ],
    });
  },

  getCourseByUserChapterModule(userChapterModuleUuid) {
    return userChapterModule.findOne({
      where: {
        uuid: userChapterModuleUuid,
      },
      attributes: ['uuid'],
      include: [
        {
          model: chapterModule,
          attributes: ['uuid'],
          include: [
            {
              attributes: ['id'],
              model: courseChapter,
              include: [
                {
                  model: course,
                  attributes: ['isPremium', 'uuid'],
                },
              ],
            },
          ],
        },
      ],
    });
  },

  getUserChapterModuleByChapterModule(userUuid, chapterModuleUuid) {
    return userChapterModule.findAll({
      where: {
        user_uuid: userUuid,
        chapter_module_uuid: chapterModuleUuid,
      },
      attributes: ['uuid'],
    });
  },

  getChapterByCourse(courseUuid) {
    return courseChapter.findAll({
      where: {
        course_uuid: courseUuid,
      },
      order: [
        ['id', 'ASC'],
      ],
      include: [
        {
          model: chapterModule,
          attributes: ['uuid'],
        },
      ],
    });
  },
};
