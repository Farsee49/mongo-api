const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { User } = require('./users'); // Adjust path as needed


const fishSchema = new Schema({
    species: {
        type: String,
        required: true,
        trim: true
    },
    scientificName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },

    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true       // Automatically manage createdAt and updatedAt fields
});


module.exports = mongoose.model('Fish', fishSchema);