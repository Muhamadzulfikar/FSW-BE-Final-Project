const errorHandling = require('../Error/errorHandling');
const responseError = require('../Error/responseError');
const courseService = require('../Services/courseService');
const paymentCourseService = require('../Services/paymentCourseService');

module.exports = {
  async validatePaymentRequest(req, res, next) {
    try {
      const { payment_method: paymentMethod } = req.body;
      const { paymentUuid } = req.params;
      const paymentInvoice = await paymentCourseService.getPaymentById(paymentUuid);

      if (!paymentInvoice) errorHandling.badRequest('Payment invoice not found');

      if (!paymentMethod) errorHandling.badRequest('Payment method must not be empty');

      const allowedPaymentMethods = ['credit card', 'bank transfer'];
      if (!allowedPaymentMethods.includes(paymentMethod.toLowerCase())) {
        errorHandling.badRequest('Payment method must be credit card or bank transfer');
      }

      req.paymentMethod = paymentMethod.toLowerCase();
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isEnrollCourse(req, res, next) {
    try {
    /**
     * 1. check if user already enroll this course
     * 2. check invoice (user course payment moodel) expired and is_paid
     * 3. if is_paid true return error,
     *    if is_paid false and not expired return error,
     *    if is_paid false and expired call next()
     */
      const { userUuid } = req.user;
      const { course_uuid: courseUuid } = req.body;
      if (!courseUuid) errorHandling.badRequest('Course uuid must not be empty');
      const userCourse = await courseService.getUserCourse(userUuid, courseUuid);

      if (userCourse) {
        const payment = await paymentCourseService.getPaymentByUserCourse(userCourse.uuid);
        if (payment?.is_paid === true) errorHandling.badRequest('You already enroll this course');
        if (payment?.expiredAt > new Date()) {
          res.status(200).json({
            status: 'OK',
            code: 200,
            message: 'Success',
            data: {
              paymentUuid: payment?.uuid,
            },
          });
        }
      }

      next();
    } catch (error) {
      responseError(res, error);
    }
  },
};
