const express = require('express');
const userRouter = express.Router({ mergeParams: true });
const User = require('../db/models/users');
const catchAsync = require('../utils/catchAsync');

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

// Login user with bcrypt and JWT
userRouter.post('/login', catchAsync(async (req, res) => {
    const { username, password } = req.body;
    console.log('Logging in user:', req.body); // Remove this in production

    if (!username || !password) {
        return res.status(400).send({
            error: 'Username and password are required',
            name: 'UserLoginError',
            message: 'Username and password are required',
            success: false
        });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({
                error: 'Invalid credentials',
                name: 'AuthenticationError',
                message: 'Username or password is incorrect',
                success: false
            });
        }
        
        req.user = user;  // Ensure req.user is set if using tokenAuth middleware
        //console.log('User found:', user, 'RU', req.user); // Debugging line, remove in production
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                error: 'Invalid credentials',
                name: 'AuthenticationError',
                message: 'Username or password is incorrect',
                success: false
            });
        }

        if (req.user ) {

        // Create JWT token with expiration (1 hour)
        const token = jwt.sign({ id: user._id, username: user.username, req: { user } }, JWT_SECRET, { expiresIn: '1h' });
        //console.log(token,'TOKEN'); // Debugging line, remove in production

        return res.status(200).send({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                
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
            message: 'An error occurred during login.',
            success: false
        });
    }
    next();

}));

//get user by ID

module.exports = userRouter;