const express = require('express');
const fishRouter = express.Router({ mergeParams: true });
const Fish = require('../db/models/fish');
const catchAsync = require('../utils/catchAsync');
const {requireUser} = require('../utils/requireUser');
const mongoose = require('mongoose');


function escapeRegex(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}


///-----------------------------------------------------------------------------------------------------
// Get all fish in the database
fishRouter.get('/', requireUser, catchAsync(async (req, res) => {
    const fish = await Fish.find({});
    res.status(200).json(fish);
}));
///-----------------------------------------------------------------------------------------------------
// Add a new fish to the database
fishRouter.post('/', requireUser, catchAsync(async (req, res) => {
  console.log("Creating fish:", req.body);

  const {  species, scientificName, location } = req.body;
  const userId = req.user._id;


  // Check if the fish species already exists in the database
  const existingFish = await Fish.findOne({ species });
    console.log("Existing fish:", existingFish);

  if (existingFish) {
    return res.status(409).json({ message: 'Fish already exists in the database.' });
  }

  // Create and save new fish
  const fish = new Fish({ species, scientificName, location, userId });
  await fish.save();

  console.log(`Added fish: ${fish.species}`);
  res.status(201).json(fish);
}));
///-----------------------------------------------------------------------------------------------------

// Get fish by species
fishRouter.get('/species/:species', catchAsync(async (req, res) => {
    const { species } = req.params;
    const fish = await Fish.find({ species });
    if (!fish || fish.length === 0) {
        return res.status(404).json({ message: 'No fish found for this species' });
    }
    res.status(200).json(fish);
}));
///-----------------------------------------------------------------------------------------------------

// Get a specific fish by ID
fishRouter.get('/:fishId', catchAsync(async (req, res) => {
    const { fishId } = req.params;
    console.log("Fetching fish with ID:", fishId);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(fishId)) {
        return res.status(400).json({ message: 'Invalid fish ID format' });
    }
    
    console.log("Fetching fish with ID:", fishId);
    const fish = await Fish.findById(fishId);
    console.log("Fish found:", fish);
    
    if (!fish) {
        return res.status(404).json({ message: 'Fish not found' });
    }
    
    res.status(200).json(fish);
}));
///-----------------------------------------------------------------------------------------------------

// Update a fish by ID
fishRouter.put('/:fishId', requireUser, catchAsync(async (req, res) => {
    const { fishId } = req.params;
    const { species, scientificName, location } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(fishId)) {
        return res.status(400).json({ message: 'Invalid fish ID format' });
    }

    const fish = await Fish.findById(fishId);
    if (!fish) {
        return res.status(404).json({ message: 'Fish not found' });
    }

    if (species && species.toLowerCase() !== fish.species.toLowerCase()) {
        const duplicate = await Fish.findOne({
            _id: { $ne: fishId },
            species: new RegExp(`^${escapeRegex(species)}$`, 'i')
        });
        if (duplicate) {
            return res.status(409).json({ message: 'Another fish with this species already exists.' });
        }
    }

    // Update fish properties if provided
    if (species) fish.species = species;
    if (scientificName) fish.scientificName = scientificName;
    if (location) fish.location = location;

    await fish.save();
    res.status(200).json(fish);
}));
///-----------------------------------------------------------------------------------------------------

// Delete a fish by ID
fishRouter.delete('/:fishId', requireUser, catchAsync(async (req, res) => {
    const { fishId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(fishId)) {
        return res.status(400).json({ message: 'Invalid fish ID format' });
    }

    const fish = await Fish.findByIdAndDelete(fishId);
    
    if (!fish) {
        return res.status(404).json({ message: 'Fish not found' });
    }

      // res.status(204).end();
    // Optionally, you can return a message or the deleted fish object
   res.status(200).json({ message: 'Fish deleted successfully', fish });

      console.log(`Deleted fish with ID: ${fishId}`);
}));

module.exports = fishRouter;