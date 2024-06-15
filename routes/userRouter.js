const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');

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
router
  .route('/:user_id')
  .get(authController.protect, authController.restricted('admin db-admin'))
  .delete(authController.protect, authController.restricted('admin db-admin'));
module.exports = router;
