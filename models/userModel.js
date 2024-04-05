const mongoose = require("mongoose");
const validator = require("validator");

/** Creating user schema */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid Email Address."],
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minlength: [8, "Passwords must be more than 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: {
      validator: function (pass) {
        return this.password === pass;
      },
      message: "Passwords do not match",
    },
  },
  passwordChangesAt: Date,
  passwordResetToken: String,
  passwordRestExp: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});


const User = new mongoose.model('User', userSchema);

module.exports = User;
