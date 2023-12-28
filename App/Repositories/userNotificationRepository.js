const {
  userNotification,
} = require('../models');

module.exports = {
  async userNotificationDetail() {
    return userNotification.findAll();
  },

  createNotification(payload) {
    return userNotification.create(payload);
  },
};
