const express = require('express');
const app = express();
const hpp = require('hpp');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const session = require('express-session');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const fileRouter = require('./routes/fileRouter');
const globalError = require('./controllers/errorController');
const path = require('path');
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(hpp());
app.use(xss());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // Set to true if using HTTPS
}));

// app.set('trust proxy', true);
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/files', fileRouter);
app.use(globalError);
module.exports = app;
