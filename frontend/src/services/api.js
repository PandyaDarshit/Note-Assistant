// frontend/src/services/api.js

import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  // The base URL is read from environment variables, with a fallback for local development
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle request configuration
api.interceptors.request.use(
  (config) => {
    // You can add authentication headers or other request modifications here
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle responses and errors consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // The server responded with an error status (4xx, 5xx)
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response received
      console.error('Request error:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Define API methods for different operations
export const noteApi = {
  // Create a new study note
  createNote: (data) => api.post('/notes', data),
  
  // Get a specific note by ID
  getNote: (id) => api.get(`/notes/${id}`),
  
  // Get list of notes with pagination
  getNotes: (page = 1, limit = 10) => 
    api.get('/notes', { 
      params: { 
        skip: (page - 1) * limit, 
        limit 
      } 
    }),
};

export default api;