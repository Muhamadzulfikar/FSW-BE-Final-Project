const { v4: uuidv4 } = require('uuid');
const authService = require('../Services/authService');
const responseError = require('../Error/responseError');

module.exports = {
  async userLogin(req, res) {
    try {
      const { body, user } = req;
      const login = await authService.userLogin(body.password, user);
      res.status(200).json(login);
    } catch (error) {
      responseError(res, error);
    }
  },

  async userRegister(req, res) {
    try {
      req.body.uuid = uuidv4();
      if (req.user) {
        req.body.role = 'admin';
      }
      const register = await authService.userRegister(req.body);
      res.status(201).json(register);
    } catch (error) {
      responseError(res, error);
    }
  },

  async validateOtp(req, res) {
    try {
      const { otp } = req.body;
      const validate = await authService.validateOtp(otp, req.user);
      res.status(201).json({
        status: 'Ok',
        message: validate,
        data: {},
      });
    } catch (error) {
      responseError(res, error);
    }
  },
};
