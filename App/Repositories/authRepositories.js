const { User } = require('../models/index');

module.exports = {
  findUser(emailUser) {
    return User.findOne({ where: { email: emailUser } });
  },

  findUserById(id) {
    return User.findByPk(id);
  },

  userRegister(body) {
    return User.create(body);
  },
};
