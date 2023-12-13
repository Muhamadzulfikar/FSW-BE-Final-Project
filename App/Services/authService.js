const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomInt } = require('crypto');
const { createTransport } = require('nodemailer');
const authRepositories = require('../Repositories/authRepositories');
const errorHandling = require('../Error/errorHandling');
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
      const encrypt = await this.encryptPassword(password);
      bodyRequest.password = encrypt;
      const register = await authRepositories.userRegister(body);

      return register;
    } catch (error) {
      errorHandling.unauthorized(error);
    }
  },

  sendOtp(emailUser) {
    try {
      const otp = randomInt(100_000, 999_999);
      this.sendMail(emailUser, otp);
    } catch (error) {
      errorHandling.internalError(error);
    }
  },

  async sendMail(emailUser, otpGenerated) {
    const client = createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await client.sendMail({
      from: 'Skill Hub <noreply@gmail.com>',
      to: emailUser,
      subject: 'OTP Verification',
      html: `<p>${otpGenerated}</p>`,
    });
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
    const createToken = jwt.sign(payload, jwtSignatureKey, { expiresIn: 1800 });
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

    return response;
  },
};
