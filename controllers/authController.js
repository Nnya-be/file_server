const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/appError');
const { promisify } = require('node:util');
/** Signs the jwt token */
const signToken = (user_id) => {
  const options = {
    expiresIn: process.env.JWT_EXPIRE,
  };
  const payload = {
    user_id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/** Creates a new jwt token */
const createToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookie_op = {
    expiresIn: new Date(Date.now() + process.env.JWT_EXPIRE * 24 * 3600000),
    httpOnly: true,
    // secure:true,
  };

  if (process.env.NODE_ENV === 'production') cookie_op.secure;

  res.cookie('jwt', token, cookie_op);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

/** Signs Up a user */
module.exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createToken(newUser, 201, res);
});

/** Logs in a user */
module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Incorrect Password or Email!'));
  }
  const user_acc = await User.findOne({ email }).select('+password');
  if (!user_acc) {
    return next(new AppError('Incorrect Password or Email!'));
  }

  const match = await user_acc.comparePasswords(password, user_acc.password);
  if (!match) {
    return next(new AppError('Incorrect Password or Email!'));
  }

  createToken(user_acc, 200, res)
});

/** Protects a route from unlogged in users */
module.exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  /** Checks for the token existance. */
  if (!token) {
    return next(new AppError('Please login to access this route.', 401));
  }
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  /** extracts the userid and query for it */
  const userAcc = await User.findById(decoded_token.user_id);

  if (!userAcc) {
    return next(new AppError('Invalid Token!', 401));
  }

  /** Check if the user has changed the password since the token was issued */
  if (!userAcc.modifiedPassword(decoded_token.iat)) {
    return next(new AppError('Invalid Token!', 401));
  }
  req.user = userAcc;

  next();
});

module.exports.restricted = (...role) => {
  return async (res, req, next) => {
    console.log(req);
    next();
  };
};
