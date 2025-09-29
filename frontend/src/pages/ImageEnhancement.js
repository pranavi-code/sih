import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  LinearProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  PhotoCamera as PhotoCameraIcon,
  Download as DownloadIcon,
  Compare as CompareIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { enhancementAPI, utils } from '../services/api';

const ImageEnhancement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setResults(null);
      setError(null);
      
      // Create preview URL for original image
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
      
      // Clean up enhanced image URL
      if (enhancedImageUrl) {
        URL.revokeObjectURL(enhancedImageUrl);
        setEnhancedImageUrl(null);
      }
    }
  }, [enhancedImageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleEnhanceImage = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError(null);

    try {
      const result = await enhancementAPI.processEnhancement(selectedFile, 0.5, true);
      setResults(result);

      // Get enhanced image
      if (result?.enhanced_image) {
        const filename = result.enhanced_image.replace(/\\/g, '/').split('/').pop();
        const blob = await enhancementAPI.getEnhancedImage(filename);
        const url = utils.createImageUrl(blob);
        setEnhancedImageUrl(url);
      }
    } catch (err) {
      setError(err.message || 'Enhancement failed');
      console.error('Enhancement error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!results?.enhanced_image) return;

    try {
      const filename = results.enhanced_image.replace(/\\/g, '/').split('/').pop();
      const blob = await enhancementAPI.getEnhancedImage(filename);
      
      // Create download link
      const url = utils.createImageUrl(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enhanced_${selectedFile?.name || 'image.jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      utils.revokeImageUrl(url);
    } catch (err) {
      setError('Download failed: ' + err.message);
    }
  };

  const getMetricColor = (metric, value) => {
    return utils.getMetricColor(metric, value);
  };

  const getMetricStatus = (metric, value) => {
    switch (metric) {
      case 'psnr':
        if (value > 30) return 'Excellent';
        if (value > 25) return 'Good';
        if (value > 20) return 'Acceptable';
        return 'Poor';
      case 'ssim':
        if (value > 0.9) return 'Excellent';
        if (value > 0.8) return 'Good';
        if (value > 0.7) return 'Acceptable';
        return 'Poor';
      case 'uiqm':
        if (value > 4.0) return 'Excellent';
        if (value > 3.0) return 'Good';
        if (value > 2.0) return 'Acceptable';
        return 'Poor';
      default:
        return 'Unknown';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Underwater Image Enhancement
      </Typography>

      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Upload Image
              </Typography>
              
              <Paper
                {...getRootProps()}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  or click to select from your computer
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: JPEG, PNG, BMP, TIFF (max 10MB)
                </Typography>
              </Paper>

              {selectedFile && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <strong>Selected:</strong> {selectedFile.name} ({utils.formatFileSize(selectedFile.size)})
                  </Alert>
                  
                  <Button
                    variant="contained"
                    onClick={handleEnhanceImage}
                    disabled={processing}
                    startIcon={<PhotoCameraIcon />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {processing ? 'Enhancing...' : 'Enhance Image'}
                  </Button>

                  {processing && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress />
                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        Processing image with GAN model...
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          {results && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Enhancement Results
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`Status: ${results.status}`} 
                    color="success" 
                    sx={{ mr: 1 }} 
                  />
                  <Chip 
                    label={`Processed: ${utils.formatDate(results.timestamp)}`} 
                    variant="outlined" 
                  />
                </Box>

                {results.quality_metrics && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Quality Metrics
                    </Typography>
                    
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Metric</strong></TableCell>
                            <TableCell><strong>Value</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(results.quality_metrics).map(([metric, value]) => (
                            <TableRow key={metric}>
                              <TableCell>
                                {metric.toUpperCase()}
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  sx={{ 
                                    color: getMetricColor(metric, value),
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {typeof value === 'number' ? value.toFixed(2) : value}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={getMetricStatus(metric, value)}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: getMetricColor(metric, value),
                                    color: 'white'
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                <Button
                  variant="outlined"
                  onClick={handleDownload}
                  disabled={!results?.enhanced_image}
                  startIcon={<DownloadIcon />}
                  fullWidth
                >
                  Download Enhanced Image
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Image Comparison */}
        {originalImageUrl && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  <CompareIcon sx={{ mr: 1 }} />
                  Image Comparison
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Original Image
                      </Typography>
                      <Box
                        component="img"
                        src={originalImageUrl}
                        alt="Original"
                        sx={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: 400,
                          objectFit: 'contain',
                          borderRadius: 1,
                        }}
                      />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Enhanced Image
                      </Typography>
                      {enhancedImageUrl ? (
                        <Box
                          component="img"
                          src={enhancedImageUrl}
                          alt="Enhanced"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 400,
                            objectFit: 'contain',
                            borderRadius: 1,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: 400,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'grey.100',
                            borderRadius: 1,
                          }}
                        >
                          <Typography color="text.secondary">
                            {processing ? 'Processing...' : 'Enhanced image will appear here'}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Information Panel */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <AnalyticsIcon sx={{ mr: 1 }} />
                Enhancement Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    PSNR (Peak Signal-to-Noise Ratio)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Measures image quality by comparing pixel differences. Higher values indicate better quality.
                    • &gt;30 dB: Excellent • 25-30 dB: Good • 20-25 dB: Acceptable • &lt;20 dB: Poor
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    SSIM (Structural Similarity Index)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Evaluates perceived image quality based on luminance, contrast, and structure.
                    • &gt;0.9: Excellent • 0.8-0.9: Good • 0.7-0.8: Acceptable • &lt;0.7: Poor
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    UIQM (Underwater Image Quality Measure)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Specialized metric for underwater image quality assessment.
                    • &gt;4.0: Excellent • 3.0-4.0: Good • 2.0-3.0: Acceptable • &lt;2.0: Poor
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageEnhancement;