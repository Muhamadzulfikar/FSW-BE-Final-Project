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

  async updateProfile(req, res) {
    try {
      const { userUuid } = req.user;
      const payload = {};
      const {
        name, phone, address, country, city,
      } = req.body;

      if (name) payload.name = name;
      if (phone) payload.phone = phone;
      if (address) payload.address = address;
      if (country) payload.country = country;
      if (city) payload.city = city;

      const profile = await userServices.updateProfileUser(userUuid, payload);

      res.status(201).json({
        status: 'Created',
        code: 201,
        message: 'Successfully update profile',
        data: profile,
      });
    } catch (error) {
      if (error.code) {
        res.status(error.code).json({
          code: error.code,
          status: error.status,
          message: error.message,
        });
      }
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: error,
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
