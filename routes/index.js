
const apiRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../db/models/users');
const JWT_SECRET = process.env.JWT_SECRET;



apiRouter.use(async (req, res, next) => {
const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    return next(); // allow anonymous access if no token
  }

  if (!auth.startsWith(prefix)) {
    return next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${prefix}`
    });
  }

  const token = auth.slice(prefix.length);
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    console.log('Decoded ID:', id); // Debugging line
    if (!id) {
      return next({
        name: 'InvalidTokenError',
        message: 'Token payload did not contain user ID'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return next({
        name: 'UserNotFoundError',
        message: 'No user found for this token'
      });
    }

    req.user = user;
    return next();
  } catch (err) {
    return next({
      name: 'JWTVerificationError',
      message: err.message
    });
  }
});




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


module.exports = apiRouter;