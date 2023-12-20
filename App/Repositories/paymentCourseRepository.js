const {
  userCourse,
  userCoursePayment,
  course,
  courseCategory,
  courseChapter,
  chapterModule,
  user,
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
      attributes: ['uuid', 'expiredAt', 'is_paid', 'payment_method'],
    });
  },

  async paymentCourse(paymentUuid, payload) {
    const payment = await userCoursePayment.update(payload, {
      where: {
        uuid: paymentUuid,
      },
    });
    return payment;
  },

  async getPaymentById(paymentUuid) {
    return userCoursePayment.findByPk(paymentUuid);
  },

  async getPaymentByUserCourse(userCourseUuid) {
    return userCoursePayment.findOne({
      where: {
        user_course_uuid: userCourseUuid,
      },
    });
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
            attributes: ['image', 'name', 'author', 'level', 'rating'],
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

      const courseUuids = userCourses.map((courseItem) => courseItem.uuid);

      const payments = await userCoursePayment.findAll({
        where: {
          user_course_uuid: courseUuids,
        },
        include: [
          {
            model: userCourse,
            include: [
              {
                model: course,
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
              {
                model: user,
                attributes: ['name'],
              },
            ],
          },
        ],
      });

      // eslint-disable-next-line max-len
      const totalModule = userCourses.reduce((total, courseItem) => total + courseItem.course.courseChapters.length, 0);

      const totalMinute = userCourses.reduce(
        // eslint-disable-next-line max-len
        (total, courseItem) => total + courseItem.course.courseChapters.reduce((sum, chapter) => sum + chapter.duration, 0),
        0,
      );

      const formattedOutput = payments.map((payment) => ({
        image: payment.userCourse.course.image,
        courseCategory: payment.userCourse.course.courseCategory.name,
        courseName: payment.userCourse.course.name,
        courseAuthor: payment.userCourse.course.author,
        courseLevel: payment.userCourse.course.level,
        totalModules: totalModule,
        totalMinutes: totalMinute,
        courseRating: payment.userCourse.course.rating,
        is_paid: payment.is_paid,
      }));

      return formattedOutput;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      } else {
        errorHandling.internalError(error);
      }
    }
  },
};
