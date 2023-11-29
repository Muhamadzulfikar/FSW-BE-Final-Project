'use strict';

const { faker } = require('@faker-js/faker');
const { course } = require('../../App/models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const courseDetails = [];
    const classTargets = [];
    const courses = await course.findAll();
    for (let index = 0; index < 5; index += 1) {
      classTargets.push(faker.lorem.words());
    }
    courses.forEach((Course) => {
      courseDetails.push({
        course_uuid: Course.uuid,
        description: faker.lorem.paragraph(),
        class_target: classTargets,
        telegram: faker.internet.url(),
        onboarding: faker.lorem.paragraph(),
      });
    });

    await queryInterface.bulkInsert('course_details', courseDetails, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('course_details', null, {});
  },
};
