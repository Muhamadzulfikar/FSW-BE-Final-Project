const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
      token,
    };

    return responseData;
  },

  async userRegister(body) {
    const { password } = body;
    const bodyRequest = body;
    const encrypt = await this.encryptPassword(password);
    bodyRequest.password = encrypt;
    const register = authRepositories.userRegister(body);

    return register;
  },

  // eslint-disable-next-line consistent-return
  findUser(body) {
    try {
      const { email } = body;
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
    const user = id && authRepositories.findUserById(id);

    return user;
  },
};
