const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthRepositories = require('../Repositories/AuthRepositories');
const ErrorHandling = require('../Error/ErrorHandling');

module.exports = {
  async userLogin(password, user) {
    const encryptedPassword = user.password;
    const isPassword = await bcrypt.compare(password, encryptedPassword);

    if (!isPassword) {
      ErrorHandling.unauthorized('Password not match');
    }

    const token = await this.createToken({ id: user.id });
    const userWithToken = { ...user.dataValues, token };

    return userWithToken;
  },

  async userRegister(body) {
    const { password } = body;
    const bodyRequest = body;
    const encrypt = await this.encryptPassword(password);
    bodyRequest.password = encrypt;
    const register = AuthRepositories.userRegister(body);

    return register;
  },

  findUser(body) {
    const { email } = body;
    return AuthRepositories.findUser(email);
  },

  async encryptPassword(password) {
    const salt = process.env.SALT;
    const encryptedPassword = bcrypt.hash(password, salt);

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
    if (bearerToken) {
      ErrorHandling.unauthorized('Token must be not empty');
    }
    const token = bearerToken.split('Bearer ')[1];
    const { id } = token && (await this.validateToken(token));
    const user = id && AuthRepositories.findUserById(id);

    return user;
  },
};
