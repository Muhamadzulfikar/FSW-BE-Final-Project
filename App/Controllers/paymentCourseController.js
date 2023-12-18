const paymentCourseService = require('../Services/paymentCourseService');

module.exports = {
  async enrollCourse(req, res) {
    try {
      const { course_uuid: courseUuid } = req.body;
      const { userUuid } = req.user;
      const course = await paymentCourseService.enrollCourse(userUuid, courseUuid);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
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

  async payment(req, res) {
    try {
      const userCourseUuid = req.params.id;
      const dataPayment = req.body;
      await paymentCourseService.paymentCourseDone(userCourseUuid, dataPayment);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
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
