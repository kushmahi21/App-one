const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'], 
    trim: true,
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  imageUrl: { 
    type: String, 
    default: null 
  },
  imageId: {
    type: String,
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // If you plan to add user authentication later
    required: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Optional: Add a virtual to check if post has an image
PostSchema.virtual('hasImage').get(function() {
  return !!this.imageUrl;
});

// Optional: Add text search index
PostSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', PostSchema);