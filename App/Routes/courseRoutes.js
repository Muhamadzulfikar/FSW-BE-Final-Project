const express = require('express');
const courseController = require('../Controllers/courseController');

const route = express.Router();

route.get('/courses', courseController.getAllCourses);
route.get('/course/:id', courseController.getCourseDetailById);

module.exports = route;
