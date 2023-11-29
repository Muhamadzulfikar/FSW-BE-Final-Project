const { courseChapter } = require('../models');

module.exports = {
  getTotalModule(courseUuid) {
    return courseChapter.count({
      where: {
        course_uuid: courseUuid,
      },
    });
  },

  getTotalMinute(courseUuid) {
    return courseChapter.sum('duration', {
      where: {
        course_uuid: courseUuid,
      },
    });
  },
};
