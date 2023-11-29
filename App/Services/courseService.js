const courseRepository = require('../Repositories/courseRepository');
const errorHandling = require('../Error/errorHandling');

module.exports = {
  async getAllListCourses() {
    try {
      const courses = await courseRepository.getAllCourses();
      return courses;
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
