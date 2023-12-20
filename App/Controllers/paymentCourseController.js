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
      const paymentCourse = await paymentCourseService.paymentCourse(paymentUuid, paymentMethod);
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
};
