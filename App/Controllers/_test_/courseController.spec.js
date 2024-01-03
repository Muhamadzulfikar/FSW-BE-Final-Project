const courseService = require('../../Services/courseService');
const courseController = require('../courseController');

describe('#getAllCourses', () => {
  it('should return all courses when no categoryIds and levels are provided', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCourses = [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }];
    courseService.getAllListCourses = jest.fn().mockResolvedValue(expectedCourses);

    await courseController.getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedCourses,
    });
  });

  it('should return filtered courses when categoryIds and levels are provided', async () => {
    const req = { categoryIds: [1, 2], levels: [1, 2] };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCourses = [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }];
    courseService.filterCourseByCategoryAndLevel = jest.fn().mockResolvedValue(expectedCourses);

    await courseController.getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedCourses,
    });
  });

  it('should return filtered courses when only categoryIds are provided', async () => {
    const req = { categoryIds: [1, 2] };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCourses = [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }];
    courseService.filterCourseByCategory = jest.fn().mockResolvedValue(expectedCourses);

    await courseController.getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedCourses,
    });
  });

  it('should return filtered courses when only levels are provided', async () => {
    const req = { levels: ['beginner', 'intermediate'] };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCourses = [{ id: 1, name: 'Course 1' }, { id: 2, name: 'Course 2' }];
    courseService.filterCourseByLevel = jest.fn().mockResolvedValue(expectedCourses);

    await courseController.getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedCourses,
    });
  });

  it('should return an error response when an error occurs', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const error = new Error('An error occurred');
    error.code = 500;
    error.status = 'Internal Server Error';
    courseService.getAllListCourses = jest.fn().mockRejectedValue(error);

    await courseController.getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: 500,
      status: 'Internal Server Error',
      message: 'An error occurred',
    });
  });
});

describe('getCourseDetailById', () => {
  it('should return the course detail when a valid id is provided', async () => {
    const req = { params: { id: 1 }, user: { userUuid: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCourseDetail = { id: 1, name: 'Course 1', description: 'Description 1' };
    courseService.getCourseDetailById = jest.fn().mockResolvedValue(expectedCourseDetail);

    await courseController.getCourseDetailById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedCourseDetail,
    });
  });

  it('should return an error response when an error occurs', async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const error = new Error('An error occurred');
    error.code = 500;
    error.status = 'Internal Server Error';
    courseService.getCourseDetailById = jest.fn().mockRejectedValue(error);

    await courseController.getCourseDetailById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: 500,
      status: 'Internal Server Error',
      message: 'An error occurred',
    });
  });
});

describe('getCourseByIdAdmin', () => {
  it('should return the course when a valid id is provided', async () => {
    const req = { params: { uuid: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCourse = { id: 1, name: 'Course 1' };
    courseService.getCourseByIdAdmin = jest.fn().mockResolvedValue(expectedCourse);

    await courseController.getCourseByIdAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedCourse,
    });
  });
});

describe('getCourseStatistic', () => {
  it('should return the course statistic', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCourseStatistic = {
      activeClassItem: 1,
      activeUserItem: 2,
      premiumClassItem: 3,
    };
    courseService.getListCourseStatisticAdmin = jest.fn().mockResolvedValue(expectedCourseStatistic);

    await courseController.getCourseStatistic(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedCourseStatistic,
    });
  });
});

describe('getCourseAdmin', () => {
  it('should return the course admin', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCourseAdmin = [
      {
        buyAt: '2023-12-29T03:41:48.581Z',
        courseCategory: 'UI/UX Design',
        courseName: 'Intro to Basic of User Interaction Design',
        is_paid: true,
        paymentMethod: 'credit card',
        user: 'Terry Jones',
      },
    ];
    courseService.getListCourseAdmin = jest.fn().mockResolvedValue(expectedCourseAdmin);

    await courseController.getCourseAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedCourseAdmin,
    });
  });
});

describe('getManagementCourse', () => {
  it('should return the management course', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedManagementCourse = [
      {
        buyAt: '2023-12-29T03:41:48.581Z',
        courseCategory: 'UI/UX Design',
        courseName: 'Intro to Basic of User Interaction Design',
        is_paid: true,
        paymentMethod: 'credit card',
        user: 'Terry Jones',
      },
    ];
    courseService.getListCourseManagement = jest.fn().mockResolvedValue(expectedManagementCourse);

    await courseController.getManagementCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedManagementCourse,
    });
  });
});

describe('createCourse', () => {
  it('should return the created course', async () => {
    const req = {
      body: {
        name: 'Course 1',
        description: 'Description 1',
        level: 'beginner',
        categoryId: 1,
        price: 100,
        discount: 0,
        status: 'active',
        imageUrl: 'image-url',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCreatedCourse = {
      id: 1,
      name: 'Course 1',
      description: 'Description 1',
      level: 'beginner',
      categoryId: 1,
      price: 100,
      discount: 0,
      status: 'active',
      imageUrl: 'image-url',
    };
    courseService.createCourseAdmin = jest.fn().mockResolvedValue(expectedCreatedCourse);

    await courseController.createCourseAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 201,
      message: 'Success',
      data: expectedCreatedCourse,
    });
  });
});

describe('updateCourse', () => {
  it('should return the updated course', async () => {
    const req = {
      params: { courseUuid: 1 },
      body: {
        name: 'Course 1',
        description: 'Description 1',
        level: 'beginner',
        categoryId: 1,
        price: 100,
        discount: 0,
        status: 'active',
        imageUrl: 'image-url',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedUpdatedCourse = {
      courseUuid: 1,
      name: 'Course 1',
      description: 'Description 1',
      level: 'beginner',
      categoryId: 1,
      price: 100,
      discount: 0,
      status: 'active',
      imageUrl: 'image-url',
    };
    courseService.updateCourseAdmin = jest.fn().mockResolvedValue(expectedUpdatedCourse);

    await courseController.updateCourseAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Success',
      data: expectedUpdatedCourse,
    });
  });
});

describe('deleteCourse', () => {
  it('should return the deleted course', async () => {
    const req = { params: { courseUuid: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedDeletedCourse = true;
    courseService.deleteCourseAdmin = jest.fn().mockResolvedValue(expectedDeletedCourse);

    await courseController.deleteCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 201,
      message: 'Successfully Delete Data',
      data: expectedDeletedCourse,
    });
  });
});

describe('isOnboarding', () => {
  it('should return the onboarding status', async () => {
    const req = { user: { userUuid: 1 }, params: { courseUuid: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedOnboardingStatus = true;
    courseService.isOnboarding = jest.fn().mockResolvedValue(expectedOnboardingStatus);

    await courseController.isOnboarding(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'created',
      code: 201,
      message: 'Successfully Completed Onboarding',
      data: expectedOnboardingStatus,
    });
  });
});

describe('completingModule', () => {
  it('should return the completed module', async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedCompletedModule = true;
    courseService.completingModule = jest.fn().mockResolvedValue(expectedCompletedModule);

    await courseController.completingModule(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'created',
      code: 201,
      message: 'Successfully Completing Module',
      data: expectedCompletedModule,
    });
  });
});

describe('getVideoCourse', () => {
  it('should return the video course', async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expectedVideoCourse = [
      {
        id: 1,
        title: 'Video 1',
        videoUrl: 'video-url',
        duration: 100,
        moduleId: 1,
        courseId: 1,
      },
    ];
    courseService.getVideoCourse = jest.fn().mockResolvedValue(expectedVideoCourse);

    await courseController.getVideoCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      code: 200,
      message: 'Successfully get Video',
      data: expectedVideoCourse,
    });
  });
});
