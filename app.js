const express = require('express');
const server = express();
const path = require('path');
require('dotenv').config();
const EXPPORT = process.env.EXPPORT;
const JWT_SECRET =  process.env.JWT_SECRET;
const MongoDB_URL = process.env.MongoDB_URL;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const apiRouter = require('./routes/index');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./db/models/users');
const { userAuth } = require('./middleware');


// Connect to MongoDB
if (!MongoDB_URL) {
    console.error('MongoDB_URL is not defined in .env file');
    process.exit(1);
}
mongoose.connect(MongoDB_URL)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MONGO DB ENGAGED!!!!');
});

// Middleware
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(morgan('dev'));
server.use(express.static(path.join(__dirname, 'public')));
server.use(userAuth);
server.use('', (req, res, next) => {
    console.log('Server Request Received');
    next();
});

// API Routes
server.use('/api', apiRouter);

// Catch-all route for unknown endpoints
server.use((req, res, next) => {
    res.status(404).json({
        message: 'Unknown endpoint',
    });
});

// Error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message
    });
});

// Start the server
if (!EXPPORT) {
    console.error('EXPPORT is not defined in .env file');
    process.exit(1);
}
server.listen(EXPPORT, () => {
    console.log(`SERVER ENGAGED PORT: ${EXPPORT}!!!!`);
});
