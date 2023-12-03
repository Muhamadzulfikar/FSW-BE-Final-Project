'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          uuid: '3156c172-38e2-49ae-afae-5138d764d2ce',
          name: 'John Doe',
          email: 'test@gmail.com',
          password:
            '$2b$10$6K5cZJrUfI2w6u1Qq2nQ6eQ3DZ5Y6rZQ8Qp9XbXv5wZaLqZ7kZcX.',
          phone: '081234567890',
          country: 'Indonesia',
          city: 'Jakarta',
          role: 'admin',
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
