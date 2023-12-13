const paymentCourseRepository = require('../Repositories/paymentCourseRepository');
const errorHandling = require('../Error/errorHandling');

module.exports = {
// eslint-disable-next-line consistent-return
  async buyCourseUser(userUuid, courseUuid) {
    try {
      const courses = await paymentCourseRepository.buyCourseUserDetail(userUuid, courseUuid);
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },
  // eslint-disable-next-line consistent-return
  async paymentCourseUser(userCourseUuid) {
    try {
      const courses = await paymentCourseRepository.paymentCourseUser(userCourseUuid);
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  // eslint-disable-next-line consistent-return
  async paymentCourseDone(userCourseUuid, dataPayment) {
    try {
      const course = await paymentCourseRepository.paymentCourseUser(userCourseUuid, dataPayment);
      return course;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },
};
