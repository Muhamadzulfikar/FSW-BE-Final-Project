const courseService = require('../Services/courseService');

module.exports = {
  async getAllCourses(req, res) {
    try {
      const { filter } = req;
      const courses = await courseService.getAllListCourses(filter);

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

  async getCourseDetailById(req, res) {
    try {
      const courseDetail = await courseService.getCourseDetailById(req.params.id);

      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: courseDetail,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async getCourseById(req, res, next) {
    try {
      const { uuid } = req.params;
      const course = await courseService.getCourseById(uuid);
      req.course = course;
      next();
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },
  async getCourseAdmin(req, res) {
    try {
      const courses = await courseService.getListCourseAdmin();
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

  async createCourse(req, res) {
    try {
      const dataCourse = req.body;
      const courses = await courseService.createCourseAdmin(dataCourse);
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

  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const dataCourse = req.body;
      await courseService.updateCourseAdmin(id, dataCourse);
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

  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      await courseService.deleteCourseAdmin(id);
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
