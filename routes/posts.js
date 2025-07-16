const express = require('express');
const postRouter = express.Router({ mergeParams: true });
const Post = require('../db/models/posts');
const catchAsync = require('../utils/catchAsync');
const { requireUser } = require('../utils/requireUser');
const mongoose = require('mongoose');
const escapeRegex = require('../utils/escapeRegex');

///-----------------------------------------------------------------------------------------------------
// Get all posts in the database
postRouter.get('/', requireUser, catchAsync(async (req, res) => {
    const posts = await Post.find({}).populate('author', 'username');
    res.status(200).json(posts);
}));
///-----------------------------------------------------------------------------------------------------
// Add a new post to the database
postRouter.post('/', requireUser, catchAsync(async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.user._id;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    // Check if the post title already exists in the database
    const existingPost = await Post.findOne({ title: new RegExp(`^${escapeRegex(title)}$`, 'i') });

    if (existingPost) {
        return res.status(409).json({ message: 'Post with this title already exists.' });
    }

    // Create and save new post
    const post = new Post({ title, content, author: authorId });
    await post.save();

    res.status(201).json(post);
}));
///-----------------------------------------------------------------------------------------------------

module.exports = postRouter;