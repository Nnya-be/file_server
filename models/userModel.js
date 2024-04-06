const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
/** Creating user schema */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide username.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid Email Address.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'Passwords must be more than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (pass) {
        return this.password === pass;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordRestExp: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;

  // console.log(this.passwordChangedAt);
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.modifiedPassword = function (tokenTime) {
  if (this.passwordChangedAt) {
    const time = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return tokenTime > time;
  }

  return true;
};

userSchema.methods.comparePasswords = async function (
  provided_password,
  model_password
) {
  return await bcrypt.compare(provided_password, model_password);
};
const User = new mongoose.model('User', userSchema);

module.exports = User;
