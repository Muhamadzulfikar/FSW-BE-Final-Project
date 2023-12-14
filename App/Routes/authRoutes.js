const express = require('express');

const route = express.Router();
const { userLogin, userRegister, validateOtp } = require('../Controllers/authController');
const { user } = require('../Controllers/userController');
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

route.post('/validate-register', authorize, validateOtp);

route.post(
  '/register/admin',
  isUserHasNotRegister,
  authorize,
  isSuperAdmin,
  userRegister,
);

module.exports = route;
