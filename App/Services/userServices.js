const userRepository = require('../Repositories/userRepository');
// const { ValidationError, DatabaseError } = require('sequelize');
const errorHandling = require('../Error/errorHandling');

module.exports = {
  async changePasswordUser(userUuid) {
    try {
      const courses = await userRepository.changePasswordUserDetail(userUuid);
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async updatePasswordUser(userUuid, oldPassword, newPassword) {
    try {
      // eslint-disable-next-line max-len
      const courses = await userRepository.updatePasswordUserDetail(userUuid, oldPassword, newPassword);
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },
};
