const { ValidationError } = require('sequelize');
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
      if (error instanceof Error) {
        res.status(500).json(
          {
            status: 'ERROR',
            code: 500,
            message: error.message,
          },
        );
      } else if (error instanceof ValidationError) {
        res.status(400).json(
          {
            status: 'ERROR',
            code: 400,
            message: error.message,
          },
        );
      } else {
        res.status(500).json(
          {
            status: 'ERROR',
            code: 500,
            message: 'Internal Server Error',
          },
        );
      }
    }
  },
};
