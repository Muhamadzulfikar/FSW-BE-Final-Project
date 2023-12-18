const { ValidationError } = require('sequelize');
const errorHandling = require('../Error/errorHandling');

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
      attributes: ['expiredAt', 'is_paid'],
    });
  },

  async buyCourseUserDetail(userUuid, courseUuid) {
    try {
      const createdUserCourse = await userCourse.create({
        user_uuid: userUuid,
        course_uuid: courseUuid,
        is_onboarding: false,
      });

      return createdUserCourse;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      errorHandling.internalError(error);
    }
  },

  async paymentCourseUserDetail(userCourseUuid) {
    try {
      const createdUserCoursePayment = await userCoursePayment.create({
        user_course_uuid: userCourseUuid,
      });

      return createdUserCoursePayment;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      errorHandling.internalError(error);
    }
  },

  async paymentCourseUser(userCourseUuid, dataPayment) {
    try {
      const payment = await userCoursePayment.update(
        {
          payment_method: dataPayment.payment_method,
          is_paid: true,
          expiredAt: new Date(),
        },
        {
          where: {
            user_course_uuid: userCourseUuid,
          },
        },
      );
      return payment;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      errorHandling.internalError(error);
    }
  },
};
