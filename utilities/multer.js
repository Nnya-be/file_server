const multer = require('multer');
const path = require('path');
/** Setting up the multer config */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + '' + Math.round(Math.random() * 1e9);
    const name = file.originalname.split(' ')[0];
    const type = file.mimetype.split('/')[1];

    cb(null, `${name}-${suffix}.${type}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept files with MIME type 'application/pdf'
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
