const express = require('express');
const server = express();
const path = require('path');
const EXPPORT = process.env.EXPORT || 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const apiRouter = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/fishDB');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

server.use(express.json());
//rver.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(morgan('dev'));
server.use(express.static(path.join(__dirname, 'public')));

server.use('', (req, res, next) => {
    console.log('Server Request Received');
    next();
});

server.use('/api', apiRouter);

server.listen(EXPPORT, () => {
    console.log(`Server is running on port ${EXPPORT}`);
});
