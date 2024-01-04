const {
  ValidationError, DatabaseError, ForeignKeyConstraintError,
} = require('sequelize');
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

  async getCourseByIdAdmin(id) {
    try {
      const course = await courseRepository.getCourseByIdAdmin(id);
      const { courseChapters } = course;
      const {
        description, class_target: courseTarget, telegram, onboarding,
      } = course.courseDetail.dataValues;

      const courseModules = courseChapters.map((chapter) => ({
        id: chapter.id,
        chapter: chapter.chapter,
        estimation: chapter.duration,
        module: chapter.chapterModules.map((module) => ({
          chapterModuleUuid: module.uuid,
          title: module.title,
          courseLink: module.course_link,
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
      if (error instanceof DatabaseError) {
        errorHandling.badRequest(error.message);
      } else {
        errorHandling.internalError(error);
      }
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

  async createCourseAdmin(bodyRequest) {
    try {
      const course = await courseRepository.createCourseAdmin(bodyRequest);

      return course;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      if (error instanceof DatabaseError) {
        errorHandling.badRequest(error.message);
      }
      errorHandling.internalError(error);
    }
  },

  filterCreateModule(filterChapter, userUuids) {
    const result = [];

    filterChapter.forEach((chapter) => {
      const filteredModules = chapter.chapterModules.filter((module) => !module.uuid);

      if (filteredModules) {
        const { id: chapterId } = chapter;

        filteredModules.forEach((module) => {
          result.push({
            course_chapter_id: chapterId,
            title: module.title,
            course_link: module.course_link,
            userChapterModules: userUuids.map((userUuid) => ({
              user_uuid: userUuid,
              is_complete: false,
            })),
          });
        });
      }
    });

    return result;
  },

  filterCreateChapter(chapters, userUuids, courseUuid) {
    return chapters.filter((chapter) => !chapter.id).map((chapter) => ({
      course_uuid: courseUuid,
      duration: chapter.duration,
      chapter: chapter.chapter,
      chapterModules: chapter.chapterModules.map((module) => ({
        ...module,
        userChapterModules: userUuids.map((userUuid) => ({
          user_uuid: userUuid,
          is_complete: false,
        })),
      })),
    }));
  },

  async createChapterAndModule(chapters, filterChapter, courseUuid) {
    try {
      const userModule = await courseRepository.getUserModuleByCourse(courseUuid);
      const userUuids = userModule.flatMap((chapter) => chapter.chapterModules.flatMap((module) => module.userChapterModules.map((user) => user.user_uuid)));

      const createCourseChapters = this.filterCreateChapter(chapters, userUuids, courseUuid);
      const createChapterModules = this.filterCreateModule(filterChapter, userUuids);

      if (createCourseChapters.length > 0) {
        courseRepository.createCourseChapter(createCourseChapters);
      } else if (createChapterModules.length > 0) {
        courseRepository.createChapterModule(createChapterModules);
      }
    } catch (error) {
      errorHandling.internalError(error);
    }
  },

  async deleteChapterAndModule(paramsDelete) {
    try {
      const [chapters, chapterModules, chapterIds, moduleUuids] = paramsDelete;

      const deleteCourseChapters = chapters.filter((chapter) => !chapterIds.includes(chapter.id));
      const deleteChapterModules = chapterModules.filter((module) => !moduleUuids.includes(module.uuid));

      if (deleteCourseChapters.length > 0) {
        courseRepository.deleteCourseChapter(deleteCourseChapters);
      } else if (deleteChapterModules.length > 0) {
        courseRepository.deleteChapterModule(deleteChapterModules);
      }
    } catch (error) {
      errorHandling.internalError(error);
    }
  },

  async updateCourseAdmin(courseUuid, bodyRequest) {
    try {
      const chapters = await courseRepository.getChapterAndModuleUuid(courseUuid);
      const chapterModules = chapters.flatMap((chapter) => chapter.chapterModules);
      const chapterIds = chapters.map((chapter) => chapter.id);
      const moduleUuids = chapterModules.map((module) => module.uuid);

      const payloadChapterIds = bodyRequest.courseChapters.map((chapter) => chapter.id);
      const filterChapter = bodyRequest.courseChapters.filter((chapter) => chapterIds.includes(chapter.id));

      const payloadChapterModules = bodyRequest.courseChapters.flatMap((chapter) => chapter.chapterModules);
      const payloadModuleUuids = payloadChapterModules.map((module) => module.uuid);
      const filterChapterModules = payloadChapterModules.filter((module) => moduleUuids.includes(module.uuid));

      const paramsDelete = [chapters, chapterModules, payloadChapterIds, payloadModuleUuids];

      await Promise.all([
        this.deleteChapterAndModule(paramsDelete),
        this.createChapterAndModule(bodyRequest.courseChapters, filterChapter, courseUuid),
        courseRepository.updateCourse(courseUuid, bodyRequest),
        courseRepository.updateCourseDetail(courseUuid, bodyRequest.courseDetail),
        courseRepository.updateCourseChapter(filterChapter),
        courseRepository.updateChapterModule(filterChapterModules),
      ]);

      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      } else if (error instanceof DatabaseError) {
        errorHandling.badRequest(error.message);
      } else if (error instanceof ForeignKeyConstraintError) {
        errorHandling.badRequest(error.message);
      } else errorHandling.internalError(error);
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
      } else errorHandling.internalError(error);
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
      } else errorHandling.internalError(error);
    }
  },

  async getCourseByUserChapterModule(userChapterModuleUuid) {
    try {
      const userChapterModule = await courseRepository.getCourseByUserChapterModule(userChapterModuleUuid);
      const { course } = userChapterModule.chapterModule.courseChapter;
      return course;
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest('User Chapter Module Uuid format is not valid');
      } else if (error instanceof TypeError) {
        errorHandling.badRequest('User Chapter Module Uuid not found');
      } else {
        errorHandling.internalError(error);
      }
    }
  },

  async getChapterModuleByCourse(courseUuid) {
    try {
      const chapterModule = await courseRepository.getChapterModuleByCourse(courseUuid);
      return chapterModule.flatMap((chapter) => chapter.chapterModules.map((module) => module.uuid));
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest('Course Uuid format is not valid');
      } else {
        errorHandling.internalError(error);
      }
    }
  },

  async getUserChapterModuleByChapterModule(userUuid, chapterModuleUuid) {
    try {
      const userChapterModule = await courseRepository.getUserChapterModuleByChapterModule(userUuid, chapterModuleUuid);
      return userChapterModule.map((userModule) => userModule.uuid);
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest('Chapter Module Uuid format is not valid');
      } else {
        errorHandling.internalError(error);
      }
    }
  },
};
