const { DatabaseError, ForeignKeyConstraintError } = require('sequelize');
const paymentCourseRepository = require('../Repositories/paymentCourseRepository');
const errorHandling = require('../Error/errorHandling');
const courseRepository = require('../Repositories/courseRepository');
const userNotificationRepository = require('../Repositories/userNotificationRepository');

module.exports = {
  invoiceResponse(invoice) {
    const { course } = invoice.userCourse;
    const tax = course.price * 0.1;
    const total = course.price + tax;

    const d = new Date(invoice.expiredAt);
    const expired = `${d.getDate()} ${d.getMonth()} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;

    const responseData = {
      paymentUuid: invoice.uuid,
      image: course.image,
      type: course.courseCategory.name,
      name: course.name,
      author: course.author,
      price: course.price,
      tax,
      total,
      paid: invoice.is_paid,
      expired,
    };

    return responseData;
  },

  async enrollCourse(userUuid, courseUuid) {
    try {
      const courses = await courseRepository.getChapterModuleByCourse(courseUuid);
      const { isPremium } = courses[0].course;
      const chapterModuleUuid = courses.flatMap((course) => course.chapterModules.map((chapterModule) => chapterModule.uuid));

      const enrollCourse = isPremium
        ? await paymentCourseRepository.enrollCoursePremium(userUuid, courseUuid, chapterModuleUuid)
        : await paymentCourseRepository.enrollCourseFree(userUuid, courseUuid, chapterModuleUuid);

      const invoice = await paymentCourseRepository.InvoicePayment(enrollCourse);

      return this.invoiceResponse(invoice);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) errorHandling.badRequest('Course Uuid not found');
      errorHandling.internalError(error);
    }
  },

  async invoicePayment(paymentUuid) {
    try {
      const invoice = await paymentCourseRepository.InvoicePayment(paymentUuid);

      return this.invoiceResponse(invoice);
    } catch (error) {
      if (error instanceof DatabaseError) errorHandling.badRequest(error.message);
      errorHandling.internalError(error);
    }
  },

  async paymentCourse(paymentUuid, paymentMethod, userUuid) {
    try {
      const payload = {
        payment_method: paymentMethod,
        is_paid: true,
      };

      const notification = {
        title: 'Payment Course',
        notification: 'Selamat anda telah berhasil melakukan pembayaran course',
        user_uuid: userUuid,
      };

      await paymentCourseRepository.paymentCourse(paymentUuid, payload);
      const invoice = await paymentCourseRepository.InvoicePayment(paymentUuid);
      await userNotificationRepository.createNotification(notification);

      return this.invoiceResponse(invoice);
    } catch (error) {
      errorHandling.internalError(error);
    }
  },

  async getPaymentById(paymentUuid) {
    try {
      const payment = await paymentCourseRepository.getPaymentById(paymentUuid);
      return payment;
    } catch (error) {
      if (error instanceof DatabaseError) {
        return errorHandling.badRequest('Payment uuid format is not valid');
      }
    }
  },

  async getPaymentByUserCourse(userCourseUuid) {
    try {
      const payment = await paymentCourseRepository.getPaymentByUserCourse(userCourseUuid);
      return payment;
    } catch (error) {
      if (error instanceof DatabaseError) {
        return errorHandling.badRequest('User course uuid format is not valid');
      }
      errorHandling.internalError(error);
    }
  },

  async paymentHistoryUser(userUuid) {
    try {
      const paymentHistories = await paymentCourseRepository.paymentHistory(userUuid);

      const responseData = paymentHistories.map((payment) => {
        const { course } = payment.userCourse;
        const {
          uuid, image, courseCategory, name, author, level, rating,
        } = course;
        const { courseChapters } = course;
        const totalModules = courseChapters.length;
        const totalMinutes = courseChapters.reduce((total, chapter) => total + chapter.duration, 0);

        return {
          courseUuid: uuid,
          paymentUuid: payment.uuid,
          userCourseUuid: payment.userCourse.uuid,
          image,
          courseCategory: courseCategory.name,
          courseName: name,
          courseAuthor: author,
          courseLevel: level,
          totalModules,
          totalMinutes,
          expiredAt: payment.expiredAt,
          courseRating: rating,
          is_paid: payment.is_paid,
        };
      });

      return responseData;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },
};
