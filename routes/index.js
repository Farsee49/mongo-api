
const apiRouter = require('express').Router();



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


const fishRouter = require('./fish');
apiRouter.use('/fish', fishRouter);


const userRouter = require('./users');
apiRouter.use('/users', userRouter);


module.exports = apiRouter;