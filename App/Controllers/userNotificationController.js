const userNotificationService = require('../Services/userNotificationService');

module.exports = {
  async notification(req, res) {
    try {
      const { userUuid } = req.user;
      const userNotification = await userNotificationService.userNotification(userUuid);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: userNotification,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },
};
