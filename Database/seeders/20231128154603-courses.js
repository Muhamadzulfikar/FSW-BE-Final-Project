'use strict';

const { randomUUID } = require('crypto');

const mockCourses = [
  {
    course_category_id: 1,
    uuid: randomUUID(),
    image: 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180735/b4zuplewxgtb5yxvw1gx.png',
    name: 'Intro to Basic of User Interaction Design',
    author: 'Simon Doe',
    price: 280000,
    level: 'intermediate',
    rating: '4.5',
    isPremium: false,
    code: 'UIUX0123',
  },
  {
    course_category_id: 3,
    uuid: randomUUID(),
    image: 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180736/z31pjtf5cypjesmhcj12.png',
    name: 'Frontend Web Development',
    author: 'John Susilo',
    price: 300000,
    level: 'beginner',
    rating: '4.2',
    isPremium: false,
    code: 'WD0123',
  },
  {
    course_category_id: 3,
    uuid: randomUUID(),
    image: 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180736/z31pjtf5cypjesmhcj12.png',
    name: 'Backend Web Development',
    author: 'John Susilo',
    price: 322000,
    level: 'intermediate',
    rating: '4.7',
    isPremium: true,
    code: 'WD0124',
  },
  {
    course_category_id: 4,
    uuid: randomUUID(),
    image: 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180734/qcqfqtgptwpmlgmztd0q.png',
    name: 'Android Development with Kotlin',
    author: 'Jane Doe',
    price: 280000,
    level: 'intermediate',
    rating: '4.5',
    isPremium: false,
    code: 'AND0123',
  },
  {
    course_category_id: 5,
    uuid: randomUUID(),
    image: 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180735/u2yzw0k8wadkeu17ueml.png',
    name: 'swiftUI Development',
    author: 'Samuel Wijaya',
    price: 270000,
    level: 'advanced',
    rating: '4.8',
    isPremium: true,
    code: 'IOS0123',
  },
  {
    course_category_id: 6,
    uuid: randomUUID(),
    image: 'https://res.cloudinary.com/dpg0tbbot/image/upload/v1701180734/nmy83rtsoqmobpkehekh.png',
    name: 'Data Science with Python',
    author: 'John Silaban',
    price: 350000,
    level: 'intermediate',
    rating: '4.5',
    isPremium: false,
    code: 'DS0123',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('courses', mockCourses, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('courses', null, {});
  },
};
