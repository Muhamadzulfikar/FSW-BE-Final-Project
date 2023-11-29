const courseRepository = require('../Repositories/courseRepository');
const errorHandling = require('../Error/errorHandling');
const courseChapterRepository = require('../Repositories/courseChapterRepository');

module.exports = {

  async getAllListCourses() {
    try {
      const courses = await courseRepository.getAllCourses();
      const data = await Promise.all(courses.map(async (course) => ({
        id: course.uuid,
        category: course.courseCategory.name,
        image: course.image,
        name: course.name,
        author: course.author,
        price: course.price,
        level: course.level,
        rating: course.rating,
        isPremium: course.is_premium,
        classCode: course.code,
        totalModule: await courseChapterRepository.getTotalModule(course.uuid),
        totalMinute: await courseChapterRepository.getTotalMinute(course.uuid),
      })));
      return await data;
    } catch (error) {
      throw errorHandling.badRequest(error);
    }
  },

  async filterCourseByCategoryAndLevel(category, level) {
    try {
      const courses = await courseRepository.CourseByCategoryAndLevel(category, level);
      return courses;
    } catch (error) {
      throw errorHandling.badRequest(error);
    }
  },

  async filterCourseByCategory(categoryId) {
    try {
      const courses = await courseRepository.CourseByCategory(categoryId);
      return courses;
    } catch (error) {
      throw errorHandling.badRequest(error);
    }
  },

  async filterCourseByLevel(level) {
    try {
      const courses = await courseRepository.CourseByLevel(level);
      return courses;
    } catch (error) {
      throw errorHandling.badRequest(error);
    }
  },
};
