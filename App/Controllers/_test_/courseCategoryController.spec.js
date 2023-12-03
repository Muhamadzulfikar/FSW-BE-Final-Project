const courseCategoryController = require('../courseCategoryController');

describe('courseCategoryController', () => {
  describe('#getAllCourseCategory', () => {
    it('should return code 200 and message Success', () => {
      const mockRequest = {};
      const mockResponse = {
        status: 'OK',
        code: 200,
        message: 'Success',
        data: [],
      };

      courseCategoryController.getAllCourseCategory(mockRequest, mockResponse);

      expect(mockResponse.code).toHaveBeenCalledWith(200);
      expect(mockResponse.message).toHaveBeenCalledWith('Success');
      expect(mockResponse.data).toHaveBeenCalledWith([]);
    });
  });

  describe('#getCourseCategoryById', () => {
    it('should return code 200 and message Success', () => {
      const mockRequest = { params: 1 };
      const mockResponse = {
        status: 'OK',
        code: 200,
        message: 'Success',
        data: {
          id: 1,
        },
      };

      courseCategoryController.getCourseCategoryById(mockRequest, mockResponse);

      expect(mockResponse.code).toHaveBeenCalledWith(200);
      expect(mockResponse.message).toHaveBeenCalledWith('Success');
      expect(mockResponse.data).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
