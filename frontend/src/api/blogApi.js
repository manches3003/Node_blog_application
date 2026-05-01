import axios from 'axios';

const API_BASE = '/api';

export const blogApi = {
  // Get all posts
  getAllPosts: async () => {
    const response = await axios.get(`${API_BASE}/posts`);
    return response.data;
  },

  // Get single post by ID
  getPostById: async (id) => {
    const response = await axios.get(`${API_BASE}/posts/${id}`);
    return response.data;
  },

  // Create new post
  createPost: async (postData) => {
    const response = await axios.post(`${API_BASE}/posts`, postData);
    return response.data;
  },

  // Update existing post
  updatePost: async (id, postData) => {
    const response = await axios.put(`${API_BASE}/posts/${id}`, postData);
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    await axios.delete(`${API_BASE}/posts/${id}`);
  },
};
