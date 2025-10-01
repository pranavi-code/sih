import React, { useState, useCallback, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Fade,
  Slide,
  Zoom,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Security as SecurityIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { detectionAPI, utils } from '../services/api';

const ThreatDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [detectedImageUrl, setDetectedImageUrl] = useState(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setResults(null);
      setError(null);
      
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
      
      if (detectedImageUrl) {
        URL.revokeObjectURL(detectedImageUrl);
        setDetectedImageUrl(null);
      }
    }
  }, [detectedImageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const handleDetectThreats = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError(null);

    try {
      // Call detection API with individual parameters
      const result = await detectionAPI.processDetection(selectedFile, confidenceThreshold, true);
      console.log("Detection API result:", result);
      setResults(result);

      // Handle the annotated image if available
      if (result.detected_image_path || result.detected_image_url || result.annotated_image) {
        let imagePath = result.detected_image_path || result.detected_image_url || result.annotated_image;
        console.log("Got detected image path:", imagePath);
        
        // Extract the filename
        const filename = imagePath.replace(/\\/g, '/').split('/').pop();
        console.log("Extracted filename:", filename);
        
        try {
          // Try to get the image directly as a blob
          const blob = await detectionAPI.getDetectedImage(filename);
          if (blob) {
            const url = URL.createObjectURL(blob);
            console.log("Created URL from blob:", url);
            setDetectedImageUrl(url);
          } else {
            // Fallback to direct URL
            const directUrl = utils.getImageUrl(imagePath);
            console.log("Using direct URL:", directUrl);
            setDetectedImageUrl(directUrl);
          }
        } catch (err) {
          console.error("Error getting detected image:", err);
          // Final fallback
          setDetectedImageUrl(utils.getImageUrl(imagePath));
        }
      }
    } catch (err) {
      setError(err.message || 'Detection failed');
      console.error('Detection error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const getSeverityColor = (severity) => {
    return utils.getSeverityColor(severity);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <ErrorIcon sx={{ color: '#d32f2f' }} />;
      case 'high': return <WarningIcon sx={{ color: '#f57c00' }} />;
      case 'medium': return <WarningIcon sx={{ color: '#fbc02d' }} />;
      case 'low': return <CheckCircleIcon sx={{ color: '#388e3c' }} />;
      default: return <CheckCircleIcon sx={{ color: '#9e9e9e' }} />;
    }
  };

  useEffect(() => {
    if (detectedImageUrl) {
      console.log("Detected image URL set:", detectedImageUrl);
      
      // Test if the URL is valid
      const img = new Image();
      img.onload = () => console.log("Image loaded successfully");
      img.onerror = (e) => console.error("Error loading image:", e);
      img.src = detectedImageUrl;
    }
  }, [detectedImageUrl]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      color: '#fff', 
      bgcolor: 'transparent', 
      px: 2, 
      py: 0,
      position: 'relative'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(126,207,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(63,120,199,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }
      }} />

      {/* Hero Section */}
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            width: '100%',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            pt: 2
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              color: "#7ecfff",
              mb: 2,
              letterSpacing: 1.5,
              fontSize: { xs: 28, sm: 38, md: 44 },
              animation: 'textGlow 3s ease-in-out infinite alternate',
              '@keyframes textGlow': {
                '0%': { textShadow: '0 0 20px #7ecfff40' },
                '100%': { textShadow: '0 0 30px #7ecfff80, 0 0 40px #7ecfff40' }
              }
            }}
          >
            🚨 Maritime Threat Detection
          </Typography>
          <Typography
            align="center"
            sx={{
              color: '#dbe9ff',
              mb: 4,
              maxWidth: 600,
              fontSize: 18,
              animation: 'fadeInUp 1s ease-out 0.5s both'
            }}
          >
            AI-powered threat detection for underwater surveillance and maritime security
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Slide direction="right" in={true} timeout={1200}>
            <Card sx={{ 
              bgcolor: '#b84b59', 
              color: '#fff',
              borderRadius: 3,
              boxShadow: '0 15px 35px rgba(184,75,89,0.3)',
              border: '1px solid rgba(126,207,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 20px 45px rgba(184,75,89,0.4)',
                transform: 'translateY(-2px)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <SecurityIcon sx={{ 
                    animation: selectedFile ? 'bounce 1s' : 'none'
                  }} />
                  Upload Image for Threat Analysis
                </Typography>
                
                {!selectedFile ? (
                  <Paper
                    {...getRootProps()}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      border: '2px dashed',
                      borderColor: isDragActive ? '#7ecfff' : 'rgba(126,207,255,0.3)',
                      backgroundColor: isDragActive ? '#22335b' : '#162b4d',
                      color: '#fff',
                      cursor: 'pointer',
                      borderRadius: 2,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: '#7ecfff',
                        backgroundColor: '#22335b',
                        transform: 'scale(1.02)',
                        '&::before': {
                          opacity: 1
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(126,207,255,0.1) 0%, rgba(63,120,199,0.1) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }
                    }}
                  >
                    <input {...getInputProps()} />
                    <CloudUploadIcon sx={{ 
                      fontSize: 48, 
                      color: '#7ecfff', 
                      mb: 2,
                      animation: isDragActive ? 'bounce 0.6s infinite' : 'none'
                    }} />
                    <Typography variant="h6" gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
                      {isDragActive ? 'Drop the image here' : 'Drag & drop underwater image'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#bcdcff', position: 'relative', zIndex: 1 }} gutterBottom>
                      or click to select from your computer
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#bcdcff', position: 'relative', zIndex: 1 }}>
                      Supported: JPEG, PNG, BMP, TIFF (max 10MB)
                    </Typography>
                  </Paper>
                ) : (
                  <Paper sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 2,
                    backgroundColor: '#162b4d',
                    border: '2px solid #7ecfff'
                  }}>
                    <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Selected" 
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          borderRadius: '8px',
                          objectFit: 'contain'
                        }}
                      />
                      <IconButton
                        onClick={() => setSelectedFile(null)}
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          backgroundColor: '#f44336',
                          color: 'white',
                          '&:hover': { backgroundColor: '#d32f2f' }
                        }}
                        size="small"
                      >
                        ✕
                      </IconButton>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#bcdcff' }}>
                      <strong>Selected:</strong> {selectedFile.name} ({utils.formatFileSize(selectedFile.size)})
                    </Typography>
                  </Paper>
                )}

                {selectedFile && (
                  <Fade in={Boolean(selectedFile)} timeout={800}>
                    <Box sx={{ mt: 2 }}>
                      
                      <Button
                        variant="contained"
                        onClick={handleDetectThreats}
                        disabled={processing}
                        startIcon={<SecurityIcon />}
                        fullWidth
                        size="large"
                        sx={{ 
                          mb: 2, 
                          py: 1.5,
                          background: 'linear-gradient(45deg, #d32f2f 30%, #b71c1c 100%)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #b71c1c 30%, #d32f2f 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(211,47,47,0.3)'
                          },
                          '&:disabled': {
                            background: '#333'
                          }
                        }}
                      >
                        {processing ? 'Analyzing...' : 'Detect Threats'}
                      </Button>

                      {processing && (
                        <Fade in={processing}>
                          <Box sx={{ mt: 2 }}>
                            <LinearProgress 
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(126,207,255,0.2)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: '#7ecfff',
                                  animation: 'pulse 1.5s ease-in-out infinite'
                                }
                              }}
                            />
                            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', animation: 'fadeInOut 2s infinite' }}>
                              Scanning for maritime threats with YOLO v11...
                            </Typography>
                          </Box>
                        </Fade>
                      )}
                    </Box>
                  </Fade>
                )}

                {error && (
                  <Slide direction="up" in={Boolean(error)}>
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  </Slide>
                )}
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          {results ? (
            <Slide direction="left" in={Boolean(results)} timeout={1200}>
              <Card sx={{ 
                bgcolor: '#559965',
                color: '#fff',
                borderRadius: 3,
                boxShadow: '0 15px 35px rgba(85,153,101,0.3)',
                border: '1px solid rgba(126,207,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 45px rgba(85,153,101,0.4)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                    <CheckCircleIcon sx={{ mr: 1, animation: 'checkPulse 2s infinite' }} />
                    Detection Complete! 🔍
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Zoom in={true} timeout={800}>
                      <Paper sx={{ 
                        p: 2, 
                        minWidth: 200, 
                        flex: '1 1 220px', 
                        bgcolor: '#1f3c70', 
                        color: '#fff',
                        borderRadius: 2,
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <SecurityIcon sx={{ color: results.total_detections > 0 ? '#ff6b6b' : '#51cf66' }} />
                          <Typography sx={{ fontWeight: 'bold' }}>Overview</Typography>
                        </Box>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 'bold', 
                          mb: 0.5,
                          color: results.total_detections > 0 ? '#ff6b6b' : '#51cf66'
                        }}>
                          {results.total_detections || 0}
                        </Typography>
                        <Typography variant="caption" color="#bcdcff">
                          {results.total_detections > 0 ? '⚠️ Threats Detected' : '✅ No Threats Found'}
                        </Typography>
                      </Paper>
                    </Zoom>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        const payload = {
                          metadata: { created_at: new Date().toISOString(), filename: selectedFile?.name || 'image' },
                          total_detections: results.total_detections || 0,
                          threat_summary: results.threat_summary || {},
                          detections: results.detections || [],
                        };
                        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${(selectedFile?.name || 'results').replace(/\.[^.]+$/, '')}_detection.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      sx={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      Download Report
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      disabled={!results?.annotated_image}
                      onClick={async () => {
                        const filename = (results?.annotated_image || '').replace(/\\/g, '/').split('/').pop();
                        if (!filename) return;
                        const blob = await detectionAPI.getDetectedImage(filename);
                        const url = utils.createImageUrl(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      sx={{
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.5)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                          borderColor: '#fff'
                        }
                      }}
                    >
                      Download Annotated Image
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          ) : (
            <Fade in={!results}>
              <Card sx={{ 
                bgcolor: 'rgba(31,60,112,0.3)', 
                color: '#fff',
                borderRadius: 3,
                border: '2px dashed rgba(126,207,255,0.3)',
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <SecurityIcon sx={{ 
                    fontSize: 64, 
                    color: 'rgba(126,207,255,0.5)', 
                    mb: 2,
                    animation: 'float 3s ease-in-out infinite'
                  }} />
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Threat analysis results will appear here
                  </Typography>
                </Box>
              </Card>
            </Fade>
          )}
        </Grid>

        {/* Detailed Detection Results */}
        {results && results.detections && results.detections.length > 0 && (
          <Grid item xs={12}>
            <Slide direction="up" in={true} timeout={1500}>
              <Card sx={{
                bgcolor: '#162b4d',
                color: '#fff',
                borderRadius: 3,
                boxShadow: '0 15px 35px rgba(22,43,77,0.3)',
                border: '1px solid rgba(126,207,255,0.2)'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 3
                  }}>
                    <SecurityIcon sx={{ color: '#ff6b6b', animation: 'shake 2s infinite' }} />
                    🚨 Detected Maritime Threats
                  </Typography>
                  
                  <TableContainer component={Paper} sx={{ 
                    backgroundColor: 'rgba(31,60,112,0.5)',
                    borderRadius: 2
                  }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ '& th': { color: '#7ecfff', fontWeight: 'bold' } }}>
                          <TableCell>Threat Type</TableCell>
                          <TableCell>Confidence</TableCell>
                          <TableCell>Severity</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Size</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.detections.map((detection, index) => (
                          <TableRow 
                            key={index}
                            sx={{ 
                              '& td': { color: '#fff', borderColor: 'rgba(126,207,255,0.1)' },
                              animation: `slideInFromLeft 0.6s ease-out ${index * 0.1}s both`,
                              '&:hover': {
                                backgroundColor: 'rgba(126,207,255,0.1)',
                                transform: 'scale(1.01)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getSeverityIcon(detection.severity)}
                                <Typography sx={{ fontWeight: 'bold' }}>
                                  {detection.threat_type.replace('_', ' ').toUpperCase()}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={`${(detection.confidence * 100).toFixed(1)}%`}
                                sx={{ 
                                  fontWeight: 'bold',
                                  background: `linear-gradient(45deg, ${getSeverityColor(detection.severity)} 30%, ${getSeverityColor(detection.severity)}80 100%)`,
                                  color: 'white'
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={detection.severity.toUpperCase()}
                                size="small"
                                sx={{ 
                                  backgroundColor: getSeverityColor(detection.severity),
                                  color: 'white',
                                  fontWeight: 'bold',
                                  animation: detection.severity === 'critical' ? 'pulse 2s infinite' : 'none'
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                ({Math.round(detection.bbox.x1)}, {Math.round(detection.bbox.y1)})
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {Math.round(detection.area)} px²
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        )}

        {/* Image Comparison */}
        {originalImageUrl && (
          <Grid item xs={12}>
            <Slide direction="up" in={true} timeout={2000}>
              <Card sx={{
                bgcolor: '#1f3c70',
                color: '#fff',
                borderRadius: 3,
                boxShadow: '0 15px 35px rgba(31,60,112,0.3)',
                border: '1px solid rgba(126,207,255,0.2)'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 'bold', 
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <VisibilityIcon sx={{ color: '#7ecfff' }} />
                    🔍 Detection Results Visualization
                  </Typography>

                  <Grid container spacing={3}>
                    {[
                      { title: 'Original Image', url: originalImageUrl, delay: 0 },
                      { title: 'Detected Threats (Annotated)', url: detectedImageUrl, delay: 200 }
                    ].map((image, index) => (
                      <Grid item xs={12} md={6} key={image.title}>
                        <Zoom in={true} timeout={1000 + image.delay}>
                          <Paper sx={{ 
                            p: 2,
                            bgcolor: '#162b4d',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                            }
                          }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ 
                              fontWeight: 'bold',
                              textAlign: 'center',
                              color: '#7ecfff'
                            }}>
                              {image.title}
                            </Typography>
                            {image.url ? (
                              <Box
                                component="img"
                                src={image.url}
                                alt={image.title}
                                sx={{
                                  width: '100%',
                                  height: 300,
                                  objectFit: 'contain',
                                  borderRadius: 1,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 8px 25px rgba(126,207,255,0.3)'
                                  }
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 300,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'rgba(126,207,255,0.1)',
                                  borderRadius: 1,
                                  border: '2px dashed rgba(126,207,255,0.3)'
                                }}
                              >
                                <Typography color="rgba(255,255,255,0.7)" sx={{ textAlign: 'center' }}>
                                  {processing ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                      <LinearProgress sx={{ width: 100, mb: 2 }} />
                                      Analyzing...
                                    </Box>
                                  ) : (
                                    `${image.title} will appear here`
                                  )}
                                </Typography>
                              </Box>
                            )}
                          </Paper>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        )}

        {/* Threat Information */}
        <Grid item xs={12}>
          <Slide direction="up" in={true} timeout={1500}>
            <Card sx={{
              bgcolor: '#162b4d',
              color: '#fff',
              borderRadius: 3,
              boxShadow: '0 15px 35px rgba(22,43,77,0.3)',
              border: '1px solid rgba(126,207,255,0.2)'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 3
                }}>
                  <SecurityIcon sx={{ color: '#7ecfff' }} />
                  📋 Detectable Maritime Threats
                </Typography>
                
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <List dense>
                      {[
                        { icon: <ErrorIcon sx={{ color: '#d32f2f' }} />, primary: "Submarines", secondary: "Critical threat - Military underwater vessels with distinctive hull shapes and periscopes" },
                        { icon: <ErrorIcon sx={{ color: '#d32f2f' }} />, primary: "Undersea Mines", secondary: "Critical threat - Explosive devices with spherical shapes and spike attachments" },
                        { icon: <WarningIcon sx={{ color: '#f57c00' }} />, primary: "Divers/Swimmers", secondary: "High threat - Human figures with diving equipment and fins" }
                      ].map((item, index) => (
                        <Zoom key={item.primary} in={true} timeout={1000 + index * 200}>
                          <ListItem sx={{ 
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(126,207,255,0.1)',
                              borderRadius: 2
                            }
                          }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.primary} secondary={item.secondary} />
                          </ListItem>
                        </Zoom>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List dense>
                      {[
                        { icon: <WarningIcon sx={{ color: '#fbc02d' }} />, primary: "Suspicious Objects", secondary: "Medium threat - Unidentified artificial objects or foreign materials" }
                      ].map((item, index) => (
                        <Zoom key={item.primary} in={true} timeout={1400 + index * 200}>
                          <ListItem sx={{ 
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(126,207,255,0.1)',
                              borderRadius: 2
                            }
                          }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.primary} secondary={item.secondary} />
                          </ListItem>
                        </Zoom>
                      ))}
                    </List>
                  </Grid>
                </Grid>

                <Fade in={true} timeout={2000}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>Detection Accuracy:</strong> This system uses YOLO v11 trained on underwater imagery 
                    with 94.7% accuracy for maritime threat detection.
                  </Alert>
                </Fade>
              </CardContent>
            </Card>
          </Slide>
        </Grid>
      </Grid>

      {/* Global Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes checkPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes textGlow {
          0% { text-shadow: 0 0 20px #7ecfff40; }
          100% { text-shadow: 0 0 30px #7ecfff80, 0 0 40px #7ecfff40; }
        }
      `}</style>
    </Box>
  );
};

export default ThreatDetection;