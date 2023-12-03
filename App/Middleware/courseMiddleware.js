const errorHandling = require('../Error/errorHandling');

module.exports = {
  filterByCategoriesAndLevel(req, res, next) {
    try {
      const { categoryId, level } = req.query;
      if ((categoryId && typeof categoryId !== 'string') || (level && typeof level !== 'string')) {
        errorHandling.badRequest('params must be string');
      }

      const categoryIds = categoryId && categoryId.split(',').map(Number);
      const levels = level && level.split(',');
      if (levels && levels.some((l) => !['beginner', 'intermediate', 'advanced'].includes(l))) {
        errorHandling.badRequest('level must be valid enum (beginner, intermediate, advanced)');
      }

      req.categoryIds = categoryIds;
      req.levels = levels;

      next();
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },
};
