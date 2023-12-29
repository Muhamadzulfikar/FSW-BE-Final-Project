const { ValidationError, DatabaseError } = require('sequelize');
const userRepository = require('../Repositories/userRepository');
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
      const courses = await userRepository.updatePasswordUserDetail(userUuid, oldPassword, newPassword);
      return courses;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },

  async updateProfileUser(userUuid, payload) {
    try {
      const profile = await userRepository.updateProfileUser(userUuid, payload);
      return profile;
    } catch (error) {
      if (error instanceof ValidationError) {
        errorHandling.badRequest(error.message);
      }
      if (error instanceof DatabaseError) {
        errorHandling.badRequest(error.message);
      }
      errorHandling.internalError(error);
    }
  },
};
