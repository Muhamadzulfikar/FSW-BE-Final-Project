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

  async getCourseStatistic(req, res) {
    try {
      const courses = await courseService.getListCourseStatisticAdmin();
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

  async getManagementCourse(req, res) {
    try {
      const courses = await courseService.getListCourseManagement();
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

  async isOnboarding(req, res) {
    try {
      const { userUuid } = req.user;
      const { courseUuid } = req.params;
      await courseService.isOnboarding(userUuid, courseUuid);
      res.status(201).json({
        status: 'created',
        code: 201,
        message: 'Successfully Completed Onboarding',
        data: true,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async completingModule(req, res) {
    try {
      const { userUuid } = req.user;
      const { chapter_module_uuid: chapterModuleUuid } = req.body;
      const userChapterModule = await courseService.completingModule(userUuid, chapterModuleUuid);
      res.status(201).json({
        status: 'created',
        code: 201,
        message: 'Successfully Completing Module',
        data: userChapterModule,
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
