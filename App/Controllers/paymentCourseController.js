const paymentCourseService = require('../Services/paymentCourseService');

module.exports = {
  async enrollCourse(req, res) {
    try {
      const { course_uuid: courseUuid } = req.body;
      const { userUuid } = req.user;
      const course = await paymentCourseService.enrollCourse(userUuid, courseUuid);
      res.status(201).json({
        status: 'Created',
        code: 201,
        message: 'Successfully Enrollment Course',
        data: course,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async paymentCourse(req, res) {
    try {
      const { paymentUuid } = req.params;
      const { paymentMethod } = req;
      const { userUuid } = req.user;
      const paymentCourse = await paymentCourseService.paymentCourse(paymentUuid, paymentMethod, userUuid);
      res.status(201).json({
        status: 'OK',
        code: 201,
        message: 'Successfully payment course',
        data: paymentCourse,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async paymentHistory(req, res) {
    try {
      const { userUuid } = req.user;
      // eslint-disable-next-line max-len
      const paymentHistory = await paymentCourseService.paymentHistoryUser(userUuid);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: paymentHistory,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async invoicePayment(req, res) {
    try {
      const { paymentUuid } = req.params;
      const invoice = await paymentCourseService.invoicePayment(paymentUuid);

      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Successfully Get Invoice Course',
        data: invoice,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },
};
