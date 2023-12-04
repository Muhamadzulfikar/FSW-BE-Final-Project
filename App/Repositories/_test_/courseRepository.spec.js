const {
  course,
} = require('../../models');
const repository = require('../courseRepository');

describe('getAllCourses', () => {
  it('should return all courses', async () => {
    const expectedCourses = [
      {
        uuid: '1',
        courseCategory: { name: 'Category 1' },
        image: 'Image 1',
        name: 'Course 1',
        author: 'Author 1',
        price: 100,
        level: 'Beginner',
        rating: 4.5,
        is_premium: true,
        code: 'Code 1',
        courseChapters: [
          { duration: 10 },
          { duration: 20 },
        ],
      },
      {
        uuid: '2',
        courseCategory: { name: 'Category 2' },
        image: 'Image 2',
        name: 'Course 2',
        author: 'Author 2',
        price: 200,
        level: 'Intermediate',
        rating: 4.0,
        is_premium: false,
        code: 'Code 2',
        courseChapters: [
          { duration: 30 },
          { duration: 40 },
        ],
      },
    ];
    course.findAll = jest.fn().mockResolvedValue(expectedCourses);

    const response = await repository.getAllCourses();

    expect(response).toEqual(expectedCourses);
  });
});

describe('getCourseById', () => {
  it('should return a course by ID', async () => {
    const expectedCourse = {
      uuid: '1',
      name: 'Course 1',
      image: 'Image 1',
      author: 'Author 1',
      price: 100,
      level: 'Beginner',
      rating: 4.5,
      isPremium: true,
      code: 'Code 1',
      courseCategory: { name: 'Category 1' },
      courseDetail: {
        dataValues: {
          description: 'Description 1',
          class_target: 'Class Target 1',
          telegram: 'Telegram 1',
          onboarding: 'Onboarding 1',
        },
      },
      courseChapters: [
        {
          chapter: 'Chapter 1',
          duration: 10,
          chapterModules: [
            { title: 'Module 1', course_link: 'Course Link 1' },
            { title: 'Module 2', course_link: 'Course Link 2' },
          ],
        },
        {
          chapter: 'Chapter 2',
          duration: 20,
          chapterModules: [
            { title: 'Module 3', course_link: 'Course Link 3' },
            { title: 'Module 4', course_link: 'Course Link 4' },
          ],
        },
      ],
    };
    course.findByPk = jest.fn().mockResolvedValue(expectedCourse);

    const response = await repository.getCourseById('1');

    expect(response).toEqual(expectedCourse);
  });
});
