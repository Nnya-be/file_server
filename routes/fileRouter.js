const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../utilities/multer');
router.get('/', fileController.getAllFiles);
router.get('/?:id', fileController.getFile);
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.delete('/delete', fileController.deleteFile);
module.exports = router;
