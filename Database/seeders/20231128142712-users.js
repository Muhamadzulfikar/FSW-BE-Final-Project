'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async encryptPassword(password) {
    const encryptedPassword = bcrypt.hash(password, 10);

    return encryptedPassword;
  },

  async up(queryInterface) {
    const data = [];
    const password = await this.encryptPassword('password');
    for (let index = 0; index < 5; index += 1) {
      data.push({
        uuid: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        phone: faker.phone.number('08##########'),
        country: faker.location.country(),
        city: faker.location.city(),
        role: 'user',
      });
    }
    await queryInterface.bulkInsert('users', data, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
