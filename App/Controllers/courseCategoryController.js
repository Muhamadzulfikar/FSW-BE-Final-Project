const courseCategoryRepository = require('../Repositories/courseCategoryRepository');

module.exports = {
  async getAllCourseCategory(req, res) {
    try {
      const data = await courseCategoryRepository.getAllCourseCategories();
      res.status(200).json(
        {
          status: 'Ok',
          code: 200,
          message: 'Success',
          data,
        },
      );
    } catch (error) {
      res.status(500).json(
        {
          status: 'Internal Server Error',
          code: 500,
          message: error.message,
        },
      );
    }
  },
};
