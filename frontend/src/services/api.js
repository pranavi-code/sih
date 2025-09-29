import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Response Error:', error);
    if (error.response) {
      const message = error.response.data?.detail || error.response.data?.message || 'Server error';
      throw new Error(`${error.response.status}: ${message}`);
    } else if (error.request) {
      throw new Error('Network error - please check your connection');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Enhancement API endpoints
export const enhancementAPI = {
  processEnhancement: async (file, param1 = 0.5, param2 = true) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('param1', param1);
    formData.append('param2', param2);

    // Only return response, not response.data
    return await apiClient.post('/enhance', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getEnhancedImage: async (filename) => {
    // For blobs, don't use response interceptor
    const response = await apiClient.get(`/enhanced/${filename}`, { responseType: 'blob' });
    return response;
  },
};

// Detection API endpoints
export const detectionAPI = {
  processDetection: async (file, param1 = 0.5, param2 = true) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('param1', param1);
    formData.append('param2', param2);

    return await apiClient.post('/detection', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getDetectedImage: async (filename) => {
    const response = await apiClient.get(`/detected/${filename}`, { responseType: 'blob' });
    return response;
  },
};

// Dashboard API endpoints
export const dashboardAPI = {
  getDashboardStats: async () => await apiClient.get('/dashboard/stats'),
  getRecentActivities: async () => await apiClient.get('/dashboard/activities'),
};

// Model Management API endpoints
export const modelAPI = {
  getModels: async () => await apiClient.get('/models'),
  deployModel: async (modelId) => await apiClient.post(`/models/${modelId}/deploy`),
  updateModel: async (modelId, data) => await apiClient.put(`/models/${modelId}`, data),
};

// Utility functions
export const utils = {
  createImageUrl: (blob) => URL.createObjectURL(blob),
  revokeImageUrl: (url) => URL.revokeObjectURL(url),
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  formatDate: (dateString) => new Date(dateString).toLocaleString(),
  getSeverityColor: (severity) => {
    switch (severity) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#fbc02d';
      case 'low': return '#388e3c';
      default: return '#9e9e9e';
    }
  },
  getMetricColor: (metric, value) => {
    switch (metric) {
      case 'psnr':
        if (value > 30) return '#2e7d32';
        if (value > 25) return '#f57c00';
        return '#d32f2f';
      case 'ssim':
        if (value > 0.9) return '#2e7d32';
        if (value > 0.8) return '#f57c00';
        return '#d32f2f';
      case 'uiqm':
        if (value > 4.0) return '#2e7d32';
        if (value > 3.0) return '#f57c00';
        return '#d32f2f';
      default:
        return '#9e9e9e';
    }
  },
};

export default {
  enhancementAPI,
  detectionAPI,
  dashboardAPI,
  modelAPI,
  utils,
};