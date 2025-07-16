
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');


const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
 }, {
        timestamps: true // Automatically manage createdAt and updatedAt fields
     });

module.exports = mongoose.model('Post', postSchema);