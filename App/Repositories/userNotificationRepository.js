const {
  userNotification,
} = require('../models');

module.exports = {
  async userNotificationDetail(userUuid) {
    return userNotification.findAll({
      where: {
        user_uuid: userUuid,
      },
      order: [
        ['createdAt', 'DESC'],
      ],
    });
  },

  createNotification(payload) {
    return userNotification.create(payload);
  },
};
