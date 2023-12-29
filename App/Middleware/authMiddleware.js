const authService = require('../Services/authService');
const errorHandling = require('../Error/errorHandling');
const responseError = require('../Error/responseError');

module.exports = {
  validateBodyRequest(req, res, next) {
    try {
      const {
        name, email, password, phone,
      } = req.body;
      if (!name) {
        errorHandling.badRequest('Name must not be empty');
      }
      if (!email) {
        errorHandling.badRequest('Email must not be empty');
      }
      if (!password) {
        errorHandling.badRequest('Password must not be empty');
      }
      if (!phone) {
        errorHandling.badRequest('Phone number must not be empty');
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
        errorHandling.unauthorized('Email or phone must not be empty');
      }
      if (!password || password === '') {
        errorHandling.unauthorized('Password must not be empty');
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isUserHasNotRegister(req, res, next) {
    try {
      const user = await authService.findUser(req.body.email);
      if (user) {
        errorHandling.unauthorized('User Already Exists');
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isUserHasRegister(req, res, next) {
    try {
      if (!req.body.email) errorHandling.badRequest('Email must not be empty');
      const user = await authService.findUser(req.body.email);
      if (!user) {
        errorHandling.unauthorized('Cannot Find User');
      }
      req.user = user;
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async authorize(req, res, next) {
    try {
      console.log(req.body);
      const user = await authService.authorize(req.headers.authorization);
      if (!user) {
        errorHandling.unauthorized('User Not Found');
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.code) {
        responseError(res, error);
      } else {
        res.status(401).json({
          code: 401,
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
        errorHandling.forbidden(`${user.name} Is Not Super Admin`);
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isSuperAdminAndAdmin(req, res, next) {
    try {
      const { user } = req;
      if (user.role !== 'super admin' && user.role !== 'admin') {
        errorHandling.forbidden(`${user.name} Is Not Super Admin`);
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isLoginAdmin(req, res, next) {
    try {
      const { email } = req.body;
      const user = await authService.findUser(email);
      if (user.role !== 'admin' && user.role !== 'super admin') {
        errorHandling.unauthorized('User is not admin');
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },
};
