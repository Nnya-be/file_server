const User = require('../models/userModel');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');
const APIFuncs = require('../utilities/apiFunctionalities');

/**
 * Get a users information from the database.
 * @route GET https://user-server-oj1g.onrender.com/api/v1/users/
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} = All users in the database.
 * @access Admin
 */
module.exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFuncs(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;
  res.status(200).json({
    status: 'success',
    message: 'Geting all users',
    results: users.length,
    data: {
      users,
    },
  });
});

/**
 * Get a users information using it's driveId.
 * @route GET https://user-server-oj1g.onrender.com/api/v1/users/file_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<void>} = One user in the database with the id or not found error.
 * @access Admin
 */
module.exports.getUser = catchAsync(async (req, res, next) => {
  const { user_id } = req.params;

  if (!user_id) {
    return next(new AppError('No id found', 400));
  }
  const user = await User.findById(user_id);
  if (!user) {
    return next(new AppError('No user found!', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Get one user',
    data: {
      user,
    },
  });
});

/**
 * Create a user using information provided.
 * @route POST https://user-server-oj1g.onrender.com/api/v1/users/
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} = The new user details created.
 * @access Admin
 */
module.exports.createUser = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError('No user details'));
  }
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

/**
 * Delete a User from the database using the drive_id.
 * @route DELETE https://User-server-oj1g.onrender.com/api/v1/user/file_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @param {string} id - The ID of the User to delete.
 * @returns {Promise<void>} = 200 status code with a success message.
 * @access Admin
 */
module.exports.deleteFile = catchAsync(async (req, res, next) => {
  const { user_id } = req.params;
  if (!user_id) {
    return next(new AppError('Please provide a file id', 400));
  }
  const user = await File.findByID(user_id);
  if (!user) {
    return next(new AppError('No user found with ID!', 404));
  }

  await user.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully!',
  });
});
