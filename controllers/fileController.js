const File = require('../models/fileModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const mailHandler = require('../utilities/sendMail');
const APIFuncs = require('../utilities/apiFunctionalities');
const fs = require('node:fs');
const path = require('node:path');
const { google } = require('googleapis');

const KEYFILEPATH = path.join('/etc/secrets', 'creed.json');
const SCOPES = [process.env.SCOPES];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});
const driveService = google.drive({ version: 'v3', auth });
const parentFolderId = process.env.FOLDER_ID;

/**
 * Get all files with filtering, sorting, limiting fields, and pagination
 * @route GET https://file-server-oj1g.onrender.com/api/v1/files
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} = All files in the database or requested fields.
 * @access Public
 */
module.exports.getAllFiles = catchAsync(async (req, res, next) => {
  const features = new APIFuncs(File.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const files = await features.query;
  res.status(200).json({
    status: 'success',
    results: files.length,
    data: {
      files,
    },
  });
});

/**
 * Get a file information using it's driveId.
 * @route GET https://file-server-oj1g.onrender.com/api/v1/files/file_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} id - The ID of the file to retrieve.
 * @returns {Promise<void>} = One file in the database with the id or not found error.
 * @access Authenticated
 */
module.exports.getFile = catchAsync(async (req, res, next) => {
  const id = req.params.file_id;
  // console.log(req.params);
  if (!id) {
    return next(new AppError('Specify file  id', 400));
  }

  let file = await File.findOne({ driveId: id });
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

/**
 * Uploads a file from the admin into the database.
 * @route POST https://file-server-oj1g.onrender.com/api/v1/files
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} = Uploads a file in the database.
 * @body {string} [title] - The title of the file.
 * @body {string} [description] - The new description of the file.
 * @body {file} [application/pdf] - The file to be uploaded
 * @access Admin
 */
module.exports.uploadFile = catchAsync(async (req, res, next) => {
  const file = req.file;

  const { title, description } = req.body; // Ensure title and description are passed in the request body

  try {
    const response = await driveService.files.create({
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: [parentFolderId],
      },
      fields: 'id, name',
    });

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
    next(new AppError(err, 500)); // Forward the error to the global error handler
  }
});

/**
 * Delete a file from the database using the drive_id.
 * @route DELETE https://file-server-oj1g.onrender.com/api/v1/files/file_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} id - The ID of the file to delete.
 * @returns {Promise<void>} = 200 status code with a success message.
 * @access Admin
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
    next(new AppError(error, 500)); // Forward the error to the global error handler
  }
});

/**
 * Search for files matcthing a particular name or string.
 * @route GET https://file-server-oj1g.onrender.com/api/v1/files/search/
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @query {string} [title] - Search files by title.
 * @returns {Promise<void>} = All matching files.
 * @access Authenticated
 */
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

/**
 * Get a file Statistics using it's driveId.
 * @route GET https://file-server-oj1g.onrender.com/api/v1/files/getStats/file_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} id - The ID of the file to retrieve.
 * @returns {Promise<void>} = One file in the database with the id or not found error.
 * @access Admin
 */
module.exports.getFileStats = catchAsync(async (req, res, next) => {
  const id = req.params.file_id;
  if (!id) {
    return next(new AppError('Specify the id of the file!'), 400);
  }

  const file = await File.findOne({ driveId: id }).select(
    '+numberDownloads +mailSent'
  );
  if (!file) {
    return next(new AppError('No file found for the id!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      file,
    },
  });
});

/**
 * Download a file from google drive using the drive_id.
 * @route GET https://file-server-oj1g.onrender.com/api/v1/files/download/file_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} id - The ID of the file to download.
 * @returns {Promise<void>} = File content to download.
 * @access Authenticated
 */
module.exports.downloadFile = catchAsync(async (req, res, next) => {
  const fileId = req.params.file_id;

  if (!fileId) {
    return next(new AppError('No file ID specified', 400));
  }

  // Find the file in database based on `fileId`
  const file = await File.findOne({ driveId: fileId }).select(
    '+numberDownloads'
  );

  if (!file) {
    return next(new AppError('File not found', 404));
  }

  try {
    const response = await driveService.files.get(
      { fileId: file.driveId, alt: 'media' },
      { responseType: 'stream' }
    );

    const filePath = path.join(__dirname, `${file.filename}.tmp`);
    const dest = fs.createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      response.data
        .pipe(dest)
        .on('finish', resolve)
        .on('error', (error) => {
          dest.close();
          fs.unlinkSync(filePath);
          reject(error);
        });
    });

    file.numberDownloads++;
    await file.save();

    res.download(filePath, file.filename, (err) => {
      if (err) {
        return next(new AppError('Error sending file', 500));
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          return next(new AppError('Error Unlinking file', 500));
        }
      });
    });
  } catch (error) {
    return next(new AppError('Error fetching file from Google Drive', 500));
  }
});

/**
 * Retrieves a file and sends to a specified user email address.
 * @route GET https://file-server-oj1g.onrender.com/api/v1/files/send/file_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} id - The ID of the file to download.
 * @param {string} email - The email of the user to receive the file.
 * @returns {Promise<void>} = The file to send and the mail sending.
 * @access Authenticated
 */
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

    const filePath = path.join(__dirname, file.filename);

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
        return next(new AppError('Failed to delete temporary file!', 500));
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
