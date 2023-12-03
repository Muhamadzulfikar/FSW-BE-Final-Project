'use strict';

const data = [
  {
    id: 1,
    name: 'UI/UX Design',
    image:
      'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180735/b4zuplewxgtb5yxvw1gx.png',
  },
  {
    id: 2,
    name: 'Product Management',
    image:
      'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180735/d0ue6yudey2xyzrbbx61.png',
  },
  {
    id: 3,
    name: 'Web Development',
    image:
      'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180736/z31pjtf5cypjesmhcj12.png',
  },
  {
    id: 4,
    name: 'Android Development',
    image:
      'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180734/qcqfqtgptwpmlgmztd0q.png',
  },
  {
    id: 5,
    name: 'IOS Development',
    image:
      'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180735/u2yzw0k8wadkeu17ueml.png',
  },
  {
    id: 6,
    name: 'Data Science',
    image:
      'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180734/nmy83rtsoqmobpkehekh.png',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('course_categories', data, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('course_categories', null, {});
  },
};
