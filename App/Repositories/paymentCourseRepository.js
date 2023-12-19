const { ValidationError } = require('sequelize');
const errorHandling = require('../Error/errorHandling');

const {
  userCourse,
  userCoursePayment,
  course,
  courseCategory,
  courseChapter,
  chapterModule,
  sequelize,
} = require('../models');

module.exports = {
  async enrollCoursePremium(userUuid, courseUuid) {
    const result = await sequelize.transaction(async (t) => {
      const enrollCourse = await userCourse.create({
        user_uuid: userUuid,
        course_uuid: courseUuid,
        is_onboarding: false,
      }, { transaction: t });

      const invoice = await userCoursePayment.create({
        user_course_uuid: enrollCourse.uuid,
      }, { transaction: t });

      return invoice.uuid;
    });

    return result;
  },

  async InvoicePayment(userCoursePaymentUuid) {
    return userCoursePayment.findByPk(userCoursePaymentUuid, {
      include: [
        {
          model: userCourse,
          attributes: ['course_uuid'],
          include: [
            {
              model: course,
              attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
              include: [
                {
                  model: courseCategory,
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
      attributes: ['expiredAt', 'is_paid'],
    });
  },

  async buyCourseUserDetail(userUuid, courseUuid) {
    try {
      const createdUserCourse = await userCourse.create({
        user_uuid: userUuid,
        course_uuid: courseUuid,
        is_onboarding: false,
      });

      return createdUserCourse;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      errorHandling.internalError(error);
    }
  },

  async paymentCourseUserDetail(userCourseUuid) {
    try {
      const createdUserCoursePayment = await userCoursePayment.create({
        user_course_uuid: userCourseUuid,
      });

      return createdUserCoursePayment;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      errorHandling.internalError(error);
    }
  },

  async paymentCourseUser(userCourseUuid, dataPayment) {
    try {
      const payment = await userCoursePayment.update(
        {
          payment_method: dataPayment.payment_method,
          is_paid: true,
          expiredAt: new Date(),
        },
        {
          where: {
            user_course_uuid: userCourseUuid,
          },
        },
      );
      return payment;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      errorHandling.internalError(error);
    }
  },

  async paymentHistoryDetail(userCourseUuid, userUuid) {
    try {
      const userCourseUser = await userCourse.findAll({
        where: {
          user_uuid: userUuid,
        },
      });

      // Periksa apakah userCourseUser tidak ditemukan
      if (!userCourseUser.length) {
        errorHandling.notFound('User not found');
      }

      const payments = await userCoursePayment.findAll({
        where: {
          user_course_uuid: userCourseUser,
          userId: userCourseUser[0].id, // Gunakan ID pengguna dari hasil pencarian userCourse
        },
      });

      return payments;
    } catch (error) {
      if (error instanceof ValidationError) {
        // Handle validation errors
        errorHandling.badRequest(error.errors[0].message);
      } else {
        // Handle other errors
        errorHandling.internalError(error);
      }
    }
  },
  async paymentHistoryDetailNew(userUuid) {
    try {
      const userCourses = await userCourse.findAll({
        where: {
          user_uuid: userUuid,
        },
        include: [
          {
            model: course,
            attributes: ['image', 'name', 'author', 'level'],
            include: [
              {
                model: courseCategory,
                attributes: ['name'],
              },
              {
                model: courseChapter,
                attributes: ['duration', 'id'],
                order: [['id', 'ASC']],
                include: [
                  {
                    model: chapterModule,
                    attributes: ['title', 'course_link'],
                    order: [['id', 'ASC']],
                  },
                ],
              },
            ],
          },
        ],
      });

      // eslint-disable-next-line max-len
      const courseChapters = userCourses.map((userCourseItem) => userCourseItem.course.courseChapters);
      const totalModule = courseChapters.length;
      // eslint-disable-next-line max-len
      const totalMinute = courseChapters.reduce((total, chapters) => total + chapters.reduce((sum, chapter) => sum + chapter.duration, 0), 0);

      const payments = userCourses.map((userCourseItem) => {
        const {
          course: {
            image, name, author, level,
          },
        } = userCourseItem;
        const courseCategoryItem = userCourseItem.course.courseCategory.name;
        return {
          image,
          category: courseCategoryItem,
          courseName: name,
          courseAuthor: author,
          courseLevel: level,
          totalModules: totalModule,
          totalMinutes: totalMinute,
        };
      });
      return payments;
    } catch (error) {
      if (error instanceof ValidationError) {
        // Handle validation errors
        errorHandling.badRequest(error.errors[0].message);
      } else {
        // Handle other errors
        errorHandling.internalError(error);
      }
    }
  },
};
