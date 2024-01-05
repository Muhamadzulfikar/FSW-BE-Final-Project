const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomInt } = require('crypto');
const { ValidationError, DatabaseError } = require('sequelize');
const { createTransport } = require('nodemailer');
const authRepositories = require('../Repositories/authRepositories');
const errorHandling = require('../Error/errorHandling');
const otpTemplate = require('./email/otpTemplate');
require('dotenv').config();

module.exports = {
  async userLogin(password, user) {
    const encryptedPassword = user.password;
    const isPassword = await bcrypt.compare(password, encryptedPassword);

    if (!isPassword) {
      errorHandling.unauthorized('Password not match');
    }

    const token = await this.createToken({ id: user.uuid });
    const responseData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      city: user.city,
      token,
    };

    return responseData;
  },

  async userRegister(body) {
    try {
      const { password } = body;
      const bodyRequest = body;
      const otp = randomInt(100_000, 999_999);

      const encrypt = await this.encryptPassword(password);
      bodyRequest.password = encrypt;
      const register = await authRepositories.userRegister(body);

      authRepositories.storeOtp(register.uuid, otp);
      this.sendMail(register, otp);

      const token = await this.createTokenRegister({ id: register.uuid });

      const responseData = {
        name: register.name,
        email: register.email,
        phone: register.phone,
        country: register.country,
        city: register.city,
        token,
      };

      return responseData;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      errorHandling.badRequest(error);
    }
  },

  async forgetPassword(user) {
    try {
      const token = await this.createTokenRegister({ id: user.uuid });
      const client = createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      client.sendMail({
        from: 'Skill Hub <noreply@gmail.com>',
        to: user.email,
        subject: 'Reset Password',
        html: `https://fsw-fe-backup.vercel.app/reset-password/${token}`,
      });
    } catch (error) {
      errorHandling.internalError(error);
    }
  },

  async resetPassword(jwtToken, newPassword) {
    try {
      const { id } = await this.validateToken(jwtToken);
      const encrypt = await this.encryptPassword(newPassword);
      await authRepositories.resetPassword(id, encrypt);
    } catch (error) {
      errorHandling.internalError(error);
    }
  },

  async sendMail(user, otpGenerated) {
    const client = createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    client.sendMail({
      from: 'Skill Hub <noreply@gmail.com>',
      to: user.email,
      subject: 'OTP Verification',
      html: otpTemplate(user.name, otpGenerated),
    });
  },

  async validateOtp(otp, user) {
    try {
      if (!otp) errorHandling.badRequest('OTP must not be empty');
      const { userUuid } = user;
      const validate = await authRepositories.validateOtp(otp, userUuid);
      authRepositories.validateUser(userUuid);

      if (!validate) {
        errorHandling.badRequest('OTP is not valid');
      }

      return `${user.name} Successfully register`;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  findUser(email) {
    try {
      if (!email.includes('@')) {
        const phoneNumber = email;
        return authRepositories.findUserByPhone(phoneNumber);
      }
      return authRepositories.findUser(email);
    } catch (error) {
      errorHandling.internalError(error);
    }
  },

  async encryptPassword(password) {
    const encryptedPassword = bcrypt.hash(password, 10);

    return encryptedPassword;
  },

  async validateToken(token) {
    const jwtSignatureKey = process.env.JWT_SIGNATURE_KEY;
    const validate = jwt.verify(token, jwtSignatureKey);

    return validate;
  },

  async createToken(payload) {
    const jwtSignatureKey = process.env.JWT_SIGNATURE_KEY;
    const createToken = jwt.sign(payload, jwtSignatureKey, { expiresIn: '1d' });
    return createToken;
  },

  async createTokenRegister(payload) {
    const jwtSignatureKey = process.env.JWT_SIGNATURE_KEY;
    const createToken = jwt.sign(payload, jwtSignatureKey, { expiresIn: '3m' });
    return createToken;
  },

  async authorize(bearerToken) {
    if (!bearerToken) {
      errorHandling.unauthorized('Token must be not empty');
    }

    if (bearerToken.split('Bearer ').length !== 2) {
      errorHandling.unauthorized('Token must be required');
    }

    const token = bearerToken.split('Bearer ')[1];
    const { id } = token && (await this.validateToken(token));
    const user = id && await authRepositories.findUserById(id);

    const response = {
      userUuid: user.uuid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      city: user.city,
      role: user.role,
      isVerify: user.is_verify,
    };

    return response;
  },

  async validateJwt(bearerToken) {
    let response;
    try {
      if (!bearerToken) {
        errorHandling.unauthorized('Token must be not empty');
      }
      const token = bearerToken.split('Bearer ')[1];
      const { id, exp } = await this.validateToken(token);
      await authRepositories.findUserById(id);

      const expiredAt = new Date(exp * 1000);

      response = {
        expiredAt,
      };
    } catch (error) {
      errorHandling.unauthorized(error);
    }

    return response;
  },

  async getOtp(userUuid) {
    try {
      const otp = await authRepositories.getOtp(userUuid);
      return otp;
    } catch (error) {
      if (error instanceof DatabaseError) {
        errorHandling.badRequest('Format user uuid tidak sesuai');
      } else {
        errorHandling.internalError(error);
      }
    }
  },

  async deleteUser(userUuid) {
    try {
      return await authRepositories.deleteUser(userUuid);
    } catch (error) {
      errorHandling.internalError(error);
    }
  },
};
