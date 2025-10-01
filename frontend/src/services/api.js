import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for handling multipart form data
api.interceptors.request.use((config) => {
  // Don't modify Content-Type if it's FormData (for file uploads)
  if (config.data instanceof FormData) {
    // Let axios set the correct boundary
    delete config.headers['Content-Type'];
  }
  return config;
});

export default api;