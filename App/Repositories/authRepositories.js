const { user } = require('../models');

module.exports = {
  findUser(emailUser) {
    return user.findOne({ where: { email: emailUser } });
  },

  findUserByPhone(phoneNumber) {
    return user.findOne({ where: { phone: phoneNumber } });
  },

  findUserById(id) {
    return user.findByPk(id);
  },

  userRegister(body) {
    return user.create(body);
  },
};
