const express = require('express');

const route = express.Router();
const { user, updatePassword, updateProfile } = require('../Controllers/userController');

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
  authorizeRegister,
} = require('../Middleware/authMiddleware');

route.post('/login', validateBodyLogin, isUserHasRegister, userLogin);
route.post('/login/admin', validateBodyLogin, isUserHasRegister, isLoginAdmin, userLogin);
route.post(
  '/register',
  validateBodyRequest,
  isUserHasNotRegister,
  userRegister,
);

route.post('/validate-register', authorizeRegister, validateOtp);
route.get('/validate-jwt', validateJwt);

route.post(
  '/register/admin',
  isUserHasNotRegister,
  authorize,
  isSuperAdmin,
  userRegister,
);
route.get('/profile', authorize, user);
route.put('/profile', authorize, updateProfile);

route.put('/update-password', authorize, updatePassword);
route.post('/forget-password', isUserHasRegister, forgetPassword);
route.put('/reset-password/:jwtToken', resetPassword);

module.exports = route;
