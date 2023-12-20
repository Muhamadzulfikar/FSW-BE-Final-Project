const bcrypt = require('bcryptjs');
const { ValidationError } = require('sequelize');
const errorHandling = require('../Error/errorHandling');
const {
  user,
} = require('../models');

module.exports = {
  changePasswordUserDetail() {
    return user.update();
  },

  async updatePasswordUserDetail(userUuid, oldPassword, newPassword) {
    try {
      const userRecord = await user.findOne({
        where: {
          uuid: userUuid,
        },
        attributes: ['password'],
      });

      const hashedPassword = userRecord.password;

      const isPasswordMatch = await bcrypt.compare(oldPassword, hashedPassword);

      if (!isPasswordMatch) {
        throw new Error('Invalid password old password');
      }
      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      await user.update(
        { password: newHashedPassword },
        {
          where: {
            uuid: userUuid,
          },
        },
      );

      return newHashedPassword;
    } catch (error) {
      if (error instanceof ValidationError) {
        // Handle validation errors
        errorHandling.badRequest(error.errors[0].message);
      } else {
        // Handle other errors
        errorHandling.internalError(error);
      }
    }
  },
};
