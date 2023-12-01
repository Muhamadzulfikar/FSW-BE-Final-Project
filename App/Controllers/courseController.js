const courseService = require('../Services/courseService');

module.exports = {
  async getAllCourses(req, res) {
    try {
      const eTagUser = req.get('If-None-Match') ? req.get('If-None-Match') : '';
      const courses = await courseService.getAllListCourses(eTagUser);
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
      const eTagUser = req.get('If-None-Match') ? req.get('If-None-Match') : '';
      const courseDetail = await courseService.getCourseDetailById(req.params.id, eTagUser);

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

  async filterCourse(req, res) {
    try {
      const { categoryId, level } = req.query;
      let courses;
      if (!categoryId && !level) {
        const allCourses = await courseService.getAllListCourses();
        res.status(200).json({
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
