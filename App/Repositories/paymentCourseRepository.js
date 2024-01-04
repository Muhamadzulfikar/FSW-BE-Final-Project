const {
  userCourse,
  userCoursePayment,
  course,
  courseCategory,
  courseChapter,
  sequelize,
  userChapterModule,
} = require('../models');

module.exports = {
  async enrollCoursePremium(userUuid, courseUuid, chapterModuleUuids) {
    const result = await sequelize.transaction(async (t) => {
      const enrollCourse = await userCourse.create({
        user_uuid: userUuid,
        course_uuid: courseUuid,
        is_onboarding: false,
      }, { transaction: t });

      chapterModuleUuids.flat().forEach((uuid) => {
        userChapterModule.create({
          chapter_module_uuid: uuid,
          user_uuid: userUuid,
          is_complete: false,
        }, { transaction: t });
      });

      const invoice = await userCoursePayment.create({
        user_course_uuid: enrollCourse.uuid,
      }, { transaction: t });

      return invoice.uuid;
    });

    return result;
  },

  async enrollCourseFree(userUuid, courseUuid, chapterModuleUuids) {
    const result = await sequelize.transaction(async (t) => {
      const enrollCourse = await userCourse.create({
        user_uuid: userUuid,
        course_uuid: courseUuid,
        is_onboarding: false,
      }, { transaction: t });

      chapterModuleUuids.flat().forEach((uuid) => {
        userChapterModule.create({
          chapter_module_uuid: uuid,
          user_uuid: userUuid,
          is_complete: false,
        }, { transaction: t });
      });

      const invoice = await userCoursePayment.create({
        user_course_uuid: enrollCourse.uuid,
        is_paid: true,
      }, { transaction: t });

      return invoice.uuid;
    });

    return result;
  },

  InvoicePayment(userCoursePaymentUuid) {
    return userCoursePayment.findByPk(userCoursePaymentUuid, {
      include: [
        {
          model: userCourse,
          attributes: ['course_uuid'],
          include: [
            {
              model: course,
              attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
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
      attributes: ['uuid', 'expiredAt', 'is_paid', 'payment_method'],
    });
  },

  paymentCourse(paymentUuid, payload) {
    return userCoursePayment.update(payload, {
      where: {
        uuid: paymentUuid,
      },
    });
  },

  getPaymentById(paymentUuid) {
    return userCoursePayment.findByPk(paymentUuid);
  },

  getPaymentByUserCourse(userCourseUuid) {
    return userCoursePayment.findOne({
      where: {
        user_course_uuid: userCourseUuid,
      },
    });
  },

  paymentHistory(userUuid) {
    return userCoursePayment.findAll({
      attributes: ['uuid', 'is_paid', 'expiredAt'],
      include: [
        {
          model: userCourse,
          where: { user_uuid: userUuid },
          attributes: ['uuid'],
          include: [
            {
              model: course,
              attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
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
            },
          ],
        },
      ],
    });
  },

  async deleteUserCourseAndPayment(userCourseUuid, userChapterModuleUuid) {
    const result = await sequelize.transaction((t) => {
      userCourse.destroy({
        where: {
          uuid: userCourseUuid,
        },
      }, { transaction: t });

      userChapterModule.destroy({
        where: {
          uuid: userChapterModuleUuid,
        },
      }, { transaction: t });
    });

    return result;
  },
};
