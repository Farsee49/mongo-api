const express = require('express');
const server = express();
const path = require('path');
require('dotenv').config();
const EXPPORT = process.env.EXPORT || 3000;
const JWT_SECRET =  process.env.JWT_SECRET || 'fukboy'
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const apiRouter = require('./routes/index');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./db/models/users');



mongoose.connect('mongodb://localhost:27017/fishDB');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
//rver.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(morgan('dev'));
server.use(express.static(path.join(__dirname, 'public')));

server.use('', (req, res, next) => {
    console.log('Server Request Received');
    next();
});




// server.use(async (req, res, next) => {
//   const prefix = 'Bearer ';
//   const auth = req.header('Authorization');
//   //console.log('Authorization Header:', auth); // Debugging line
//   if (!auth) { // nothing to see here
//     next();
//   } else if (auth.startsWith(prefix)) {
//     const token = auth.slice(prefix.length);
//     //console.log('Token:', token); // Debugging line
   
//     try {
//       const id = jwt.verify(token, JWT_SECRET);
//       console.log('Decoded ID:', id); // Debugging line

//       if (id.id) {
//         req.user = await User.findById(id.id);
//         console.log('User found:', req.user); // Debugging line
//         // Ensure req.user is set if using tokenAuth middleware
//         next();
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   } else {
//     next({
//       name: 'AuthorizationHeaderError',
//       message: `Authorization token must start with ${ prefix }`
//     }); 
//   }
// });


server.use('/api', apiRouter);

server.listen(EXPPORT, () => {
    console.log(`Server is running on port ${EXPPORT}`);
});
