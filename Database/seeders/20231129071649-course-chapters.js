'use strict';

const { faker } = require('@faker-js/faker');
const { course } = require('../../App/models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const data = [];
    const courses = await course.findAll();
    courses.forEach((Course) => {
      data.push({
        course_uuid: Course.uuid,
        chapter: `Chapter ${faker.number.int({ min: 1, max: 10 })}`,
        duration: faker.number.int({ min: 10, max: 60 }),
      });
    });

    await queryInterface.bulkInsert('course_chapters', data, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('course_chapters', null, {});
  },
};
