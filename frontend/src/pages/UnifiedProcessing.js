import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Slide,
  Zoom,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  AutoFixHigh as AutoFixHighIcon,
  Security as SecurityIcon,
  Download as DownloadIcon,
  Compare as CompareIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { unifiedAPI, enhancementAPI, detectionAPI, utils } from '../services/api';

const UnifiedProcessing = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState(null);
  const [detectedImageUrl, setDetectedImageUrl] = useState(null);

  const steps = [
    'Upload Image',
    'Image Enhancement',
    'Threat Detection',
    'Results & Download'
  ];

  const cardBackgrounds = [
    '#162b4d',
    '#1f3c70', 
    '#b84b59',
    '#559965',
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setResults(null);
      setError(null);
      setActiveStep(0);

      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);

      if (enhancedImageUrl) URL.revokeObjectURL(enhancedImageUrl);
      if (detectedImageUrl) URL.revokeObjectURL(detectedImageUrl);
      setEnhancedImageUrl(null);
      setDetectedImageUrl(null);
    }
  }, [enhancedImageUrl, detectedImageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const handleEnhanceImage = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setError(null);

    try {
      setActiveStep(1);
      const enhanceResult = await enhancementAPI.processEnhancement(selectedFile, 0.5, true);
      if (enhanceResult && enhanceResult.enhanced_image) {
        const filename = enhanceResult.enhanced_image.replace(/\\/g, '/').split('/').pop();
        const imageBlob = await enhancementAPI.getEnhancedImage(filename);
        const url = utils.createImageUrl(imageBlob);
        setEnhancedImageUrl(url);
      } else {
        setError('No enhanced image returned from backend');
      }
      setProcessing(false);
      setActiveStep(2);
    } catch (err) {
      setError(err.message || 'Enhancement failed');
      setProcessing(false);
    }
  };

  const handleDetectThreats = async () => {
    if (!selectedFile || !enhancedImageUrl) return;
    setProcessing(true);
    setError(null);

    try {
      setActiveStep(2);
      const detectionResult = await detectionAPI.processDetection(selectedFile, 0.5, true);
      console.log('🔍 Detection result:', detectionResult);
      
      if (detectionResult.annotated_image || detectionResult.detected_image_path) {
        const imagePath = detectionResult.annotated_image || detectionResult.detected_image_path;
        const filename = imagePath.replace(/\\/g, '/').split('/').pop();
        console.log('📷 Detected image filename:', filename);
        
        try {
          const imageBlob = await detectionAPI.getDetectedImage(filename);
          if (imageBlob) {
            const url = utils.createImageUrl(imageBlob);
            console.log('🖼️ Created detected image URL:', url);
            setDetectedImageUrl(url);
          }
        } catch (error) {
          console.error('❌ Error loading detected image:', error);
          // Fallback to direct URL
          const directUrl = utils.getImageUrl(`detected/${filename}`);
          console.log('🔄 Using direct URL fallback:', directUrl);
          setDetectedImageUrl(directUrl);
        }
      }
      setResults(detectionResult);
      setProcessing(false);
      setActiveStep(3);
    } catch (err) {
      setError(err.message || 'Detection failed');
      setProcessing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#fbc02d';
      case 'low': return '#388e3c';
      default: return '#9e9e9e';
    }
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
      }}>
      </Box>

      {/* Hero Section */}
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            width: '100%',
            minHeight: 200, // Reduced from 320
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4, // Reduced from 8
            pt: 2 // Reduced from 4
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
            🌊 Unified Maritime Image Processing
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
            Complete AI pipeline: Enhancement + Threat Detection in one workflow.
          </Typography>
        </Box>
      </Fade>

      {/* Processing Stepper with Animation */}
      <Fade in={true} timeout={2000}>
        <Card sx={{ 
          mb: 3, 
          bgcolor: '#162b4d', 
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '1px solid rgba(126,207,255,0.2)'
        }}>
          <CardContent>
            <Stepper activeStep={activeStep} orientation="horizontal" alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    sx={{ 
                      '& .MuiStepLabel-label': { 
                        color: index <= activeStep ? '#7ecfff !important' : 'white !important',
                        fontWeight: index === activeStep ? 'bold' : 'normal'
                      },
                      '& .MuiStepIcon-root': {
                        color: index <= activeStep ? '#7ecfff' : '#4b4b4bff',
                        animation: index === activeStep ? 'pulse 1.5s infinite' : 'none'
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </Fade>

      <Grid container spacing={3}>
        {/* Upload Section with Enhanced Animation */}
        <Grid item xs={12} md={6}>
          <Slide direction="right" in={true} timeout={1200}>
            <Card sx={{ 
              bgcolor: '#1f3c70', 
              color: '#fff',
              borderRadius: 3,
              boxShadow: '0 15px 35px rgba(31,60,112,0.3)',
              border: '1px solid rgba(126,207,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 20px 45px rgba(31,60,112,0.4)',
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
                  <CloudUploadIcon sx={{ 
                    animation: selectedFile ? 'bounce 1s' : 'none'
                  }} />
                  Upload Underwater Image
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
                      
                      {originalImageUrl && (
                        <Zoom in={Boolean(originalImageUrl)} timeout={600}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                              Original Image Preview:
                            </Typography>
                            <Box
                              component="img"
                              src={originalImageUrl}
                              alt="Original"
                              sx={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 2,
                                mb: 1,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.02)',
                                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                                }
                              }}
                            />
                          </Box>
                        </Zoom>
                      )}
                      
                      <Button
                        variant="contained"
                        onClick={handleEnhanceImage}
                        disabled={processing || activeStep !== 0}
                        startIcon={<AutoFixHighIcon />}
                        fullWidth
                        size="large"
                        sx={{ 
                          mb: 2, 
                          py: 1.5,
                          background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 100%)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(76,175,80,0.3)'
                          },
                          '&:disabled': {
                            background: '#333'
                          }
                        }}
                      >
                        {processing && activeStep === 1 ? 'Enhancing...' : 'Proceed to Enhancement'}
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleDetectThreats}
                        disabled={processing || !enhancedImageUrl || activeStep !== 2}
                        startIcon={<SecurityIcon />}
                        fullWidth
                        size="large"
                        sx={{ 
                          mb: 2, 
                          py: 1.5,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(244,67,54,0.3)'
                          }
                        }}
                      >
                        {processing && activeStep === 2 ? 'Detecting...' : 'Proceed to Threat Detection'}
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
                              {activeStep === 1 && 'Enhancing image with GAN model...'}
                              {activeStep === 2 && 'Detecting threats with YOLO v11...'}
                              {activeStep === 3 && 'Finalizing results...'}
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

        {/* Results Section with Enhanced Animation */}
        <Grid item xs={12} md={6}>
          {results ? (
            <Slide direction="left" in={Boolean(results)} timeout={1200}>
              <Card sx={{ 
                bgcolor: '#559965', // Changed from '#b84b59' to green (success color)
                color: '#fff',
                borderRadius: 3,
                boxShadow: '0 15px 35px rgba(85,153,101,0.3)', // Updated shadow color
                border: '1px solid rgba(126,207,255,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 45px rgba(85,153,101,0.4)', // Updated hover shadow
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                    <CheckCircleIcon sx={{ mr: 1, animation: 'checkPulse 2s infinite' }} />
                    Processing Complete! 🎉
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
                          <AutoFixHighIcon sx={{ color: '#7ecfff' }} />
                          <Typography sx={{ fontWeight: 'bold' }}>Enhancement</Typography>
                        </Box>
                        {results.quality_metrics ? (
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={`PSNR ${results.quality_metrics.psnr?.toFixed(1) || 'N/A'}`} size="small" />
                            <Chip label={`SSIM ${results.quality_metrics.ssim?.toFixed(2) || 'N/A'}`} size="small" />
                            <Chip label={`UIQM ${results.quality_metrics.uiqm?.toFixed(1) || 'N/A'}`} size="small" />
                          </Box>
                        ) : (
                          <Typography variant="body2" color="#bcdcff">No metrics</Typography>
                        )}
                      </Paper>
                    </Zoom>
                    
                    <Zoom in={true} timeout={1000}>
                      <Paper sx={{ 
                        p: 2, 
                        minWidth: 200, 
                        flex: '1 1 220px', 
                        bgcolor: '#b84b59', 
                        color: '#fff',
                        borderRadius: 2,
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <SecurityIcon sx={{ color: results.total_detections > 0 ? '#ff6b6b' : '#51cf66' }} />
                          <Typography sx={{ fontWeight: 'bold' }}>Threats</Typography>
                        </Box>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 'bold', 
                          mb: 0.5,
                          color: results.total_detections > 0 ? '#ff6b6b' : '#51cf66'
                        }}>
                          {results.total_detections || 0}
                        </Typography>
                        <Typography variant="caption" color="#bcdcff">
                          {results.total_detections > 0 ? '⚠️ Threats Found' : '✅ All Clear'}
                        </Typography>
                      </Paper>
                    </Zoom>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {[
                      { 
                        label: 'Download Report', 
                        icon: <DownloadIcon />, 
                        primary: true,
                        onClick: () => {
                          const payload = {
                            metadata: {
                              created_at: new Date().toISOString(),
                              filename: selectedFile?.name || 'image',
                            },
                            quality_metrics: results.quality_metrics || null,
                            total_detections: results.total_detections || 0,
                            detections: results.detections || [],
                          };
                          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${(selectedFile?.name || 'results').replace(/\.[^.]+$/, '')}_results.json`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      },
                      { 
                        label: 'Enhanced Image', 
                        icon: <DownloadIcon />,
                        onClick: async () => {
                          const filename = (results?.enhanced_image || '').replace(/\\\\/g, '/').split('/').pop();
                          if (!filename) return;
                          const blob = await enhancementAPI.getEnhancedImage(filename);
                          const url = utils.createImageUrl(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = filename;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      },
                      { 
                        label: 'Detected Image', 
                        icon: <DownloadIcon />,
                        onClick: async () => {
                          const filename = (results?.annotated_image || '').replace(/\\\\/g, '/').split('/').pop();
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
                        }
                      }
                    ].map((btn, index) => (
                      <Button
                        key={btn.label}
                        variant={btn.primary ? "contained" : "outlined"}
                        startIcon={btn.icon}
                        onClick={btn.onClick}
                        disabled={!results || (btn.label.includes('Enhanced') && !results?.enhanced_image) || (btn.label.includes('Detected') && !results?.annotated_image)}
                        sx={{
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          animation: `slideInFromBottom 0.6s ease-out ${index * 0.1}s both`,
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        {btn.label}
                      </Button>
                    ))}
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
                  <VisibilityIcon sx={{ 
                    fontSize: 64, 
                    color: 'rgba(126,207,255,0.5)', 
                    mb: 2,
                    animation: 'float 3s ease-in-out infinite'
                  }} />
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Results will appear here after processing
                  </Typography>
                </Box>
              </Card>
            </Fade>
          )}
        </Grid>

        {/* Threat Detection Results Table with Animation */}
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

        {/* Image Comparison Section with Enhanced Animation */}
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
                    <CompareIcon sx={{ color: '#7ecfff' }} />
                    🔍 Processing Results Comparison
                  </Typography>

                  <Grid container spacing={3}>
                    {[
                      { title: 'Original Image', url: originalImageUrl, delay: 0 },
                      { title: 'Enhanced Image', url: enhancedImageUrl, delay: 200 },
                      { title: 'Threat Detection', url: detectedImageUrl, delay: 400 }
                    ].map((image, index) => (
                      <Grid item xs={12} md={4} key={image.title}>
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
                                  height: 250,
                                  objectFit: 'cover',
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
                                  height: 250,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'rgba(126,207,255,0.1)',
                                  borderRadius: 1,
                                  border: '2px dashed rgba(126,207,255,0.3)'
                                }}
                              >
                                <Typography color="rgba(255,255,255,0.7)" sx={{ textAlign: 'center' }}>
                                  {processing && index === activeStep - 1 ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                      <LinearProgress sx={{ width: 100, mb: 2 }} />
                                      Processing...
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

        {/* Technology Information Cards */}
        <Grid item xs={12}>
          <Slide direction="up" in={true} timeout={1500}>
            <Box sx={{ width: '100%', mb: 6 }}>
              <Typography
                variant="h5"
                align="center"
                sx={{ 
                  fontWeight: 700, 
                  color: "#7ecfff", 
                  mb: 5, 
                  letterSpacing: 1,
                }}
              >
                Technology Behind the Platform
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {[
                  {
                    title: 'GAN Enhancement',
                    description: 'Advanced underwater image restoration using Generative Adversarial Networks to improve clarity, color balance, and reduce underwater distortions.',
                    icon: <AutoFixHighIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />,
                    bg: '#1f3c70'
                  },
                  {
                    title: 'YOLO v11 Detection', 
                    description: 'Real-time maritime threat detection using state-of-the-art object detection to identify submarines, mines, divers, and suspicious objects.',
                    icon: <SecurityIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />,
                    bg: '#b84b59'
                  },
                  {
                    title: 'Edge Deployment',
                    description: 'Optimized for real-time processing on AUV/ROV systems with low-latency inference and hardware acceleration support.',
                    icon: <VisibilityIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />,
                    bg: '#559965'
                  }
                ].map((tech, index) => (
                  <Grid item xs={12} md={4} key={tech.title}>
                    <Zoom in={true} timeout={1000 + index * 200}>
                      <Paper
                        elevation={12}
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          backgroundColor: tech.bg,
                          borderRadius: 3,
                          color: '#fff',
                          minHeight: 250,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-12px) scale(1.03)',
                            boxShadow: `0 25px 50px rgba(0,0,0,0.3)`,
                            '&::before': {
                              opacity: 1,
                              transform: 'scale(1.1)'
                            }
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, rgba(126,207,255,0.15) 0%, rgba(63,120,199,0.15) 100%)',
                            opacity: 0,
                            transition: 'all 0.4s ease',
                            transform: 'scale(0.9)'
                          }
                        }}
                      >
                        <Box sx={{ zIndex: 1, position: 'relative' }}>
                          {tech.icon}
                          <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '1.2rem' }}>
                            {tech.title}
                          </Typography>
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {tech.description}
                          </Typography>
                        </Box>
                      </Paper>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>
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
        
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
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

export default UnifiedProcessing;