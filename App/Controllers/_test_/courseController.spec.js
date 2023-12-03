const courseController = require('../courseController');

describe('courseController', () => {
  describe('#getAllCourses', () => {
    it('should return code 200 and message Success', () => {
      const mockRequest = {};
      const mockResponse = {
        status: 'OK',
        code: 200,
        message: 'Success',
        data: [],
      };

      courseController.getAllCourses(mockRequest, mockResponse);

      expect(mockResponse.code).toHaveBeenCalledWith(200);
      expect(mockResponse.message).toHaveBeenCalledWith('Success');
      expect(mockResponse.data).toHaveBeenCalledWith([]);
    });
  });

  describe('#getCourseById', () => {
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

      courseController.getCourseById(mockRequest, mockResponse);

      expect(mockResponse.code).toHaveBeenCalledWith(200);
      expect(mockResponse.message).toHaveBeenCalledWith('Success');
      expect(mockResponse.data).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
