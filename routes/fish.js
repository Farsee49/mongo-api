const express = require('express');
const fishRouter = express.Router({ mergeParams: true });
const Fish = require('../db/models/fish');
const catchAsync = require('../utils/catchAsync');
const {requireUser} = require('../utils/requireUser');



fishRouter.get('/', requireUser, catchAsync(async (req, res) => {
    const fish = await Fish.find({});
    res.status(200).json(fish);
}));

// Create a new fish
fishRouter.post('/', requireUser, catchAsync(async (req, res) => {
  console.log("Creating fish:", req.body);

  const { name, species, location } = req.body;
  const userId = req.user._id;

  // Check if the fish already exists for this user
  const existingFish = await Fish.findOne({ name, species, location, userId });

  if (existingFish) {
    return res.status(409).json({ message: 'Fish already exists in the database.' });
  }

  // Create and save new fish
  const fish = new Fish({ name, species, location, userId });
  await fish.save();

  console.log(`Added fish: ${fish.species}`);
  res.status(201).json(fish);
}));

// Get a specific fish by ID
fishRouter.get('/:fishId', requireUser, catchAsync(async (req, res) => {
    const { fishId } = req.params;
    const fish = await Fish.findById(fishId);
    if (!fish) {
        return res.status(404).json({ message: 'Fish not found' });
    }
    res.status(200).json(fish);
}));

// Get fish by species
fishRouter.get('/species/:species', catchAsync(async (req, res) => {
    const { species } = req.params;
    const fish = await Fish.find({ species });
    if (!fish || fish.length === 0) {
        return res.status(404).json({ message: 'No fish found for this species' });
    }
    res.status(200).json(fish);
}));

module.exports = fishRouter;