const express = require('express');
const fishRouter = express.Router({ mergeParams: true });
const Fish = require('../db/models/fish');
const catchAsync = require('../utils/catchAsync');

// Get all fish

fishRouter.get('/', catchAsync(async (req, res) => {
    const fish = await Fish.find({});
    res.status(200).json(fish);
}));

// Create a new fish

fishRouter.post('/', catchAsync(async (req, res) => {
    const fish = new Fish(req.body);
    await fish.save();
    res.status(201).json(fish);
    console.log(`Added fish: ${fish.species}`);
}));


module.exports = fishRouter;