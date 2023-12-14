const { Op } = require('sequelize');
const errorHandling = require('../Error/errorHandling');

module.exports = {
  filterByCategoriesAndLevel(req, res, next) {
    try {
      const {
        categoryId,
        level,
        premium,
        search,
      } = req.query;

      let isPremium;
      const categoryIds = categoryId && categoryId.split(',').map(Number);
      const levels = level && level.split(',');
      if (premium) {
        isPremium = premium === '1';
      }
      if (levels && levels.some((l) => !['beginner', 'intermediate', 'advanced'].includes(l))) {
        errorHandling.badRequest('level must be valid enum (beginner, intermediate, advanced)');
      }

      const filter = {};
      if (categoryIds) filter.course_category_id = categoryIds;
      if (levels) filter.level = levels;
      if (isPremium != null) filter.isPremium = isPremium;
      if (search) {
        const filterSearch = search.charAt(0).toUpperCase() + search.slice(1);
        filter.name = {
          [Op.like]: `%${filterSearch}%`,
        };
      }

      req.filter = filter;

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
