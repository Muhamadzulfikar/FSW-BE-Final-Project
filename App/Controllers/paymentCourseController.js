const paymentCourseService = require('../Services/paymentCourseService');

module.exports = {
  async buyCourse(req, res) {
    try {
      const { course_uuid: courseUuid } = req.body;
      // console.log(courseUuid);
      const { userUuid } = req.user;
      const userCourse = await paymentCourseService.buyCourseUser(userUuid, courseUuid);
      const userCourseUuid = userCourse.uuid;
      const paymentCourse = await paymentCourseService.paymentCourseUser(userCourseUuid);
      res.status(200).json(paymentCourse);
    } catch (error) {
      res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: error.message || 'Bad Request',
      });
    }
  },

  async payment(req, res) {
    try {
      const userCourseUuid = req.params.id;
      const dataPayment = req.body;
      const courses = await paymentCourseService.paymentCourseDone(userCourseUuid, dataPayment);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: courses,
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
