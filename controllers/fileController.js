const File = require('../models/fileModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const mailHandler = require('../utilities/sendMail');
const APIFuncs = require('../utilities/apiFunctionalities');
const fs = require('node:fs');
const path = require('node:path');
const { google } = require('googleapis');
const stream = require('node:stream');

const KEYFILEPATH = path.join('/etc/secrets', 'creed.json');
const SCOPES = [process.env.SCOPES];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});
const driveService = google.drive({ version: 'v3', auth });
const parentFolderId = process.env.FOLDER_ID;

module.exports.getAllFiles = catchAsync(async (req, res, next) => {
  const features = new APIFuncs(File.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const files = await features.query;
  res.status(200).json({
    status: 'succes',
    results: files.length,
    data: {
      files,
    },
  });
});

module.exports.getFile = catchAsync(async (req, res, next) => {
  const id = req.params.file_id;
  // console.log(req.params);
  if (!id) {
    return next(new AppError('Specify file  id', 400));
  }

  let file = await File.findById(id);
  if (!file) {
    return next(new AppError('File not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      file,
    },
  });
});

module.exports.uploadFile = catchAsync(async (req, res, next) => {
  const file = req.file;
  // console.log(file);

  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.buffer); // Ensure this ID is correct and accessible

  const { title, description } = req.body; // Ensure title and description are passed in the request body

  try {
    const response = await driveService.files.create({
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
      requestBody: {
        name: file.originalname,
        parents: [parentFolderId],
      },
      fields: 'id, name',
    });

    // console.log(response.data.id);

    const newFile = new File({
      filename: file.originalname,
      title,
      description,
      mimetype: file.mimetype,
      size: file.size,
      driveId: response.data.id, // Save the Google Drive file ID
    });

    await newFile.save();

    res.status(201).json({
      status: 'created',
      data: {
        newFile,
      },
    });
  } catch (error) {
    // console.error(error);
    next(new AppError(err, 400)); // Forward the error to the global error handler
  }
});

/* const { title, description } = req.body;
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
  */

module.exports.deleteFile = catchAsync(async (req, res, next) => {
  const { file_id } = req.params;
  if (!file_id) {
    return next(new AppError('Please provide a file id', 400));
  }
  const file = await File.findOne({ driveId: file_id });
  if (!file) {
    return next(new AppError('File not found', 404));
  }

  try {
    await driveService.files.delete({
      fileId: file_id,
    });

    // If you also want to remove the file reference from your database
    await file.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(new AppError(error, 400)); // Forward the error to the global error handler
  }
});

module.exports.searchFile = catchAsync(async (req, res, next) => {
  let query = req.query;
  if (!query) {
    return next(new AppError('No query filed found!', 400));
  }
  let { title } = query;
  if (!title) {
    return next(new AppError('No title to search!', 400));
  }
  title = new RegExp(title, 'i');
  const files = await File.find({ title });

  if (!files || (Array.isArray(files) && files.length === 0)) {
    return next(new AppError('No file found with this details', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      files,
    },
  });
});

module.exports.getFileStats = catchAsync(async (req, res, next) => {
  const id = req.params.file_id;
  if (!id) {
    return next(new AppError('Specify the id of the file!'), 400);
  }

  const file = await File.findById(id).select('+numberDownloads +mailSent');
  if (!file) {
    return next(new AppError('No file found for the id!', 404));
  }

  console.log(file);

  res.status(200).json({
    status: 'success',
    data: {
      download: file.numberDownloads,
      mails: file.mailSent,
    },
  });
});

module.exports.downloadFile = catchAsync(async (req, res, next) => {
  const id = req.params.file_id;

  if (!id) {
    return next(new AppError('No file name Specified', 400));
  }

  const file = await File.findOne({ driveId: id }).select('+numberDownloads');
  if (!file) {
    return next(new AppError('File not found', 404));
  }
  try {
    const response = await driveService.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'stream' }
    );

    const filePath = path.join(__dirname, '..', 'tmp', file.filename);

    // Create a write stream to a temporary file
    const dest = fs.createWriteStream(filePath);

    // Pipe the response stream to the file
    await new Promise((resolve, reject) => {
      response.data.pipe(dest);
      response.data.on('end', resolve);
      response.data.on('error', reject);
    });

    // Increment the download count
    file.numberDownloads++;
    await file.save();

    // Use res.download to trigger file download
    res.download(filePath, file.filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        return next(err); // Forward the error to the global error handler
      }
      console.log('Download complete');
      // Optionally, you can delete the temporary file after download
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error fetching file from Google Drive:', error);
    next(error); // Forward the error to the global error handler
  }
});

module.exports.sendFile = catchAsync(async (req, res, next) => {
  const id = req.params.file_id;
  const address = req.body.email;

  if (!id || !address) {
    return next(new AppError('No file id or email specified', 400));
  }

  const file = await File.findOne({ driveId: id }).select('+mailSent');

  if (!file) {
    return next(new AppError('File not found', 404));
  }

  try {
    const response = await driveService.files.get(
      { fileId: file.driveId, alt: 'media' },
      { responseType: 'stream' }
    );

    const filePath = path.join(__dirname, 'tmp', file.filename);

    // Create a write stream to a temporary file
    const dest = fs.createWriteStream(filePath);

    // Pipe the response stream to the file
    await new Promise((resolve, reject) => {
      response.data.pipe(dest).on('finish', resolve).on('error', reject);
    });

    // Check if file was written
    if (!fs.existsSync(filePath)) {
      throw new Error('File was not created in the tmp directory');
    }
    const fileData = fs.readFileSync(filePath);

    // Prepare email options
    const options = {
      from: process.env.MAIL_USER,
      to: address,
      subject: 'File',
      html: '<p>Attached is your file.</p>',
      attachments: [
        {
          content: fileData.toString('base64'), // Convert file to base64 format
          filename: file.filename,
          type: file.mimetype, // Mime type of the file
          disposition: 'attachment', // Specify as attachment
        },
      ],
    };

    // Send email with attachment
    await mailHandler.mailHandler(options);
    // Delete the temporary file after sending the email
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Failed to delete temporary file:', err);
      }
    });

    // Update file metadata
    file.mailSent++;
    await file.save();

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    next(new AppError(error.message, 400)); // Forward the error to the global error handler
  }
});
