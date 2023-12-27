const { Op } = require('sequelize');
const errorHandling = require('../Error/errorHandling');
const courseService = require('../Services/courseService');
const responseError = require('../Error/responseError');
const authService = require('../Services/authService');

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

  async validateUserCourse(req, res, next) {
    try {
      const { userUuid } = req.user;
      const { courseUuid } = req.params;
      const getUserCourse = await courseService.getUserCourse(userUuid, courseUuid);

      if (!getUserCourse) errorHandling.badRequest('User course not found');

      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isCompletedCourseModule(req, res, next) {
    try {
      const { userUuid } = req.user;
      const { chapter_module_uuid: chapterModuleUuid } = req.body;
      const UserModule = await courseService.getUserModule(userUuid, chapterModuleUuid);

      if (UserModule) errorHandling.badRequest('You already completed this module');

      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isPremiumCourseAndPaid(req, res, next) {
    try {
      const { chapterModuleUuid } = req.params;
      const { userUuid } = req.user;
      const course = await courseService.getCourseByChapterModule(chapterModuleUuid);
      const { chapter } = course.courseChapters[0];

      if (course.isPremium && chapter !== 'Chapter 1') {
        const paymentStatus = await courseService.getPaymentStatusByUserCourse(userUuid, course.uuid);
        const userCoursePayments = paymentStatus?.userCoursePayments[0];
        const paidCourse = userCoursePayments?.is_paid;
        if (!paidCourse) errorHandling.badRequest('You must pay this course first');
      }

      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async authorizeCourse(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (token) {
        const user = await authService.authorize(token);
        if (!user) errorHandling.badRequest('User Not Found');
        req.user = user;
      }
      next();
    } catch (error) {
      if (error.code) {
        responseError(res, error);
      }
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: error.message,
      });
    }
  },
};
