const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');
const fileRouter = require('./routes/fileRouter')
const path = require('path');
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/files', fileRouter)

module.exports = app;
