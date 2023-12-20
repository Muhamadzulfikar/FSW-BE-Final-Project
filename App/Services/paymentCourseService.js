const { DatabaseError, ForeignKeyConstraintError } = require('sequelize');
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
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        errorHandling.badRequest('Course Uuid not found');
      }
      errorHandling.internalError(error);
    }
  },

  async paymentCourse(paymentUuid, paymentMethod) {
    try {
      const payload = {
        payment_method: paymentMethod,
        is_paid: true,
      };

      await paymentCourseRepository.paymentCourse(paymentUuid, payload);
      const invoice = await paymentCourseRepository.InvoicePayment(paymentUuid);
      const { course } = invoice.userCourse;
      const tax = course.price * 0.1;
      const total = course.price + tax;

      const responseData = {
        paymentUuid: invoice.uuid,
        image: course.image,
        type: course.courseCategory.name,
        name: course.name,
        author: course.author,
        total,
        paid: invoice.is_paid,
        paymentMethod: invoice.payment_method,
      };

      return responseData;
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
};
