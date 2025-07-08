const express = require('express');
const fishRouter = express.Router({ mergeParams: true });
const Fish = require('../db/models/fish');
const catchAsync = require('../utils/catchAsync');

// Get all fish

fishRouter.get('/', catchAsync(async (req, res) => {
    const fish = await Fish.find({});
    res.status(200).json(fish);
}));





module.exports = fishRouter;