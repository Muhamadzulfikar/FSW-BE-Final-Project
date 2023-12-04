const courseRepository = require('../../Repositories/courseRepository');
const errorHandling = require('../../Error/errorHandling');
const service = require('../courseService');

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

const expectedResponse = [
  {
    id: '1',
    category: 'Category 1',
    image: 'Image 1',
    name: 'Course 1',
    author: 'Author 1',
    price: 100,
    level: 'Beginner',
    rating: 4.5,
    isPremium: true,
    classCode: 'Code 1',
    totalModule: 2,
    totalMinute: 30,
  },
  {
    id: '2',
    category: 'Category 2',
    image: 'Image 2',
    name: 'Course 2',
    author: 'Author 2',
    price: 200,
    level: 'Intermediate',
    rating: 4.0,
    isPremium: false,
    classCode: 'Code 2',
    totalModule: 2,
    totalMinute: 70,
  },
];

describe('getAllListCourses', () => {
  it('should return all courses', async () => {
    courseRepository.getAllCourses = jest.fn().mockResolvedValue(expectedCourses);

    const response = await service.getAllListCourses();

    expect(response).toEqual(expectedResponse);
  });

  it('should return an error response when an error occurs', async () => {
    const error = new Error('An error occurred');
    error.code = 500;
    error.status = 'Internal Server Error';
    courseRepository.getAllCourses = jest.fn().mockRejectedValue(error);
    errorHandling.badRequest = jest.fn();

    await service.getAllListCourses();

    expect(errorHandling.badRequest).toHaveBeenCalledWith(error);
  });
});

describe('getCourseDetailById', () => {
  it('should return the course detail when a valid id is provided', async () => {
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
    courseRepository.getCourseById = jest.fn().mockResolvedValue(expectedCourse);
    const expectedDetailResponse = {
      id: '1',
      name: 'Course 1',
      image: 'Image 1',
      author: 'Author 1',
      price: 100,
      level: 'Beginner',
      rating: 4.5,
      totalModule: 2,
      totalMinute: 30,
      isPremium: true,
      courseCode: 'Code 1',
      category: 'Category 1',
      description: 'Description 1',
      classTarget: 'Class Target 1',
      telegram: 'Telegram 1',
      onboarding: 'Onboarding 1',
      courseModules: [
        {
          chapter: 'Chapter 1',
          estimation: 10,
          module: [
            { title: 'Module 1', courseLink: 'Course Link 1' },
            { title: 'Module 2', courseLink: 'Course Link 2' },
          ],
        },
        {
          chapter: 'Chapter 2',
          estimation: 20,
          module: [
            { title: 'Module 3', courseLink: 'Course Link 3' },
            { title: 'Module 4', courseLink: 'Course Link 4' },
          ],
        },
      ],
    };

    const response = await service.getCourseDetailById('1');

    expect(response).toEqual(expectedDetailResponse);
  });

  it('should return an error response when an error occurs', async () => {
    const error = new Error('An error occurred');
    error.code = 500;
    error.status = 'Internal Server Error';
    courseRepository.getCourseById = jest.fn().mockRejectedValue(error);
    errorHandling.badRequest = jest.fn();

    await service.getCourseDetailById('1');

    expect(errorHandling.badRequest).toHaveBeenCalledWith(error);
  });
});

describe('filterCourseByCategoryAndLevel', () => {
  it('should return filtered courses when categoryIds and levels are provided', async () => {
    courseRepository.CourseByCategoryAndLevel = jest.fn().mockResolvedValue(expectedCourses);

    const response = await service.filterCourseByCategoryAndLevel([1, 2], [1, 2]);

    expect(response).toEqual(expectedResponse);
  });

  it('should return an error response when an error occurs', async () => {
    const error = new Error('An error occurred');
    error.code = 500;
    error.status = 'Internal Server Error';
    courseRepository.CourseByCategoryAndLevel = jest.fn().mockRejectedValue(error);
    errorHandling.badRequest = jest.fn();

    await service.filterCourseByCategoryAndLevel([1, 2], [1, 2]);

    expect(errorHandling.badRequest).toHaveBeenCalledWith(error);
  });
});
