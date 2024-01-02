const express = require('express');
// const multer = require('multer');

// const storage = multer.memoryStorage();
// eslint-disable-next-line object-shorthand
// const upload = multer({ storage: storage });
const courseCategoryController = require('../Controllers/courseCategoryController');
const courseController = require('../Controllers/courseController');

const paymentCourseController = require('../Controllers/paymentCourseController');
const userNotificationController = require('../Controllers/userNotificationController');
const { authorize, isSuperAdminAndAdmin } = require('../Middleware/authMiddleware');

const { validatePaymentRequest, isEnrollCourse } = require('../Middleware/paymentMiddleware');
const {
  filterByCategoriesAndLevel,
  validateUserCourse,
  isPremiumCourseAndPaid,
  authorizeCourse,
} = require('../Middleware/courseMiddleware');

// const upload = multer();

const route = express.Router();

route.get('/course-categories', courseCategoryController.getAllCourseCategory);
route.get('/courses', filterByCategoriesAndLevel, courseController.getAllCourses);
route.get('/course/:id', authorizeCourse, courseController.getCourseDetailById);
route.get('/courses/video-course/:chapterModuleUuid', authorize, isPremiumCourseAndPaid, courseController.getVideoCourse);
route.get('/courses/my-courses', authorize, filterByCategoriesAndLevel, courseController.getMyCourse);

route.get('/admin/statistic', authorize, isSuperAdminAndAdmin, courseController.getCourseStatistic);
route.get('/admin/payment-status', authorize, isSuperAdminAndAdmin, courseController.getCourseAdmin);
route.get('/admin/courses', authorize, isSuperAdminAndAdmin, courseController.getManagementCourse);
route.post('/admin/courses', authorize, isSuperAdminAndAdmin, courseController.createCourseAdmin);
route.put('/admin/courses/:courseUuid', authorize, isSuperAdminAndAdmin, courseController.updateCourseAdmin);
route.delete('/admin/courses/:courseUuid', authorize, isSuperAdminAndAdmin, courseController.deleteCourse);

route.post('/courses/enrollment', authorize, isEnrollCourse, paymentCourseController.enrollCourse);
route.get('/courses/invoice/:paymentUuid', authorize, paymentCourseController.invoicePayment);
route.put('/courses/payment/:paymentUuid', authorize, validatePaymentRequest, paymentCourseController.paymentCourse);

route.put('/courses/onboarding/:courseUuid', authorize, validateUserCourse, courseController.isOnboarding);
route.put('/course-modules/module-completed/:userChapterModuleUuid', authorize, courseController.completingModule);

route.get('/courses/payment-history', authorize, paymentCourseController.paymentHistory);

route.get('/notification', authorize, userNotificationController.notification);
module.exports = route;
