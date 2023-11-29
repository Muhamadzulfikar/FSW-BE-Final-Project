const courseChapter = require('../models/index');

module.exports = {
  getTotalModule() {
    return courseChapter.action();
  },

  getTotalMinute() {
    return courseChapter.action();
  },
};
