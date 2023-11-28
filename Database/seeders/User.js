const { v4: uuidv4 } = require('uuid');

const d = new Date();
const date = d.getDate();
const month = d.getMonth();
const year = d.getFullYear();
const hours = d.getHours();
const minute = d.getMinutes();
const second = d.getSeconds();
const timeStamp = `${year}-${month}-${date}T${hours}:${minute}:${second}Z`;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: uuidv4(),
          name: 'Super admin',
          email: 'superadmin@binar.com',
          password:
            '$2a$10$sX/fcdIUp7TNZV6lxKkQ8elQHh/S.0EMomtlbmlABNJnmPUFDech6',
          phone: '082284134328',
          role: 'super admin',
          createdAt: timeStamp,
          updatedAt: timeStamp,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
