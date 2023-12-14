const express = require('express');
const courseCategoryController = require('../Controllers/courseCategoryController');
const courseController = require('../Controllers/courseController');
const { filterByCategoriesAndLevel } = require('../Middleware/courseMiddleware');
const { authorize } = require('../Middleware/authMiddleware');

const route = express.Router();

route.get('/course-categories', courseCategoryController.getAllCourseCategory);
route.get('/courses', filterByCategoriesAndLevel, courseController.getAllCourses);
route.get('/course/:id', authorize, courseController.getCourseDetailById);

module.exports = route;
