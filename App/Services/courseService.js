const { ValidationError, DatabaseError, ForeignKeyConstraintError } = require('sequelize');
const courseRepository = require('../Repositories/courseRepository');
const errorHandling = require('../Error/errorHandling');

module.exports = {
  mapCourseResponse(course) {
    const { courseChapters } = course;
    const totalModule = courseChapters.length;
    const totalMinute = courseChapters.reduce((total, chapter) => total + chapter.duration, 0);
    let progressBar = 0;

    if (courseChapters[0].chapterModules) {
      let totalCompleteVideo = 0;
      let totalVideo = 0;

      courseChapters.forEach((courseChapter) => {
        const { chapterModules } = courseChapter;

        chapterModules.forEach((chapterModule) => {
          const userChapterModules = chapterModule.userChapterModules[0];
          const isCompleted = userChapterModules?.is_complete;

          if (isCompleted) {
            totalCompleteVideo += 1;
            totalVideo += 1;
          } else {
            totalVideo += 1;
          }
        });
      });

      progressBar = Number(((totalCompleteVideo / totalVideo) * 100).toFixed());
    }

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
      progressBar,
    };
  },

  async getAllListCourses(filter) {
    try {
      const courses = await courseRepository.getAllCourses(filter);
      return courses.map(this.mapCourseResponse);
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async getCourseDetailById(id, userUuid) {
    try {
      const course = await courseRepository.getCourseById(id, userUuid);
      const { courseChapters } = course;
      const totalModule = courseChapters.length;
      const totalMinute = courseChapters.reduce((total, chapter) => total + chapter.duration, 0);

      const {
        description, class_target: courseTarget, telegram, onboarding,
      } = course.courseDetail.dataValues;

      let totalCompleteVideo = 0;
      let totalVideo = 0;

      const courseModules = course.courseChapters.map((courseChapter) => ({
        chapter: courseChapter.chapter,
        estimation: courseChapter.duration,
        module: courseChapter.chapterModules.map((courseModule) => {
          const userChapterModules = courseModule.userChapterModules[0];
          const isCompleted = userChapterModules ? userChapterModules.is_complete : false;
          if (isCompleted) {
            totalCompleteVideo += 1;
            totalVideo += 1;
          } else {
            totalVideo += 1;
          }
          return {
            chapterModuleUuid: courseModule.uuid,
            userChapterModuleUuid: userChapterModules?.uuid,
            title: courseModule.title,
            isCompleted,
          };
        }),
      }));

      const progressBar = Number(((totalCompleteVideo / totalVideo) * 100).toFixed());

      const userCourses = course.userCourses[0];
      const payment = userCourses?.userCoursePayments[0];
      const isPaid = payment ? payment.is_paid : false;

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
        isOnboarding: userCourses ? userCourses.is_onboarding : false,
        progressBar,
        isPaid,
        courseModules,
      };

      return responseData;
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest(error.message);
      }
      errorHandling.internalError(error);
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

  async deleteCourseAdmin(courseUuid) {
    try {
      const course = await courseRepository.deleteCourse(courseUuid);
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

  async completingModule(userChapterModuleUuid) {
    try {
      const completingModule = await courseRepository.completingModule(userChapterModuleUuid);
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

  async getVideoCourse(chapterModuleUuid) {
    try {
      const videoCourse = await courseRepository.getVideoCourse(chapterModuleUuid);
      return videoCourse;
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest('Chapter Module Uuid format is not valid');
      }
      errorHandling.internalError(error);
    }
  },

  async getCourseByChapterModule(chapterModuleUuid) {
    try {
      const course = await courseRepository.getCourseByChapterModule(chapterModuleUuid);
      return course;
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest(error.message);
      }
      errorHandling.internalError(error);
    }
  },

  async getPaymentStatusByUserCourse(userUuid, courseUuid) {
    try {
      const paymentStatus = await courseRepository.getPaymentStatusByUserCourse(userUuid, courseUuid);
      return paymentStatus;
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest(error.message);
      }
      errorHandling.internalError(error);
    }
  },

  async getMyCourse(userUuid, filter, isComplete) {
    try {
      let responseData;
      const myCourses = await courseRepository.getMyCourse(userUuid, filter);

      if (isComplete === '1') {
        responseData = myCourses.map(this.mapCourseResponse).filter((course) => course.progressBar === 100);
      } else if (isComplete === '0') {
        responseData = myCourses.map(this.mapCourseResponse).filter((course) => course.progressBar < 100);
      } else {
        responseData = myCourses.map(this.mapCourseResponse);
      }

      return responseData;
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest(error.message);
      }
      errorHandling.internalError(error);
    }
  },
};
