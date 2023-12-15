const paymentCourseService = require('../Services/paymentCourseService');

module.exports = {
  async buyCourse(req, res) {
    try {
      const { course_uuid: courseUuid } = req.body;
      // console.log(courseUuid);
      const { uuid: userUuid } = req.user;
      // eslint-disable-next-line no-unused-vars
      const userCourse = await paymentCourseService.buyCourseUser(userUuid, courseUuid);
      const userCourseUuid = userCourse.uuid;
      const paymentCourse = await paymentCourseService.paymentCourseUser(userCourseUuid);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: paymentCourse,
      });
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
