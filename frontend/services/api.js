// frontend/src/services/api.js

import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for handling token authentication if needed
api.interceptors.request.use(
  (config) => {
    // You can add authentication headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with an error status
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Request error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const noteApi = {
  // Create a new note
  createNote: (data) => api.post('/notes', data),
  
  // Get a specific note
  getNote: (id) => api.get(`/notes/${id}`),
  
  // Get list of notes with pagination
  getNotes: (page = 1, limit = 10) => 
    api.get('/notes', { params: { skip: (page - 1) * limit, limit } }),
};

export default api;