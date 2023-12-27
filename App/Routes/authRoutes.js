const express = require('express');

const route = express.Router();
const { user, updatePassword } = require('../Controllers/userController');

const {
  userLogin,
  userRegister,
  validateOtp,
  validateJwt,
  forgetPassword,
  resetPassword,
} = require('../Controllers/authController');

const {
  validateBodyLogin,
  isUserHasRegister,
  isUserHasNotRegister,
  validateBodyRequest,
  authorize,
  isSuperAdmin,
  isLoginAdmin,
} = require('../Middleware/authMiddleware');

route.post('/login', validateBodyLogin, isUserHasRegister, userLogin);
route.post('/login/admin', validateBodyLogin, isUserHasRegister, isLoginAdmin, userLogin);
route.post(
  '/register',
  validateBodyRequest,
  isUserHasNotRegister,
  userRegister,
);

route.post('/validate-register', authorize, validateOtp);
route.get('/validate-jwt', validateJwt);

route.post(
  '/register/admin',
  isUserHasNotRegister,
  authorize,
  isSuperAdmin,
  userRegister,
);
route.get('/profile', authorize, user);

route.put('/update-password', authorize, updatePassword);
route.post('/forget-password', isUserHasRegister, forgetPassword);
route.put('/reset-password/:jwtToken', resetPassword);

module.exports = route;
