const { ValidationError, DatabaseError, ForeignKeyConstraintError } = require('sequelize');
const courseRepository = require('../Repositories/courseRepository');
const errorHandling = require('../Error/errorHandling');

module.exports = {
  courseResponse(courses) {
    return courses.map((course) => {
      const { courseChapters } = course;
      const totalModule = courseChapters.length;
      const totalMinute = courseChapters.reduce((total, chapter) => total + chapter.duration, 0);
      return {
        id: course.uuid,
        category: course.courseCategory.name,
        image: course.image,
        name: course.name,
        author: course.author,
        price: course.price,
        level: course.level,
        rating: course.rating,
        isPremium: course.isPremium,
        classCode: course.code,
        totalModule,
        totalMinute,
      };
    });
  },

  async getAllListCourses(filter) {
    try {
      const courses = await courseRepository.getAllCourses(filter);
      return this.courseResponse(courses);
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async getCourseDetailById(id) {
    try {
      const course = await courseRepository.getCourseById(id);
      const { courseChapters } = course;
      const totalModule = courseChapters.length;
      const totalMinute = courseChapters.reduce((total, chapter) => total + chapter.duration, 0);

      const {
        description,
        class_target: courseTarget,
        telegram,
        onboarding,
      } = course.courseDetail.dataValues;

      const courseModules = course.courseChapters.map((courseChapter) => ({
        chapter: courseChapter.id,
        estimation: courseChapter.duration,
        module: courseChapter.chapterModules.map((courseModule) => ({
          title: courseModule.title,
          courseLink: courseModule.course_link,
        })),
      }));

      const responseData = {
        id: course.uuid,
        name: course.name,
        image: course.image,
        author: course.author,
        price: course.price,
        level: course.level,
        rating: course.rating,
        totalModule,
        totalMinute,
        isPremium: course.isPremium,
        courseCode: course.code,
        category: course.courseCategory.name,
        description,
        classTarget: courseTarget,
        telegram,
        introVideo: course.intro_video,
        onboarding,
        courseModules,
      };

      return responseData;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async getCourseById(id) {
    try {
      const courses = await courseRepository.getCourseByIdAdmin(id);
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async getListCourseStatisticAdmin() {
    try {
      const courses = await courseRepository.getCoursesStatisticDetail();
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },
  async getListCourseAdmin() {
    try {
      const courses = await courseRepository.getCoursesAdmin();
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async getListCourseManagement() {
    try {
      const courses = await courseRepository.getCoursesAdminManagement();
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async createCourseAdmin(dataCourse) {
    try {
      const bodyCourse = dataCourse;
      const courseName = dataCourse.name.split(' ');
      bodyCourse.name = courseName.map((name) => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
      const course = await courseRepository.createCourse(bodyCourse);
      return course;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      errorHandling.internalError(error);
    }
  },

  async updateCourseAdmin(uuid, dataCourse) {
    try {
      const course = await courseRepository.updateCourse(uuid, dataCourse);
      return course;
    } catch (error) {
      return errorHandling.badRequest(error);
    }
  },

  async deleteCourseAdmin(uuid) {
    try {
      const course = await courseRepository.deleteCourse(uuid);
      return course;
    } catch (error) {
      return errorHandling.badRequest(error);
    }
  },

  async isOnboarding(userUuid, courseUuid) {
    try {
      const payload = {
        is_onboarding: true,
      };

      const isOnboarding = await courseRepository.isOnboarding(userUuid, courseUuid, payload);
      return isOnboarding;
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest(error.message);
      }
      errorHandling.internalError(error);
    }
  },

  async getUserCourse(userUuid, courseUuid) {
    try {
      const userCourse = await courseRepository.getUserCourse(userUuid, courseUuid);
      return userCourse;
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest('Course uuid format is not valid');
      }
      errorHandling.internalError(error);
    }
  },

  async completingModule(userUuid, chapterModuleUuid) {
    try {
      const payload = {
        chapter_module_uuid: chapterModuleUuid,
        user_uuid: userUuid,
        is_complete: true,
      };

      const completingModule = await courseRepository.completingModule(payload);
      return completingModule;
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        errorHandling.badRequest('Chapter Module Uuid not found');
      }
      errorHandling.internalError(error);
    }
  },

  async getUserModule(userUuid, chapterModuleUuid) {
    try {
      const getUserModule = await courseRepository.getUserModule(userUuid, chapterModuleUuid);
      return getUserModule;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      if (error instanceof DatabaseError) {
        errorHandling.badRequest('Chapter Module Uuid format is not valid');
      }
      errorHandling.internalError(error);
    }
  },

};
