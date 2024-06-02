const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../utilities/multer');
router.get('/', fileController.getAllFiles);
router.get('/?:id', fileController.getFile);
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.delete('/delete', fileController.deleteFile);
router.get('/search', fileController.searchFile);
router.get('/getStats', fileController.getFileStats);
router.get('/download/:filename', fileController.downloadFile);
router.get('/send/:file_name&email_address', fileController.sendFile)
module.exports = router;
