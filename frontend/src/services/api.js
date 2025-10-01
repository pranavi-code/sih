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

// Enhancement API
export const enhancementAPI = {
  processEnhancement: async (file, intensity = 0.5, showMetrics = true) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('calculate_metrics', showMetrics.toString());
    
    const response = await api.post('/api/v1/enhance', formData);
    return response.data;
  },
  
  getEnhancedImage: async (filename) => {
    const response = await api.get(`/files/enhanced/${filename}`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  getMetrics: async (imageId) => {
    const response = await api.get(`/api/v1/metrics/image/${imageId}`);
    return response.data;
  },
  
  getHistory: async () => {
    const response = await api.get('/api/v1/enhancement/history');
    return response.data;
  }
};

// Detection API
export const detectionAPI = {
  processDetection: async (file, confidence = 0.5, showMetrics = true) => {
    console.log('🔍 Detection API called with:', { fileName: file?.name, confidence, showMetrics });
    const formData = new FormData();
    formData.append('image', file);
    formData.append('confidence', confidence.toString());
    formData.append('nms_threshold', '0.4');
    formData.append('max_detections', '20');
    formData.append('use_enhanced', 'true');
    
    console.log('📤 Sending FormData to /api/v1/detect');
    const response = await api.post('/api/v1/detect', formData);
    return response.data;
  },
  
  getDetectedImage: async (filename) => {
    const response = await api.get(`/files/detected/${filename}`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  getDetectionHistory: async () => {
    const response = await api.get('/api/v1/detection/history');
    return response.data;
  }
};

// Unified API
export const unifiedAPI = {
  processImage: async (formData) => {
    const response = await api.post('/api/v1/process', formData);
    return response.data;
  },
  getProcessingHistory: async () => {
    const response = await api.get('/api/v1/unified/history');
    return response.data;
  }
};

// Model API
export const modelAPI = {
  getAvailableModels: async () => {
    const response = await api.get('/api/v1/models/available');
    return response.data;
  },
  
  getInstalledModels: async () => {
    const response = await api.get('/api/v1/models/installed');
    return response.data;
  },
  
  getModels: async () => {
    const response = await api.get('/api/v1/models/list');
    return response.data;
  },
  
  deployModel: async (modelData) => {
    const response = await api.post('/api/v1/models/deploy', modelData);
    return response.data;
  },
  
  getModelMetrics: async (modelId) => {
    const response = await api.get(`/api/v1/models/${modelId}/metrics`);
    return response.data;
  }
};

// Utility functions
export const utils = {
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  formatTimestamp: (timestamp) => {
    return new Date(timestamp).toLocaleString();
  },
  
  formatDate: (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  },
  
  formatDuration: (seconds) => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = (seconds % 60).toFixed(0);
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  },
  
  formatMetrics: (metrics) => {
    if (!metrics) return {};
    return {
      psnr: metrics.psnr ? metrics.psnr.toFixed(2) : 'N/A',
      ssim: metrics.ssim ? metrics.ssim.toFixed(3) : 'N/A',
      uiqm: metrics.uiqm ? metrics.uiqm.toFixed(3) : 'N/A'
    };
  },
  
  getImagePreview: (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  },

  createImageUrl: (blob) => {
    return URL.createObjectURL(blob);
  },

  revokeImageUrl: (url) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  },
  
  formatConfidence: (confidence) => {
    return `${(confidence * 100).toFixed(1)}%`;
  },

  getConfidenceColor: (confidence) => {
    // Color coding for detection confidence
    if (confidence >= 0.8) return '#4caf50'; // High confidence (green)
    if (confidence >= 0.6) return '#8bc34a'; // Good confidence (light green) 
    if (confidence >= 0.4) return '#ffeb3b'; // Medium confidence (yellow)
    if (confidence >= 0.2) return '#ff9800'; // Low confidence (orange)
    return '#f44336'; // Very low confidence (red)
  },
  
  getThreatSeverity: (threatType) => {
    const severityMap = {
      'submarine': 'critical',
      'mine': 'critical',
      'diver': 'high',
      'drone': 'high',
      'suspicious_object': 'medium',
      'unknown': 'low'
    };
    return severityMap[threatType] || 'low';
  },
  
  getSeverityColor: (severity) => {
    const colorMap = {
      'critical': '#f44336',
      'high': '#ff9800',
      'medium': '#ffeb3b',
      'low': '#4caf50'
    };
    return colorMap[severity] || '#9e9e9e';
  },

  getMetricColor: (metricType, value) => {
    // Color coding for different quality metrics
    if (metricType === 'psnr') {
      // PSNR: Higher is better (dB)
      if (value >= 30) return '#4caf50'; // Excellent (green)
      if (value >= 25) return '#8bc34a'; // Good (light green)
      if (value >= 20) return '#ffeb3b'; // Fair (yellow)
      if (value >= 15) return '#ff9800'; // Poor (orange)
      return '#f44336'; // Bad (red)
    } else if (metricType === 'ssim') {
      // SSIM: Higher is better (0-1)
      if (value >= 0.8) return '#4caf50'; // Excellent
      if (value >= 0.6) return '#8bc34a'; // Good
      if (value >= 0.4) return '#ffeb3b'; // Fair
      if (value >= 0.2) return '#ff9800'; // Poor
      return '#f44336'; // Bad
    } else if (metricType === 'uiqm') {
      // UIQM: Higher is better (underwater specific)
      if (value >= 0.8) return '#4caf50'; // Excellent
      if (value >= 0.6) return '#8bc34a'; // Good
      if (value >= 0.4) return '#ffeb3b'; // Fair
      if (value >= 0.2) return '#ff9800'; // Poor
      return '#f44336'; // Bad
    }
    return '#9e9e9e'; // Default gray
  },

  getMetricLabel: (metricType, value) => {
    if (metricType === 'psnr') {
      if (value >= 30) return 'Excellent';
      if (value >= 25) return 'Good';
      if (value >= 20) return 'Fair';
      if (value >= 15) return 'Poor';
      return 'Bad';
    } else if (metricType === 'ssim') {
      if (value >= 0.8) return 'Excellent';
      if (value >= 0.6) return 'Good';
      if (value >= 0.4) return 'Fair';
      if (value >= 0.2) return 'Poor';
      return 'Bad';
    } else if (metricType === 'uiqm') {
      if (value >= 0.8) return 'Excellent';
      if (value >= 0.6) return 'Good';
      if (value >= 0.4) return 'Fair';
      if (value >= 0.2) return 'Poor';
      return 'Bad';
    }
    return 'Unknown';
  },

  // Helper for processing status
  getProcessingStatus: (isProcessing, hasResult, hasError) => {
    if (hasError) return { status: 'error', color: '#f44336', text: 'Error' };
    if (isProcessing) return { status: 'processing', color: '#ff9800', text: 'Processing...' };
    if (hasResult) return { status: 'completed', color: '#4caf50', text: 'Completed' };
    return { status: 'idle', color: '#9e9e9e', text: 'Ready' };
  },

  // Format processing time
  formatProcessingTime: (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    const duration = (new Date(endTime) - new Date(startTime)) / 1000;
    return `${duration.toFixed(2)}s`;
  },

  // Debug function to test API connectivity
  testConnection: async () => {
    try {
      const response = await api.get('/');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  validateImageFile: (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG, BMP, or TIFF files.');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 50MB.');
    }
    
    return true;
  },
  
  generateImageUrl: (imagePath) => {
    return `${baseURL}/files/${imagePath}`;
  },

  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    // Handle different path formats
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/files/')) return `${baseURL}${imagePath}`;
    if (imagePath.startsWith('detected/') || imagePath.startsWith('enhanced/')) {
      return `${baseURL}/files/${imagePath}`;
    }
    // If it's just a filename, assume it's from detected folder
    if (!imagePath.includes('/')) {
      return `${baseURL}/files/detected/${imagePath}`;
    }
    return `${baseURL}/files/${imagePath}`;
  },
  
  downloadFile: async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },

  // Download enhanced image
  downloadEnhancedImage: async (imagePath, originalFileName) => {
    const filename = imagePath.split('/').pop();
    const downloadName = `enhanced_${originalFileName || filename}`;
    const url = `${baseURL}/files/enhanced/${filename}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  // Download detected/annotated image
  downloadDetectedImage: async (imagePath, originalFileName) => {
    const filename = imagePath.split('/').pop();
    const downloadName = `detected_${originalFileName || filename}`;
    const url = `${baseURL}/files/detected/${filename}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  // Download results as JSON
  downloadResults: async (results, originalFileName, type = 'results') => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${originalFileName?.replace(/\.[^.]+$/, '') || 'results'}_${type}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export default api;