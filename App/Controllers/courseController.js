const courseChapterRepository = require('../Repositories/courseChapterRepository');
const courseRepository = require('../Repositories/courseRepository');

module.exports = {
  bodyResponse(bodyData) {
    return {
      status: 'OK',
      code: 200,
      message: 'Success',
      data: bodyData,
    };
  },

  async getAllCourses(req, res) {
    try {
      const courses = await courseRepository.getAllCourses();
      res.status(200).json(this.bodyResponse(courses));
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
      const { category, level } = req.query;
      if (category && level) {
        const courses = await courseRepository.filterCourseByCategoryAndLevel(category);
        res.status(200).json(this.bodyResponse(courses));
      }

      if (category) {
        const courses = await courseRepository.filterCourseByCategory(category);
        res.status(200).json(this.bodyResponse(courses));
      }

      if (level) {
        const courses = await courseRepository.filterCourseByLevel(level);
        res.status(200).json(this.bodyResponse(courses));
      }
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },
};
