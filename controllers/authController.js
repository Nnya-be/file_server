const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utilities/appError');
const { mailHandler } = require('../utilities/sendMail');
const crypto = require('node:crypto');
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
    return next(new AppError('Incorrect Password or Email!', 400));
  }
  const user_acc = await User.findOne({ email }).select('+password');
  if (!user_acc) {
    return next(new AppError('Incorrect Password or Email!', 400));
  }

  const match = await user_acc.comparePasswords(password, user_acc.password);
  if (!match) {
    return next(new AppError('Incorrect Password or Email!', 400));
  }

  createToken(user_acc, 200, res);
});

/** Protects a route from unlogged in users */
module.exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ');
    console.log(token);
  }
  /** Checks for the token existance. */
  if (!token) {
    return next(new AppError('Please login to access this route.', 401));
  }
  console.log(token);
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
    if (!role.includes(req.user.role))
      return next(new AppError('Permission denied for this route', 403));
    next();
  };
};

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user_mail = req.body.email;

  const user_document = await User.findOne({ email: user_mail });

  if (!user_document || !user_mail) {
    return next(new AppError('Wrong Credentials!', 401));
  }
  const reset_token = user_document.generateResetToken();
  await user_document.save({ validateBeforeSave: false });

  const reset_url = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${reset_token}`;

  const message = `Forgot Password? Click on the link below to submit your request. If you did not request this Please ensure your account is not being breached or ignore.`;

  try {
    await mailHandler({
      from: process.env.MAIL_USER,
      to: user_document.email,
      subject: 'Password Reset',
      message,
    });

    res.status(200).json({
      status: 'Success',
      reset_token,
      reset_url,
    });
  } catch (err) {
    user_document.passwordResetToken = undefined;
    user_document.passwordResetExpiration = undefined;
    await user_document.save({ validateBeforeSave: false });

    return next(new AppError('Error on sending mail!', 500));
  }
});

module.exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user_document = await User.findOne({
    passwordResetToken: token,
    passwordResetExpire: { $gte: Date.now() },
  });

  if (!user_document) {
    return next(new AppError('Invalid link or token', 400));
  }
  user_document.password = req.body.password;
  user_document.passwordResetExpire = undefined;
  user_document.passwordResetToken = undefined;
  await user_document.save({ validateBeforeSave: false });

  createToken(user_document, 200, res);
});

module.exports.updatePassword = catchAsync(async (req, res, next) => {
  const user_document = await User.findById(req.user.id).select('+password');
  if (
    !(await user_document.comparePasswords(
      req.body.oldPassword,
      user_document.password
    ))
  ) {
    return next(new AppError('Invalid Password!', 401));
  }
  user_document.password = req.body.newPassword;
  user_document.passwordConfirm = req.body.passwordConfirm;
  await user_document.save();

  res.status(200).json({
    status: 'success',
  });
});
