const { ValidationError, ForeignKeyConstraintError } = require('sequelize');
const paymentCourseRepository = require('../Repositories/paymentCourseRepository');
const errorHandling = require('../Error/errorHandling');

module.exports = {
  async enrollCourse(userUuid, courseUuid) {
    try {
      const enrollCourse = await paymentCourseRepository.enrollCoursePremium(userUuid, courseUuid);
      const invoice = await paymentCourseRepository.InvoicePayment(enrollCourse);
      const { course } = invoice.userCourse;
      const tax = course.price * 0.1;
      const total = course.price + tax;

      const d = new Date(invoice.expiredAt);
      const date = d.getDate();
      const month = d.getMonth();
      const hours = d.getHours();
      const minutes = d.getMinutes();

      const expired = `${date} ${month} ${d.getFullYear()} ${hours}:${minutes}`;

      const responseData = {
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
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      if (error instanceof ForeignKeyConstraintError) {
        return error;
      }
      errorHandling.internalError(error);
    }
  },

  // eslint-disable-next-line consistent-return
  async paymentCourseUser(userCourseUuid) {
    try {
      const courses = await paymentCourseRepository.paymentCourseUser(userCourseUuid);
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async paymentCourseDone(userCourseUuid, dataPayment) {
    try {
      const course = await paymentCourseRepository.paymentCourseUser(userCourseUuid, dataPayment);
      return course;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async paymentHistoryUser(userUuid) {
    try {
      const course = await paymentCourseRepository.paymentHistoryDetailNew(userUuid);
      return course;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },
};
