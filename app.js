const express = require('express');
const app = express();
const hpp = require('hpp');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const fileRouter = require('./routes/fileRouter');
const path = require('path');
app.use(express.json());
app.use(helmet())
app.use(cors());
app.use(hpp())
app.use(xss())
const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });
  app.use(limiter
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/files', fileRouter);

module.exports = app;
