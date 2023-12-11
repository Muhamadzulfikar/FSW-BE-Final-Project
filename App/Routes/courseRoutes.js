const express = require('express');
const courseCategoryController = require('../Controllers/courseCategoryController');
const courseController = require('../Controllers/courseController');
const { filterByCategoriesAndLevel } = require('../Middleware/courseMiddleware');

const route = express.Router();

route.get('/course-categories', courseCategoryController.getAllCourseCategory);
route.get('/courses', filterByCategoriesAndLevel, courseController.getAllCourses);
route.get('/course/:id', courseController.getCourseDetailById);
route.get('/admin-courses', courseController.getCourseAdmin);
route.post('/create-courses', courseController.createCourse);
route.put('/update-courses/:id', courseController.getCourseById, courseController.updateCourse);
route.delete('/delete-courses/:id', courseController.getCourseById, courseController.deleteCourse);
route.post('/buy-course', courseController.buyCourse);

module.exports = route;
