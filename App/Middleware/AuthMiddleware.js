const AuthService = require('../Services/AuthService');
const ErrorHandling = require('../Error/ErrorHandling');
const responseError = require('../Error/responseError');

module.exports = {
  validateBodyRequest(req, res, next) {
    try {
      const {
        name, email, password, phone,
      } = req.body;
      if (!name) {
        ErrorHandling.unauthorized('Name must not be empty');
      }
      if (!email) {
        ErrorHandling.unauthorized('Email must not be empty');
      }
      if (!password) {
        ErrorHandling.unauthorized('Password must not be empty');
      }
      if (!phone) {
        ErrorHandling.unauthorized('Phone number must not be empty');
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  validateBodyLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || email === '') {
        ErrorHandling.unauthorized('Email must not be empty');
      }
      if (!password || password === '') {
        ErrorHandling.unauthorized('Password must not be empty');
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isUserHasNotRegister(req, res, next) {
    try {
      const user = await AuthService.findUser(req.body);
      if (user) {
        ErrorHandling.unauthorized('User Has Already Exists');
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isUserHasRegister(req, res, next) {
    try {
      const user = await AuthService.findUser(req.body);
      if (!user) {
        ErrorHandling.unauthorized('Cannot Find User');
      }
      req.user = user;
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async authorize(req, res, next) {
    try {
      const user = await AuthService.authorize(req.headers.authorization);
      if (!user) {
        ErrorHandling.unauthorized('User Not Found');
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.code) {
        responseError(res, error);
      } else {
        res.status('401').json({
          code: '403',
          status: 'Unauthorize',
          message: error.message,
        });
      }
    }
  },

  async isSuperAdmin(req, res, next) {
    try {
      const { user } = req;
      if (user.role !== 'super admin') {
        ErrorHandling.forbidden(`${user.name} Is Not Super Admin`);
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isSuperAdminAndAdmin(req, res, next) {
    try {
      const { user } = req;
      if (user.role !== 'super admin' || user.role !== 'admin') {
        ErrorHandling.forbidden(`${user.name} Is Not Super Admin`);
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },
};
