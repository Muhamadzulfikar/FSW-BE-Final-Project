// const multer = require('multer');
const multer = require('multer');
const util = require('util');
const responseError = require('../Error/responseError');
const courseService = require('../Services/courseService');
const cloudinaryUtil = require('../../config/cloudinaryUtils');

const { uploadToCloudinary } = cloudinaryUtil;

// Multer setup

const storage = multer.memoryStorage();
// eslint-disable-next-line object-shorthand
const upload = multer({ storage: storage });

const uploadMiddleware = util.promisify(upload.single('image'));

module.exports = {
  async getAllCourses(req, res) {
    try {
      const { filter } = req;
      const courses = await courseService.getAllListCourses(filter);

      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: courses,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async getCourseDetailById(req, res) {
    try {
      const { user } = req;
      const userUuid = user ? user.userUuid : null;
      const courseDetail = await courseService.getCourseDetailById(req.params.id, userUuid);

      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: courseDetail,
      });
    } catch (error) {
      if (error.code) {
        responseError(res, error);
      }
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: error.message,
      });
    }
  },

  async getCourseByIdAdmin(req, res) {
    try {
      const { uuid } = req.params;
      const course = await courseService.getCourseByIdAdmin(uuid);

      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: course,
      });
    } catch (error) {
      if (error.code) {
        responseError(res, error);
      } else {
        res.status(500).json({
          code: 500,
          status: 'Internal Server Error',
          message: error.message,
        });
      }
    }
  },

  async getCourseStatistic(req, res) {
    try {
      const courses = await courseService.getListCourseStatisticAdmin();
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: courses,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async getCourseAdmin(req, res) {
    try {
      const courses = await courseService.getListCourseAdmin();
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: courses,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async getManagementCourse(req, res) {
    try {
      const courses = await courseService.getListCourseManagement();
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: courses,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async createCourseAdmin(req, res) {
    try {
      const course = await courseService.createCourseAdmin(req.body);

      res.status(201).json({
        status: 'OK',
        code: 201,
        message: 'Success',
        data: course,
      });
    } catch (error) {
      if (error.code) {
        res.status(error.code).json({
          code: error.code,
          status: error.status,
          message: error.message,
        });
      } else {
        res.status(500).json({
          code: 500,
          status: 'Internal Server Error',
          message: error,
        });
      }
    }
  },

  async updateCourseAdmin(req, res) {
    try {
      const { courseUuid } = req.params;
      const course = await courseService.updateCourseAdmin(courseUuid, req.body);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',
        data: course,
      });
    } catch (error) {
      if (error.code) {
        res.status(error.code).json({
          code: error.code,
          status: error.status,
          message: error.message,
        });
      }
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async deleteCourse(req, res) {
    try {
      const { courseUuid } = req.params;
      await courseService.deleteCourseAdmin(courseUuid);
      res.status(201).json({
        status: 'OK',
        code: 201,
        message: 'Successfully Delete Data',
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

  async isOnboarding(req, res) {
    try {
      const { userUuid } = req.user;
      const { courseUuid } = req.params;
      await courseService.isOnboarding(userUuid, courseUuid);
      res.status(201).json({
        status: 'created',
        code: 201,
        message: 'Successfully Completed Onboarding',
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

  async completingModule(req, res) {
    try {
      const { userChapterModuleUuid } = req.params;
      const userChapterModule = await courseService.completingModule(userChapterModuleUuid);
      res.status(201).json({
        status: 'created',
        code: 201,
        message: 'Successfully Completing Module',
        data: userChapterModule,
      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async getVideoCourse(req, res) {
    try {
      const { chapterModuleUuid } = req.params;
      const videoCourse = await courseService.getVideoCourse(chapterModuleUuid);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Successfully get Video',
        data: videoCourse,

      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async getMyCourse(req, res) {
    try {
      const { userUuid } = req.user;
      const { isComplete } = req.query;
      const myCourse = await courseService.getMyCourse(userUuid, req.filter, isComplete);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Successfully get My Course',
        data: myCourse,

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
        message: error.message,
      });
    }
  },

};
