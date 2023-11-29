module.exports = {
  bodyResponse(bodyData) {
    return {
      status: 'OK',
      code: 200,
      message: 'Success',
      data: bodyData,
    };
  },

  async getAllCourseCategory(req, res) {
    try {
      res.status(200).json(this.bodyResponse([]));
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async getCourseCategoryById(req, res) {
    try {
      const { id } = req.params;
      res.status(200).json(this.bodyResponse([id]));
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },
};
