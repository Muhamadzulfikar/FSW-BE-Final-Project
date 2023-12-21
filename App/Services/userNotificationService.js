const userNotificationRepository = require('../Repositories/userNotificationRepository');
const errorHandling = require('../Error/errorHandling');

module.exports = {
  async userNotification(userUuid) {
    try {
      const course = await userNotificationRepository.userNotificationDetail(userUuid);
      return course;
    } catch (error) {
      errorHandling.badRequest(error);
    }
  },
};
