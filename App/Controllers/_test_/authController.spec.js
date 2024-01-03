const authController = require('../authController');
const authService = require('../../Services/authService');

describe('authController', () => {
  describe('userLogin', () => {
    it('should call authService.login and return a response', async () => {
      const req = {}; // Add your request object here
      const res = {}; // Add your response object here

      // Mock the authService.login function
      authService.login = jest.fn().mockResolvedValue({});

      await authController.userLogin(req, res);

      expect(authService.login).toHaveBeenCalled();
      // Add your assertions for the response here
    });
  });

  describe('userRegister', () => {
    it('should call authService.register and return a response', async () => {
      const req = {}; // Add your request object here
      const res = {}; // Add your response object here

      // Mock the authService.register function
      authService.register = jest.fn().mockResolvedValue({});

      await authController.userRegister(req, res);

      expect(authService.register).toHaveBeenCalled();
      // Add your assertions for the response here
    });
  });

  // Add tests for other controller methods here
});
