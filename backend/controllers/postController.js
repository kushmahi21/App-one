const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Check if file was uploaded
    const imageData = req.file ? {
      imageUrl: req.file.path,
      imageId: req.file.filename
    } : {};

    const newPost = new Post({
      title,
      content,
      ...imageData
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.id;

    // Find the existing post
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Prepare update data
    const updateData = { title, content };

    // Handle image update
    if (req.file) {
      // If there was a previous image, delete it from Cloudinary
      if (existingPost.imageId) {
        try {
          await cloudinary.uploader.destroy(existingPost.imageId);
        } catch (cloudinaryError) {
          console.log('Could not delete previous image from Cloudinary', cloudinaryError);
        }
      }

      // Add new image details
      updateData.imageUrl = req.file.path;
      updateData.imageId = req.file.filename;
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId, 
      updateData, 
      { new: true, runValidators: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    
    // Delete image from Cloudinary if exists
    if (deletedPost.imageId) {
      try {
        await cloudinary.uploader.destroy(deletedPost.imageId);
      } catch (cloudinaryError) {
        console.log('Could not delete image from Cloudinary', cloudinaryError);
      }
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};