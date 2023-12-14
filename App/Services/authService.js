const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomInt } = require('crypto');
const { ValidationError } = require('sequelize');
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

  // eslint-disable-next-line consistent-return
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

      const token = this.createTokenRegister({ id: register.uuid });

      return token;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.errors[0].message);
      }
      errorHandling.badRequest(error);
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
    const { userUuid } = user;
    const validate = await authRepositories.validateOtp(otp, userUuid);

    if (!validate) {
      errorHandling.badRequest('OTP is not valid');
    }

    return `${user.name} Successfully register`;
  },

  // eslint-disable-next-line consistent-return
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
    const token = bearerToken.split('Bearer ')[1];
    const { id } = token && (await this.validateToken(token));
    const user = id && await authRepositories.findUserById(id);

    const response = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      city: user.city,
    };
    
    const response = {
      userUuid: user.uuid,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      city: user.city,
    };
    
    return response;
  },
};
