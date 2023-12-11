'use strict';

const { randomUUID } = require('crypto');

const mockUserCourse = [
  {
    uuid: randomUUID(),
    user_uuid: '3156c172-38e2-49ae-afae-5138d764d2ce',
    course_uuid: 'ecf4d6c9-996f-405a-9863-492c35b6d791',
    is_onboarding: true,
  },
];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('user_courses', mockUserCourse, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('user_courses', null, {});
  },
};
