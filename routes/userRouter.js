const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signUp);
router.post('/verify/:token', authController.verifyUser);
router.post('/login', authController.login);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router
  .route('/')
  .post(userController.createUser)
  .get(
    authController.protect,
    authController.restricted('admin'),
    userController.getAllUsers
  );
module.exports = router;
