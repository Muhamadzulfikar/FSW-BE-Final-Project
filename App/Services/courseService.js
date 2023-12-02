const { LRUCache } = require('lru-cache');
const crypto = require('crypto');
const courseRepository = require('../Repositories/courseRepository');
const errorHandling = require('../Error/errorHandling');
const courseChapterRepository = require('../Repositories/courseChapterRepository');
const options = require('./cacheService');

const cache = new LRUCache(options);

module.exports = {
  ifNoneMatch(ETagUser, ETagServer) {
    if (ETagUser === ETagServer) {
      errorHandling.notModified();
    }
  },

  generateEtag(responseData) {
    const hash = crypto.createHash('sha256');
    const sortedStringifiedData = JSON.stringify(responseData, Object.keys(responseData).sort());
    hash.update(sortedStringifiedData);
    return hash.digest('base64url');
  },

  getTotalModuleAndMinute(courseUuid) {
    return Promise.all([
      courseChapterRepository.getTotalModule(courseUuid),
      courseChapterRepository.getTotalMinute(courseUuid),
    ]);
  },

  async getAllListCourses(ETagUser) {
    const ETagCache = cache.get('courses');
    if (ETagCache && ETagUser) {
      this.ifNoneMatch(ETagUser, ETagCache);
    }
    const courses = await courseRepository.getAllCourses();

    const data = Promise.all(courses.map(async (course) => ({
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

    const responseData = await data;

    const ETagServer = this.generateEtag(responseData);
    cache.set('courses', ETagServer);

    return [...responseData, { ETag: ETagServer }];
  },

  async getCourseDetailById(id, ETagUser) {
    const EtagCache = cache.get('course-detail');
    if (EtagCache && ETagUser) {
      this.ifNoneMatch(ETagUser, EtagCache);
    }

    const course = await courseRepository.getCourseById(id);
    const [totalModule, totalMinute] = await this.getTotalModuleAndMinute(course.uuid);
    const EtagServer = this.generateEtag({ ...course, totalModule, totalMinute });
    cache.set('course-detail', EtagServer);

    const {
      description,
      class_target: courseTarget,
      telegram,
      onboarding,
    } = course.courseDetails;

    const courseModule = course.courseChapters.map((courseChapter) => ({
      chapter: courseChapter.chapter,
      estimation: courseChapter.duration,
      module: courseChapter.chapterModules,
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
      isPremium: course.is_premium,
      courseCode: course.code,
      category: course.courseCategory?.name,
      description,
      classTarget: courseTarget,
      telegram,
      onboarding,
      courseModule,
    };

    return { ...responseData, Etag: EtagServer };
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
