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
route.get('/admin-courses', authorize, authMiddleware.isSuperAdminAndAdmin, courseController.getCourseAdmin);
route.post('/create-courses', courseController.createCourse);
route.put('/update-courses/:id', courseController.getCourseById, courseController.updateCourse);
route.delete('/delete-courses/:id', courseController.getCourseById, courseController.deleteCourse);
route.post('/buy-course', authorize, paymentCourseController.buyCourse);
route.put('/payment/:id', authorize, paymentCourseController.payment);
module.exports = route;
