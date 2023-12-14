'use strict';

const { faker } = require('@faker-js/faker');
const { courseChapter } = require('../../App/models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const chapterModules = [];
    const courseChapters = await courseChapter.findAll();
    courseChapters.forEach((CourseChapter) => {
      chapterModules.push({
        uuid: faker.string.uuid(),
        course_chapter_id: CourseChapter.id,
        title: faker.lorem.words(),
        course_link: 'https://www.youtube.com/embed/ixOd42SEUF0?si=_v0vQX45ze4C6Ws5',
      });
    });
    await queryInterface.bulkInsert('chapter_modules', chapterModules, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('chapter_modules', null, {});
  },
};
