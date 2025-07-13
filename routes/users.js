const express = require('express');
const userRouter = express.Router({ mergeParams: true });
const User = require('../db/models/users');
const catchAsync = require('../utils/catchAsync');
const tokenAuth = require('../utils/userAuth');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


userRouter.get('/', catchAsync(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
}));


// // Register a new user without bcrypt with JWT
// userRouter.post('/register', catchAsync(async (req, res) => {
//     const { username, password } = req.body;

//     // Validation
//     if (!username || !password) {
//         return res.status(400).send({
//             error: 'Username and password are required',
//             name: 'UserRegistrationError',
//             message: 'Username and password are required'
//         });
//     } 
    
//     if (password.length < 6) {
//         return res.status(400).send({
//             error: 'Password must be at least 6 characters long',
//             name: 'UserRegistrationError',
//             message: 'Password must be at least 6 characters long'
//         });
//     }

//     try {
//         // Check if the username already exists
//         const _user = await User.findOne({ username });
//         if (_user) {
//             return res.status(400).send({
//                 error: 'Username already exists',
//                 name: 'UserRegistrationError',
//                 message: 'Username already exists'
//             });
//         }

//         // Create and save new user
//         const newUser = new User({ username, password });
//         const user = await newUser.save();

//         if (user) {
//             // Create token
//             const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

//             return res.status(201).send({
//                 message: 'User registered successfully',
//                 user: {
//                     id: user._id,
//                     username: user.username
//                 },
//                 token,
//                 success: true
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({
//             error: 'Internal Server Error',
//             name: 'ServerError',
//             message: 'An error occurred during user registration.'
//         });
//     }
// }));

// Register a new user with bcrypt and JWT
const bcrypt = require('bcryptjs');

userRouter.post('/register', catchAsync(async (req, res) => {
    
    const { username, password } = req.body;
console.log('Registering user:', req.body);
    // Validation
    if (!username || !password) {
        return res.status(400).send({
            error: 'Username and password are required',
            name: 'UserRegistrationError',
            message: 'Username and password are required'
        });
    } 
    
    if (password.length < 6) {
        return res.status(400).send({
            error: 'Password must be at least 6 characters long',
            name: 'UserRegistrationError',
            message: 'Password must be at least 6 characters long'
        });
    }

    try {
        // Check if the username already exists
        const _user = await User.findOne({ username });
        if (_user) {
            return res.status(400).send({
                error: 'Username already exists',
                name: 'UserRegistrationError',
                message: 'Username already exists'
            });
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user with the hashed password
        const newUser = new User({ username, password: hashedPassword });
        const user = await newUser.save();

        if (user) {
            // Create token
            const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(201).send({
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    username: user.username
                },
                token,
                success: true
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: 'Internal Server Error',
            name: 'ServerError',
            message: 'An error occurred during user registration.'
        });
    }
}));


//get user by ID

module.exports = userRouter;