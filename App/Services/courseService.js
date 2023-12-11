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
        introVideo: course.intro_video,
        totalModule,
        totalMinute,
      };
    });
  },

  // eslint-disable-next-line consistent-return
  async getAllListCourses(filter) {
    try {
      const courses = await courseRepository.getAllCourses(filter);
      return this.courseResponse(courses);
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  // eslint-disable-next-line consistent-return
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
        chapter: courseChapter.chapter,
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
        onboarding,
        courseModules,
      };

      return responseData;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },
};
