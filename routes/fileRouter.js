const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../utilities/multer');
router.get('/search', fileController.searchFile);
router.get('/:file_id', fileController.getFile);
router.get('/', fileController.getAllFiles);
router.post(
  '/upload',
  authController.protect,
  authController.restricted('admin'),
  upload.single('file'),
  fileController.uploadFile
);
router.delete('/delete/:file_id', fileController.deleteFile);
router.get(
  '/getStats/:file_id',
  authController.protect,
  authController.restricted('admin'),
  fileController.getFileStats
);
router.get(
  '/download/:file_id',
  authController.protect,
  fileController.downloadFile
);
router.get('/send/:file_id&address', authController.protect, fileController.sendFile);
module.exports = router;
