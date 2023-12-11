'use strict';

const { randomUUID } = require('crypto');

const mockUserCoursePayments = [
  {
    id: 1,
    uuid: randomUUID(),
    user_course_uuid: '87e21882-579b-4f44-ba1c-8ac8c4c7f8b2',
    payment_method: 'credit card',
    is_paid: true,
  },
];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('user_course_payments', mockUserCoursePayments, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_course_payments', null, {});
  },
};
