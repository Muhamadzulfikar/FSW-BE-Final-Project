const userServices = require('../Services/userServices');

module.exports = {
  async user(req, res) {
    try {
      const { user } = req;
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: user,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async changePassword(req, res) {
    try {
      const courseDetail = await userServices.changePasswordUser(req.params.id);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: courseDetail,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async updatePassword(req, res) {
    try {
      const { userUuid } = req.user;
      const { oldPassword, newPassword } = req.body;
      // eslint-disable-next-line max-len
      await userServices.updatePasswordUser(userUuid, oldPassword, newPassword);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: true,
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
