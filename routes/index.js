
const apiRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../db/models/users');
const JWT_SECRET = process.env.JWT_SECRET;






apiRouter.get('/unknown', (req, res, next) => {
    res.status(404).json({
        message: 'Unknown endpoint',
        error: 'Not Found'
    });
});

apiRouter.get('/health', (req, res, next) => {
    res.status(200).json({
        message: 'OK',
        status: 'Healthy'
    });
});



apiRouter.get('/version', (req, res, next) => {
    res.status(200).json({
        message: 'Version 1.0.0',
        version: '1.0.0'
    });
});


apiRouter.get('/status', (req, res, next) => {
    res.status(200).json({
        message: 'Service is running',
        status: 'Running'
    });
});


apiRouter.use( async (req, res, next) => {
    console.log(req.user, 'User Information'); // Debugging line
    next();
});



const fishRouter = require('./fish');
apiRouter.use('/fish', fishRouter);


const userRouter = require('./users');
apiRouter.use('/users', userRouter);

const postRouter = require('./posts');
apiRouter.use('/posts', postRouter);


module.exports = apiRouter;