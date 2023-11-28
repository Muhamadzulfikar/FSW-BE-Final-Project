const express = require('express');

const route = express.Router();
const { userLogin, userRegister } = require('../Controllers/authController');
const {
  validateBodyLogin,
  isUserHasRegister,
  isUserHasNotRegister,
  validateBodyRequest,
  authorize,
  isSuperAdmin,
} = require('../Middleware/authMiddleware');

route.post('/login', validateBodyLogin, isUserHasRegister, userLogin);
route.post(
  '/register',
  validateBodyRequest,
  isUserHasNotRegister,
  userRegister,
);
route.post(
  '/register/admin',
  isUserHasNotRegister,
  authorize,
  isSuperAdmin,
  userRegister,
);

module.exports = route;