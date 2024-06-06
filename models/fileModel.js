const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please Enter a file title'],
  },
  description: {
    type: String,
    required: [true, 'Please give some description of file'],
  },
  filename: {
    type: String,
    required: [true, 'Please provied a filename'],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  mimetype: String,
  size: Number,
  numberDownloads: {
    type: Number,
    default: 0,
    select: false,
  },
  driveId: Object,
  mailSent: {
    type: Number,
    default: 0,
    select: false,
  },
});

const File = new mongoose.model('File', fileSchema);

module.exports = File;
