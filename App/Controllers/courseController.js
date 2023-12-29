const responseError = require('../Error/responseError');
// const multer = require('multer');
const courseService = require('../Services/courseService');
const { uploadToCloudinary } = require('../../config/cloudinaryUtils');

// const upload = multer({ dest: 'uploads/' });

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

  async getCourseById(req, res, next) {
    try {
      const { uuid } = req.params;
      const course = await courseService.getCourseById(uuid);
      req.course = course;
      next();
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
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

  async createCourse(req, res) {
    try {
      // console.log(req.body);
      // Menggunakan Multer untuk menyimpan file gambar sementara di server
      const imageData = req.file; // Menggunakan req.file karena Multer menyimpan file di req.file
      console.log(imageData);

      // Mengunggah file gambar ke Cloudinary
      const imageUrl = await uploadToCloudinary(imageData);

      // Mengganti URL gambar dengan URL dari Cloudinary
      req.body.image = imageUrl;

      // Memanggil layanan untuk membuat kursus
      const courses = await courseService.createCourseAdmin(req.body);

      // Memberikan respons ke klien
      res.status(201).json({
        status: 'OK',
        code: 201,
        message: 'Success',
        data: courses,
      });
    } catch (error) {
      // Menangani kesalahan dan memberikan respons yang sesuai
      res.status(error.code || 500).json({
        code: error.code || 500,
        status: error.status || 'Internal Server Error',
        message: error.message || 'Something went wrong',
      });
    }
  },

  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const dataCourse = req.body;
      await courseService.updateCourseAdmin(id, dataCourse);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',

      });
    } catch (error) {
      res.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }
  },

  async deleteCourse(req, res) {
    try {
      const { id } = req.params;
      await courseService.deleteCourseAdmin(id);
      res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Success',

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

};
