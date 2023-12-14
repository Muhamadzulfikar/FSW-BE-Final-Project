/* eslint-disable no-useless-catch */
const { userCourse, userCoursePayment } = require('../models');

module.exports = {
  async buyCourseUserDetail(userUuid, courseUuid) {
    // eslint-disable-next-line no-useless-catch
    try {
      const createdUserCourse = await userCourse.create({
        user_uuid: userUuid,
        course_uuid: courseUuid,
        is_onboarding: true,
      });

      return createdUserCourse;
    } catch (error) {
      throw error;
    }
  },

  async paymentCourseUserDetail(userCourseUuid) {
    // eslint-disable-next-line no-useless-catch
    try {
      const createdUserCoursePayment = await userCoursePayment.create({
        user_course_uuid: userCourseUuid,
      });

      return createdUserCoursePayment;
    } catch (error) {
      throw error;
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
      throw error;
    }
  },
};
