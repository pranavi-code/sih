import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Grid, CircularProgress, Alert,
  Slider, FormControlLabel, Switch, Divider, Card, CardMedia,
  TextField, List, ListItem, ListItemText, Chip, Stack
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
  Warning as WarningIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import api from '../services/api';

// Styled components
const DropzoneArea = styled(Paper)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : 'rgba(5, 160, 181, 0.3)'}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: isDragActive ? 'rgba(5, 160, 181, 0.05)' : 'rgba(1, 24, 42, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 200,
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ThreatDetection = () => {
  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  
  // Detection settings
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [nmsThreshold, setNmsThreshold] = useState(0.4);
  const [maxDetections, setMaxDetections] = useState(20);
  const [useEnhanced, setUseEnhanced] = useState(true);
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setSelectedFile(file);
      setError(null);
      setDetectionResult(null);
    } else {
      setError('Please select a valid image file.');
    }
  };
  
  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      setSelectedFile(file);
      setError(null);
      setDetectionResult(null);
    } else {
      setError('Please select a valid image file.');
    }
  };
  
  // Handle detect button click
  const handleDetectClick = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('confidence', confidenceThreshold);
      formData.append('nms_threshold', nmsThreshold);
      formData.append('max_detections', maxDetections);
      formData.append('use_enhanced', useEnhanced);
      
      const response = await api.post('/detection/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        setDetectionResult(response.data);
      } else {
        setError(response.data.error || 'Failed to process image');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred during processing');
      console.error('Detection error:', err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get class color based on threat level
  const getThreatColor = (className) => {
    const threatLevels = {
      'person': '#ff5252',
      'diver': '#ff5252',
      'submarine': '#ff4081',
      'mine': '#f44336',
      'fish': '#4caf50',
      'turtle': '#4caf50',
      'debris': '#ff9800',
    };
    
    return threatLevels[className.toLowerCase()] || '#2196f3';
  };
  
  // Clear selected file
  const handleClearFile = () => {
    setSelectedFile(null);
    setDetectionResult(null);
  };
  
  return (
    <Box sx={{ py: 3 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 700,
          color: "#7ecfff",
          mb: 2,
          letterSpacing: 0.5,
          fontSize: { xs: 28, sm: 36, md: 42 },
        }}
      >
        Underwater Threat Detection
      </Typography>
      
      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          mb: 4,
          color: "text.secondary",
          maxWidth: 800,
          mx: 'auto'
        }}
      >
        Identify potential threats and objects of interest in underwater imagery using state-of-the-art detection models
      </Typography>
      
      <Grid container spacing={3}>
        {/* Left side - Upload and settings */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#05a0b5' }}>
              <SearchIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Upload Image for Analysis
            </Typography>
            
            <DropzoneArea
              isDragActive={isDragActive}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: '#05a0b5', mb: 2, opacity: 0.8 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Drag & drop underwater image
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                or click to select from your computer
              </Typography>
              <Button
                component="label"
                variant="contained"
                sx={{ mb: 2 }}
              >
                Select File
                <VisuallyHiddenInput
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </Button>
              <Typography variant="caption" color="textSecondary">
                Supported: JPEG, PNG, BMP, TIFF (max 10MB)
              </Typography>
            </DropzoneArea>
          </Box>
          
          {selectedFile && (
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </Typography>
              <Button 
                size="small" 
                startIcon={<DeleteIcon />}
                onClick={handleClearFile}
                color="error"
                variant="outlined"
              >
                Clear
              </Button>
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(1, 24, 42, 0.3)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#05a0b5' }}>
              Detection Settings
            </Typography>
            
            <Typography gutterBottom>
              Confidence Threshold: {confidenceThreshold}
            </Typography>
            <Slider
              value={confidenceThreshold}
              onChange={(e, newValue) => setConfidenceThreshold(newValue)}
              min={0.1}
              max={1.0}
              step={0.05}
              sx={{ mb: 3 }}
            />
            
            <Typography gutterBottom>
              NMS Threshold: {nmsThreshold}
            </Typography>
            <Slider
              value={nmsThreshold}
              onChange={(e, newValue) => setNmsThreshold(newValue)}
              min={0.1}
              max={1.0}
              step={0.05}
              sx={{ mb: 3 }}
            />
            
            <Typography gutterBottom>
              Maximum Detections
            </Typography>
            <TextField
              value={maxDetections}
              onChange={(e) => setMaxDetections(parseInt(e.target.value) || 20)}
              type="number"
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              size="small"
              fullWidth
              sx={{ mb: 3 }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={useEnhanced}
                  onChange={(e) => setUseEnhanced(e.target.checked)}
                />
              }
              label="Use enhanced image if available"
              sx={{ mb: 1 }}
            />
          </Paper>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleDetectClick}
            disabled={!selectedFile || isProcessing}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {isProcessing ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              "Detect Threats"
            )}
          </Button>
        </Grid>
        
        {/* Right side - Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: 'rgba(1, 24, 42, 0.3)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#05a0b5' }}>
              Detection Results
            </Typography>
            
            {!detectionResult && !isProcessing && (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <WarningIcon sx={{ fontSize: 48, opacity: 0.6, mb: 2 }} />
                <Typography>
                  No detection results yet. Upload an image and click "Detect Threats".
                </Typography>
              </Box>
            )}
            
            {isProcessing && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress size={48} sx={{ mb: 3 }} />
                <Typography>
                  Analyzing image for potential threats...
                </Typography>
              </Box>
            )}
            
            {detectionResult && (
              <>
                <Card sx={{ mb: 3, backgroundColor: 'transparent' }}>
                  <CardMedia
                    component="img"
                    image={`${api.defaults.baseURL}/detection/image/${detectionResult.detected_image_path.split('/').pop()}`}
                    alt="Detection Results"
                    sx={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                  />
                </Card>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {detectionResult.total_detections} Object{detectionResult.total_detections !== 1 ? 's' : ''} Detected
                </Typography>
                
                {detectionResult.total_detections > 0 ? (
                  <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {detectionResult.detections.map((detection, index) => (
                      <ListItem key={index} divider={index < detectionResult.detections.length - 1}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1">
                                {detection.class}
                              </Typography>
                              <Chip 
                                label={`${(detection.confidence * 100).toFixed(1)}%`}
                                size="small"
                                sx={{ 
                                  backgroundColor: getThreatColor(detection.class),
                                  color: 'white'
                                }} 
                              />
                            </Box>
                          }
                          secondary={`Bounding box: [${detection.bbox.join(', ')}]`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info">
                    No threats or objects detected in this image.
                  </Alert>
                )}
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button 
                    variant="outlined" 
                    href={`${api.defaults.baseURL}/detection/image/${detectionResult.detected_image_path.split('/').pop()}`}
                    target="_blank"
                    download
                  >
                    Download Detection Results
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThreatDetection;