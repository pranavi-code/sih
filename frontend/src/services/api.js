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
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || error.response.data?.message || 'Server error';
      throw new Error(`${error.response.status}: ${message}`);
    } else if (error.request) {
      // Network error
      throw new Error('Network error - please check your connection');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Dashboard API endpoints
export const dashboardAPI = {
  getDashboardOverview: () => apiClient.get('/dashboard'),
  getSystemStatus: () => apiClient.get('/system_status'),
  getRecentOperations: (limit = 50) => apiClient.get(`/recent_operations?limit=${limit}`),
  getAlerts: (status = null) => apiClient.get(`/alerts${status ? `?status=${status}` : ''}`),
  acknowledgeAlert: (alertId) => apiClient.post(`/alerts/${alertId}/acknowledge`),
  getConfiguration: () => apiClient.get('/configuration'),
  exportData: (dataType, dateRange = '7_days') => 
    apiClient.post('/export_data', { data_type: dataType, date_range: dateRange }),
};

// Enhancement API endpoints
export const enhancementAPI = {
  enhanceImage: (file, calculateMetrics = true) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('calculate_metrics', calculateMetrics);
    
    return apiClient.post('/enhance', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  batchEnhance: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return apiClient.post('/batch_enhance', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getEnhancedImage: (filename) => apiClient.get(`/enhanced/${filename}`, {
    responseType: 'blob',
  }),
  
  getEnhancementHistory: () => apiClient.get('/enhancement_history'),
};

// Detection API endpoints
export const detectionAPI = {
  detectThreats: (file, confidenceThreshold = 0.5) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('confidence_threshold', confidenceThreshold);
    
    return apiClient.post('/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  analyzeThreats: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return apiClient.post('/analyze_threats', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getDetectedImage: (filename) => apiClient.get(`/detected/${filename}`, {
    responseType: 'blob',
  }),
  
  getThreatStatistics: () => apiClient.get('/threat_statistics'),
  getDetectionHistory: () => apiClient.get('/detection_history'),
  getThreatTypes: () => apiClient.get('/threat_types'),
};

// Metrics API endpoints
export const metricsAPI = {
  getQualityMetrics: () => apiClient.get('/quality_metrics'),
  getPerformanceDashboard: () => apiClient.get('/performance_dashboard'),
  getMetricsHistory: (days = 7) => apiClient.get(`/metrics_history?days=${days}`),
  getComparisonReport: () => apiClient.get('/comparison_report'),
  getBenchmarkResults: () => apiClient.get('/benchmark_results'),
};

// Unified processing API endpoints
export const unifiedAPI = {
  processUnified: (file, confidenceThreshold = 0.5, calculateMetrics = true) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('confidence_threshold', confidenceThreshold);
    formData.append('calculate_metrics', calculateMetrics);
    
    return apiClient.post('/process_unified', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  processBatchUnified: (files, confidenceThreshold = 0.5) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('confidence_threshold', confidenceThreshold);
    
    return apiClient.post('/process_batch_unified', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getProcessingStats: () => apiClient.get('/processing_stats'),
  getModelStatus: () => apiClient.get('/model_status'),
};

// Model management API endpoints
export const modelAPI = {
  getAvailableModels: () => apiClient.get('/models/available'),
  getModelDetails: (modelId) => apiClient.get(`/models/model/${modelId}`),
  downloadModel: (modelId, deviceType = 'gpu_server') => 
    apiClient.post(`/models/download/${modelId}?device_type=${deviceType}`),
  getDownloadStatus: (downloadId) => apiClient.get(`/models/download/status/${downloadId}`),
  getInstalledModels: () => apiClient.get('/models/installed'),
  uninstallModel: (modelId, deviceType = 'all') => 
    apiClient.delete(`/models/installed/${modelId}?device_type=${deviceType}`),
  getDeviceCompatibility: (deviceType) => apiClient.get(`/models/device_compatibility/${deviceType}`),
  optimizeModel: (modelId, deviceType) => 
    apiClient.post(`/models/optimize/${modelId}?device_type=${deviceType}`),
};

// Main processing endpoint (legacy)
export const processAPI = {
  processImage: (file, enhanceOnly = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('enhance_only', enhanceOnly);
    
    return apiClient.post('/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Utility functions
export const utils = {
  // Convert blob to URL for image display
  createImageUrl: (blob) => {
    return URL.createObjectURL(blob);
  },
  
  // Clean up blob URLs
  revokeImageUrl: (url) => {
    URL.revokeObjectURL(url);
  },
  
  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // Format date
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleString();
  },
  
  // Get severity color
  getSeverityColor: (severity) => {
    switch (severity) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#fbc02d';
      case 'low': return '#388e3c';
      default: return '#9e9e9e';
    }
  },
  
  // Get metric color based on value
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
  dashboardAPI,
  enhancementAPI,
  detectionAPI,
  metricsAPI,
  unifiedAPI,
  modelAPI,
  processAPI,
  utils,
};