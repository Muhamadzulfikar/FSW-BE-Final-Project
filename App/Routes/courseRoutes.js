const express = require('express');
const courseCategoryController = require('../Controllers/courseCategoryController');
const courseController = require('../Controllers/courseController');
const paymentCourseController = require('../Controllers/paymentCourseController');
const { filterByCategoriesAndLevel } = require('../Middleware/courseMiddleware');
const { authorize } = require('../Middleware/authMiddleware');
const authMiddleware = require('../Middleware/authMiddleware');

const route = express.Router();

route.get('/course-categories', courseCategoryController.getAllCourseCategory);
route.get('/courses', filterByCategoriesAndLevel, courseController.getAllCourses);
route.get('/course/:id', authorize, courseController.getCourseDetailById);

route.get('/admin/payment-status', authorize, authMiddleware.isSuperAdminAndAdmin, courseController.getCourseAdmin);
route.get('/admin/courses', authorize, authMiddleware.isSuperAdminAndAdmin, courseController.getManagementCourse);
route.post('/admin/courses', authorize, authMiddleware.isSuperAdminAndAdmin, courseController.createCourse);
route.put('/admin/course/:id', authorize, authMiddleware.isSuperAdminAndAdmin, courseController.getCourseById, courseController.updateCourse);
route.delete('/admin/course:id', authorize, authMiddleware.isSuperAdminAndAdmin, courseController.getCourseById, courseController.deleteCourse);

route.post('/courses/enrollment', authorize, paymentCourseController.enrollCourse);
route.put('/courses/payment/:id', paymentCourseController.payment);
module.exports = route;
