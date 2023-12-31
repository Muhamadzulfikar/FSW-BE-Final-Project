const { Op } = require('sequelize');
const { user, otpUser } = require('../models');

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

  storeOtp(userUuid, otpGenerated) {
    return otpUser.create({ user_uuid: userUuid, otp_code: otpGenerated });
  },

  validateOtp(otp, userUuid) {
    return otpUser.findOne({
      where: {
        otp_code: otp,
        user_uuid: userUuid,
        expiredAt: {
          [Op.gt]: new Date(),
        },
      },
    });
  },

  resetPassword(userUuid, newPassword) {
    return user.update({ password: newPassword }, { where: { uuid: userUuid } });
  },

  validateUser(userUuid) {
    return user.update({ is_verify: true }, { where: { uuid: userUuid } });
  },

  getOtp(userUuid) {
    return otpUser.findOne({
      where: {
        user_uuid: userUuid,
      },
    });
  },

  deleteUser(userUuid) {
    return user.destroy({
      where: {
        uuid: userUuid,
      },
    });
  },
};
