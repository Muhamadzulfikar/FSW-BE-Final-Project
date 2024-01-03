const courseCategoryController = require('../courseCategoryController');
const courseCategoryRepository = require('../../Repositories/courseCategoryRepository');

describe('courseCategoryController', () => {
  describe('getAllCourseCategory', () => {
    it('should return all course categories', async () => {
      // Mock the courseCategoryRepository.getAllCourseCategories function
      const mockCourseCategories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ];
      courseCategoryRepository.getAllCourseCategories = jest.fn().mockResolvedValue(mockCourseCategories);

      // Mock the request and response objects
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      // Call the getAllCourseCategory function
      await courseCategoryController.getAllCourseCategory(req, res);

      // Verify the response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Ok',
        code: 200,
        message: 'Success',
        data: mockCourseCategories,
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
});
