'use strict';

const { faker } = require('@faker-js/faker');
const { user, course } = require('../../App/models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const userCourseData = [];

    // Retrieve user and course data
    const users = await user.findAll();
    const courses = await course.findAll();

    // Check if there are any users or courses
    if (users.length === 0 || courses.length === 0) {
      return;
    }

    // Generate user course data
    // eslint-disable-next-line no-shadow
    users.forEach((user) => {
      // eslint-disable-next-line no-shadow
      courses.forEach((course) => {
        userCourseData.push({
          uuid: faker.string.uuid(),
          user_uuid: user.uuid,
          course_uuid: course.uuid,
          is_onboarding: true,
        });
      });
    });

    // Insert user courses into the 'user_courses' table
    await queryInterface.bulkInsert('user_courses', userCourseData, {});
  },

  async down(queryInterface) {
    // Delete all records from the 'user_courses' table
    await queryInterface.bulkDelete('user_courses', null, {});
  },
};
