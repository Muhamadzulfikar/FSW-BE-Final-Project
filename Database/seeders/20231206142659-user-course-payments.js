'use strict';

const { faker } = require('@faker-js/faker');
const { userCourse } = require('../../App/models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const coursePayments = [];

    // Retrieve user courses
    const userCourses = await userCourse.findAll();

    // Check if there are any user courses
    if (userCourses.length === 0) {
      return;
    }

    // Generate course payment data
    // eslint-disable-next-line no-shadow
    userCourses.forEach((userCourse) => {
      coursePayments.push({
        uuid: faker.string.uuid(),
        user_course_uuid: userCourse.uuid,
        payment_method: 'credit card',
        is_paid: true,
        expiredAt: new Date(),
      });
    });

    // Insert course payments into the 'user_course_payments' table
    await queryInterface.bulkInsert('user_course_payments', coursePayments, {});
  },

  async down(queryInterface) {
    // Delete all records from the 'user_course_payments' table
    await queryInterface.bulkDelete('user_course_payments', null, {});
  },
};
