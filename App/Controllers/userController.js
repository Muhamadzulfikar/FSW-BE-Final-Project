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
};
