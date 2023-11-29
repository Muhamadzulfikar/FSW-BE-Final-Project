const courseChapterRepository = require('../Repositories/courseChapterRepository');
const courseRepository = require('../Repositories/courseRepository');
const courseService = require('../Services/courseService');

module.exports = {

  async getAllCourses(req, res) {
    try {
      const courses = await courseService.getAllListCourses();
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
      // get course detail by ID
      const { id } = req.params;
      const course = courseRepository.getCourseById(id);
      const totalModule = courseChapterRepository.getTotalModule;
      const totalMinute = courseChapterRepository.getTotalMinute;
      res.status(200).json(
        this.bodyResponse({
          ...course,
          id,
          total_module: totalModule,
          total_minute: totalMinute,
        }),
      );
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async filterCourse(req, res) {
    try {
      const { categoryId, level } = req.query;
      let courses;
      if (!categoryId && !level) {
        const allCourses = await courseService.getAllListCourses();
        return res.status(200).json({
          status: 'OK',
          code: 200,
          message: 'Success',
          data: allCourses,
        });
      }
      if (categoryId && level) {
        courses = await courseService.filterCourseByCategoryAndLevel(categoryId, level);
      } else if (categoryId) {
        courses = await courseService.filterCourseByCategory(categoryId);
      } else if (level) {
        courses = await courseService.filterCourseByLevel(level);
      }
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
