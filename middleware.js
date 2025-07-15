const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./db/models/users');
const JWT_SECRET = process.env.JWT_SECRET;
const mongoose = require('mongoose');



async function userAuth(req, res, next) {
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
    };
    
    module.exports = {userAuth};