const courseService = require('../Services/courseService');

module.exports = {
  async getAllCourses(req, res) {
    try {
      const data = await courseService.getAllListCourses();
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data,
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

  async filterCourses(req, res) {
    try {
      let courses;
      const { categoryIds, levels } = req;

      if (categoryIds && levels) {
        courses = await courseService.filterCourseByCategoryAndLevel(categoryIds, levels);
      } else if (categoryIds) {
        courses = await courseService.filterCourseByCategory(categoryIds);
      } else if (levels) {
        courses = await courseService.filterCourseByLevel(levels);
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
