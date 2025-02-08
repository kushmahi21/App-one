import axios from 'axios';

// const API_URL = 'http://localhost:5000/posts';
const BASE_URL ='https://app-one-cmcb.onrender.com';
const API_URL = `${BASE_URL}/posts`;

export const postService = {
  // Get all posts
  getAllPosts: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      if (postData.image) {
        formData.append('image', postData.image);
      }

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update a post
  updatePost: async (id, postData) => {
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      if (postData.image) {
        formData.append('image', postData.image);
      }

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Get a single post by ID
  getPostById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Delete a post
  deletePost: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};
