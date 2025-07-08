const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const fishSchema = new Schema({
    species: String,
    scientificName: String,
    location: String,
}, {
    timestamps: true       // Automatically manage createdAt and updatedAt fields
});


module.exports = mongoose.model('Fish', fishSchema);