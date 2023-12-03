module.exports = {
  async updateProgressChapter(req, res) {
    try {
      res.status(201).json();
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },
};
