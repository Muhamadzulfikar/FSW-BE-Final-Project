const express = require('express');
const courseCategoryController = require('../Controllers/courseCategoryController');

const route = express.Router();

route.get('/course-categories', courseCategoryController.getAllCourseCategory);
route.get('/course-categories/:id', courseCategoryController.getCourseCategoryById);

module.exports = route;
