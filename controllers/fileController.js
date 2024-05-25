const File = require('../models/fileModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const mailHandler = require('../utilities/sendMail');
const fs = require('node:fs');
const path = require('node:path');

module.exports.getAllFiles = catchAsync(async (req, res, next) => {
  const files = await File.find();

  res.status(200).json({
    status: 'succes',
    files,
  });
});

module.exports.getFile = catchAsync(async (req, res, next) => {
  const { title, id } = req.body;
  if (!title && !id) {
    return next(new AppError('Specify file title or id', 400));
  }

  let file = title
    ? await File.find({ title: title })
    : await File.findById(id);
  if (!file) {
    return next(new AppError('File not found', 404));
  }

  res.status(200).json({
    status: 'success',
    file,
  });
});

module.exports.uploadFile = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  console.log(title, description);
  const file = new File({
    filename: req.file.filename,
    title,
    description,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });

  await file.save();
  res.status(200).json({
    status: 'success',
  });
});

module.exports.deleteFile = catchAsync(async (req, res, next) => {
  const file_id = req.query.id;
  if (!file_id) {
    return next(new AppError('Please provide a file id', 400));
  }
  const file = await File.findById(file_id);
  if (!file) {
    return next(new AppError('File not found', 404));
  }

  const filePath = path.join(__dirname, '../uploads', file.filename);

  fs.unlink(filePath, async (err) => {
    if (err) {
      return next(new AppError('Failed to delete file', 500));
    }

    await file.deleteOne();
    res.status(204).json({
      status: 'success',
    });
  });
});
