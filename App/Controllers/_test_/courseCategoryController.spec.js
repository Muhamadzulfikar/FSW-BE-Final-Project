const courseCategoryRepository = require('../../Repositories/courseCategoryRepository');
const courseCategoryController = require('../courseCategoryController');

describe('getAllCourseCategories', () => {
  it('should return all course categories', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const expected = [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
    ];

    courseCategoryRepository.getAllCourseCategories = jest.fn().mockResolvedValue(expected);

    await courseCategoryController.getAllCourseCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Ok',
      code: 200,
      message: 'Success',
      data: expected,
    });
  });

  it('should return error when error occured', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    courseCategoryRepository.getAllCourseCategories = jest.fn().mockRejectedValue(new Error('Error'));

    await courseCategoryController.getAllCourseCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'Internal Server Error',
      code: 500,
      message: 'Error',
    });
  });
});
