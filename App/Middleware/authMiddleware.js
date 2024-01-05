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
        errorHandling.badRequest('Nama tidak boleh kosong');
      }
      if (!email) {
        errorHandling.badRequest('Email tidak boleh kosong');
      }
      if (!password) {
        errorHandling.badRequest('Password tidak boleh kosong');
      }
      if (!phone) {
        errorHandling.badRequest('Nomor handphone tidak boleh kosong');
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
        errorHandling.unauthorized('Email atau nomor handpone tidak boleh kosong');
      }
      if (!password || password === '') {
        errorHandling.unauthorized('Password tidak boleh kosong');
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async isUserHasNotRegister(req, res, next) {
    try {
      const user = await authService.findUser(req.body.email);
      const otpUser = user && await authService.getOtp(user.uuid);

      if (user) {
        if (user.is_verify) errorHandling.forbidden('User sudah terverifikasi di sistem, silahkan login');
        if (otpUser && otpUser.expiredAt > new Date()) {
          const token = await authService.createTokenRegister({ id: user.uuid });
          return res.status(200).json(
            {
              status: 'OK',
              code: 200,
              message: 'Kamu sudah register silahkan validasi otp',
              data: token,
            },
          );
          // eslint-disable-next-line no-else-return
        } else {
          await authService.deleteUser(user.uuid);
        }
      }

      next();
    } catch (error) {
      if (error.code) {
        responseError(res, error);
      } else {
        res.status(500).json(error.message);
      }
    }
  },

  async isUserHasRegister(req, res, next) {
    try {
      if (!req.body.email) errorHandling.badRequest('Email tidak boleh kosong');
      const user = await authService.findUser(req.body.email);
      if (!user) errorHandling.notFound('User tidak ditemukan');
      if (!user.is_verify) errorHandling.forbidden('User ini tidak terverifikasi');
      req.user = user;
      next();
    } catch (error) {
      responseError(res, error);
    }
  },

  async authorize(req, res, next) {
    try {
      const user = await authService.authorize(req.headers.authorization);
      if (!user) {
        errorHandling.notFound('User tidak ditemukan');
      }

      if (!user.isVerify) errorHandling.unauthorized('user tidak terverifikasi');
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

  async authorizeRegister(req, res, next) {
    try {
      const user = await authService.authorize(req.headers.authorization);
      if (!user) {
        errorHandling.notFound('User tidak ditemukan');
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
        errorHandling.forbidden(`${user.name} bukan super admin`);
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
        errorHandling.forbidden(`${user.name} bukan admin atau super admin`);
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
        errorHandling.unauthorized('User ini bukan admin');
      }
      next();
    } catch (error) {
      responseError(res, error);
    }
  },
};
