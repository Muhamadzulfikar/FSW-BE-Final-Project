const {
  userNotification,
} = require('../models');

module.exports = {
  async userNotificationDetail() {
    return userNotification.findAll();
  },
};
