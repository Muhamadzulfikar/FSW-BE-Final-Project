const crypto = require('crypto');
const courseChapterRepository = require('../Repositories/courseChapterRepository');
const courseRepository = require('../Repositories/courseRepository');
const courseService = require('../Services/courseService');
const errorHandling = require('../Error/errorHandling');

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
      const course = await courseRepository.getCourseById(id);
      const { uuid: courseUuid } = course;
      const totalCourseModule = await courseChapterRepository.getTotalModule(courseUuid);
      const durationCourse = await courseChapterRepository.getTotalMinute(courseUuid);

      const {
        description: courseDescription,
        class_target: courseTarget,
        telegram: telegramLink,
        onboarding: courseOnboarding,
      } = course.courseDetails;

      const responseData = {
        id: course.uuid,
        name: course.name,
        image: course.image,
        author: course.author,
        price: course.price,
        level: course.level,
        rating: course.rating,
        totalModule: totalCourseModule,
        totalMinute: durationCourse,
        isPremium: course.is_premium,
        classCode: course.code,
        category: course.courseCategory?.name,
        description: courseDescription,
        classTarget: courseTarget,
        telegram: telegramLink,
        onboarding: courseOnboarding,
        classModule: course.courseChapters,
      };

      const hash = crypto.createHash('sha256');
      const sortedStringifiedData = JSON.stringify(responseData, Object.keys(responseData).sort());
      hash.update(sortedStringifiedData);
      errorHandling.internalError(req.get('if-none-match'));

      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: responseData,
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
