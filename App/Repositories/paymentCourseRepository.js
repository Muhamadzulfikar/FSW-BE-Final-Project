const {
  userCourse,
  userCoursePayment,
  course,
  courseCategory,
  sequelize,
} = require('../models');

module.exports = {
  async enrollCoursePremium(userUuid, courseUuid) {
    const result = await sequelize.transaction(async (t) => {
      const enrollCourse = await userCourse.create({
        user_uuid: userUuid,
        course_uuid: courseUuid,
        is_onboarding: false,
      }, { transaction: t });

      const invoice = await userCoursePayment.create({
        user_course_uuid: enrollCourse.uuid,
      }, { transaction: t });

      return invoice.uuid;
    });

    return result;
  },

  async InvoicePayment(userCoursePaymentUuid) {
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

  async paymentCourse(paymentUuid, payload) {
    const payment = await userCoursePayment.update(payload, {
      where: {
        uuid: paymentUuid,
      },
    });
    return payment;
  },

  async getPaymentById(paymentUuid) {
    return userCoursePayment.findByPk(paymentUuid);
  },

  async getPaymentByUserCourse(userCourseUuid) {
    return userCoursePayment.findOne({
      where: {
        user_course_uuid: userCourseUuid,
      },
    });
  },
};
