const courseChapter = require('../models/courseChapter');

module.exports = {
  getTotalModule() {
    return courseChapter.action();
  },

  getTotalMinute() {
    return courseChapter.action();
  },
};
