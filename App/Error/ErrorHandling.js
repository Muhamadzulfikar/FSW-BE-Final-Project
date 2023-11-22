module.exports = {
  unauthorized(message) {
    const status = 'Unauthorized';
    const error = new Error(`${status}. ${message}`);
    error.code = '401';
    error.status = status;
    throw error;
  },

  forbidden(message) {
    const status = 'Forbidden';
    const error = new Error(`${status}. ${message}`);
    error.code = '403';
    error.status = status;
    throw error;
  },

  internalError(message) {
    const status = 'Internal Server Error';
    const error = new Error(`${status}. ${message}`);
    error.code = '500';
    error.status = status;
    throw error;
  },

  badRequest(message) {
    const status = 'Bad Request';
    const error = new Error(`${status}. ${message}`);
    error.code = '400';
    error.status = status;
    throw error;
  },
};
