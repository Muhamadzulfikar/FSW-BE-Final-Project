const express = require('express');
const courseController = require('../Controllers/courseController');

const route = express.Router();

route.get('/course-categories', courseCategoryController.getAllCourseCategory);
route.get(
  '/course-categories/:id',
  courseCategoryController.getCourseCategoryById,
);
route.get('/courses', courseController.getAllCourses);
route.get('/course/:id', courseController.getCourseDetailById);

module.exports = route;
