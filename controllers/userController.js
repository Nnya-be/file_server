const User = require('../models/userModel');
const AppError = require('../utilities/appError');
const catchAsync = require('../utilities/catchAsync');

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    message: 'Get one user',
    users,
  });
});
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
    user,
  });
});

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
    user,
  });
});
