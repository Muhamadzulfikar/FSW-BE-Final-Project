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
    const req = { params: { id: 1 } };
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
