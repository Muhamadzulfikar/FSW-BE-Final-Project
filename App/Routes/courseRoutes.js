const express = require('express');
const courseCategoryController = require('../Controllers/courseCategoryController');
const courseController = require('../Controllers/courseController');
const paymentCourseController = require('../Controllers/paymentCourseController');
const { filterByCategoriesAndLevel, validateUserCourse, isCompletedCourseModule } = require('../Middleware/courseMiddleware');
const { authorize, isSuperAdminAndAdmin } = require('../Middleware/authMiddleware');
const { validatePaymentRequest, isEnrollCourse } = require('../Middleware/paymentMiddleware');

const route = express.Router();

route.get('/course-categories', courseCategoryController.getAllCourseCategory);
route.get('/courses', filterByCategoriesAndLevel, courseController.getAllCourses);
route.get('/course/:id', authorize, courseController.getCourseDetailById);

route.get('/admin/payment-status', authorize, isSuperAdminAndAdmin, courseController.getCourseAdmin);
route.get('/admin/courses', authorize, isSuperAdminAndAdmin, courseController.getManagementCourse);
route.post('/admin/courses', authorize, isSuperAdminAndAdmin, courseController.createCourse);
route.put('/admin/course/:id', authorize, isSuperAdminAndAdmin, courseController.getCourseById, courseController.updateCourse);
route.delete('/admin/course:id', authorize, isSuperAdminAndAdmin, courseController.getCourseById, courseController.deleteCourse);

route.post('/courses/enrollment', authorize, isEnrollCourse, paymentCourseController.enrollCourse);
route.put('/courses/payment/:paymentUuid', authorize, validatePaymentRequest, paymentCourseController.paymentCourse);

route.put('/courses/onboarding/:courseUuid', authorize, validateUserCourse, courseController.isOnboarding);
route.post('/course-modules/module-completed', authorize, isCompletedCourseModule, courseController.completingModule);
module.exports = route;
