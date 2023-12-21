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

  async getCourseById(id) {
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

  async getCoursesStatisticDetail() {
    const activeUsers = await userCourse.count();
    const activeClass = await userCourse.count({
      where: {
        is_onboarding: true,
      },
    });
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
  createCourse(dataCourse) {
    return course.create(dataCourse);
  },

  updateCourse(uuid, dataCourse) {
    return course.update(dataCourse, { where: { uuid }, returnig: true });
  },

  async deleteCourse(uuid) {
    // eslint-disable-next-line max-len
    const userCoursePayments = await userCoursePayment.findAll({ where: { user_course_uuid: uuid } });
    await Promise.all(userCoursePayments.map((payment) => payment.destroy()));

    // Find and delete associated user courses
    const userCourses = await userCourse.findAll({ where: { course_uuid: uuid } });
    await Promise.all(userCourses.map(async (userCourseItem) => {
      // eslint-disable-next-line max-len
      const coursePayments = await userCoursePayment.findAll({ where: { user_course_uuid: userCourseItem.uuid } });
      await Promise.all(coursePayments.map((payment) => payment.destroy()));
      await userCourseItem.destroy();
    }));

    const courseDetails = await courseDetail.findAll({ where: { course_uuid: uuid } });
    await Promise.all(courseDetails.map((detail) => detail.destroy()));

    const courseChapters = await courseChapter.findAll({ where: { course_uuid: uuid } });
    await Promise.all(courseChapters.map(async (chapter) => {
      // eslint-disable-next-line max-len
      const chapterModules = await chapterModule.findAll({ where: { course_chapter_id: chapter.uuid } });
      await Promise.all(chapterModules.map((module) => module.destroy()));

      await chapter.destroy();
    }));

    const deletedCourse = await course.destroy({ where: { uuid }, returning: true });

    return deletedCourse;
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
    });
  },

  completingModule(payload) {
    return userChapterModule.create(payload);
  },

  getUserModule(userUuid, chapterModuleUuid) {
    return userChapterModule.findOne({
      where: {
        user_uuid: userUuid,
        chapter_module_uuid: chapterModuleUuid,
      },
    });
  },
};
