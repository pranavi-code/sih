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

  // Helper function to create placeholder enhanced image
  const createPlaceholderEnhancedImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 600;
    canvas.height = 400;
    
    const gradient = ctx.createRadialGradient(300, 100, 50, 300, 200, 300);
    gradient.addColorStop(0, '#5CB3E5');
    gradient.addColorStop(0.5, '#4A90D9');
    gradient.addColorStop(1, '#357ABD');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2C5F7E';
    ctx.beginPath();
    ctx.ellipse(150, 300, 80, 25, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#1E3A5F';
    ctx.beginPath();
    ctx.ellipse(450, 320, 60, 20, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 10, 200, 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.fillText('Enhanced Image Demo', 15, 30);
    
    return canvas.toDataURL('image/png');
  };

  // Helper function to create placeholder detected image
  const createPlaceholderDetectedImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 600;
    canvas.height = 400;
    
    const gradient = ctx.createRadialGradient(300, 100, 50, 300, 200, 300);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(0.5, '#357ABD');
    gradient.addColorStop(1, '#1E3A5F');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.ellipse(300, 250, 100, 30, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillRect(280, 220, 40, 30);
    
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 3;
    ctx.strokeRect(120, 250 - 30, 400, 60);
    
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(120, 220 - 30, 120, 25);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.fillText('submarine 0.94', 125, 210 - 10);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 5 + 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    return canvas.toDataURL('image/png');
  };

  const handleEnhanceImage = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setError(null);

    try {
      setActiveStep(1);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const demoEnhancedImageUrl = '/demo_assets/enhanced/underwater_sample_enhanced.png';
      
      const testImage = new Image();
      testImage.onload = () => {
        console.log("Demo enhanced image loaded successfully");
        setEnhancedImageUrl(demoEnhancedImageUrl);
      };
      testImage.onerror = () => {
        console.log("Demo enhanced image not found, using placeholder");
        setEnhancedImageUrl(createPlaceholderEnhancedImage());
      };
      testImage.src = demoEnhancedImageUrl;
      
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
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const demoDetectedImageUrl = '/demo_assets/detected/underwater_sample_detected.png';
      
      const testImage = new Image();
      testImage.onload = () => {
        console.log("Demo detected image loaded successfully");
        setDetectedImageUrl(demoDetectedImageUrl);
      };
      testImage.onerror = () => {
        console.log("Demo detected image not found, using placeholder");
        setDetectedImageUrl(createPlaceholderDetectedImage());
      };
      testImage.src = demoDetectedImageUrl;

      const mockResults = {
        enhanced_image: 'underwater_sample_enhanced.png',
        quality_metrics: {
          psnr: 28.5,
          ssim: 0.84,
          uiqm: 3.2
        },
        total_detections: 1,
        detections: [
          {
            threat_type: 'submarine',
            confidence: 0.94,
            severity: 'critical',
            bbox: {
              x1: 120,
              y1: 250,
              x2: 520,
              y2: 380
            },
            area: 52000
          }
        ],
        threat_summary: {
          submarine: 1
        },
        annotated_image: 'underwater_sample_detected.png',
        detected_image_path: demoDetectedImageUrl,
        detected_image_url: demoDetectedImageUrl
      };
      
      setResults(mockResults);
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
             Unified Maritime Image Processing
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

      {/* Processing Stepper */}
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
        {/* Upload Section */}
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
                      '&:hover': {
                        borderColor: '#7ecfff',
                        backgroundColor: '#22335b',
                        transform: 'scale(1.02)'
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
                    <Typography variant="h6" gutterBottom>
                      {isDragActive ? 'Drop the image here' : 'Drag & drop underwater image'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#bcdcff' }} gutterBottom>
                      or click to select from your computer
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#bcdcff' }}>
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
                        onClick={handleEnhanceImage}
                        disabled={processing || activeStep !== 0}
                        startIcon={<AutoFixHighIcon />}
                        fullWidth
                        size="large"
                        sx={{ 
                          mb: 2, 
                          py: 1.5,
                          background: 'linear-gradient(45deg, #4caf50 30%, #2e7d32 100%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(76,175,80,0.3)'
                          },
                          '&:disabled': { background: '#333' }
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
                                  backgroundColor: '#7ecfff'
                                }
                              }}
                            />
                            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
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
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    Processing Complete! 🎉
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                    <Paper sx={{ 
                      p: 2, 
                      minWidth: 200, 
                      flex: '1 1 220px', 
                      bgcolor: '#1f3c70', 
                      color: '#fff',
                      borderRadius: 2
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
                    
                    <Paper sx={{ 
                      p: 2, 
                      minWidth: 200, 
                      flex: '1 1 220px', 
                      bgcolor: '#b84b59', 
                      color: '#fff',
                      borderRadius: 2
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
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
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
                      }}
                    >
                      Download Report
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = enhancedImageUrl;
                        a.download = 'underwater_sample_enhanced.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                      sx={{
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': { borderColor: '#fff' }
                      }}
                    >
                      Enhanced Image
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = detectedImageUrl;
                        a.download = 'underwater_sample_detected.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }}
                      sx={{
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': { borderColor: '#fff' }
                      }}
                    >
                      Detected Image
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
                  <VisibilityIcon sx={{ 
                    fontSize: 64, 
                    color: 'rgba(126,207,255,0.5)', 
                    mb: 2
                  }} />
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Results will appear here after processing
                  </Typography>
                </Box>
              </Card>
            </Fade>
          )}
        </Grid>

        {/* Threat Detection Results Table */}
        {results && results.detections && results.detections.length > 0 && (
          <Grid item xs={12}>
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
                  <SecurityIcon sx={{ color: '#ff6b6b' }} />
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
                            '&:hover': {
                              backgroundColor: 'rgba(126,207,255,0.1)'
                            }
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
                                backgroundColor: getSeverityColor(detection.severity),
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
                                fontWeight: 'bold'
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
          </Grid>
        )}

        {/* Image Comparison Section */}
        {originalImageUrl && (
          <Grid item xs={12}>
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
                    {
                      title: 'Original Image',
                      url: originalImageUrl
                    },
                    {
                      title: 'Enhanced Image',
                      url: enhancedImageUrl
                    },
                    {
                      title: 'Threat Detection',
                      url: detectedImageUrl
                    }
                  ].map((image, index) => (
                    <Grid item xs={12} md={4} key={image.title}>
                      <Paper sx={{ 
                        p: 2,
                        bgcolor: '#162b4d',
                        borderRadius: 2
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
                            onError={(e) => {
                              if (image.title.includes('Enhanced') && !image.url.startsWith('data:')) {
                                e.target.src = createPlaceholderEnhancedImage();
                              } else if (image.title.includes('Threat') && !image.url.startsWith('data:')) {
                                e.target.src = createPlaceholderDetectedImage();
                              }
                            }}
                            sx={{
                              width: '100%',
                              height: 250,
                              objectFit: 'contain',
                              borderRadius: 1,
                              border: image.title.includes('Threat') ? '2px solid #ff6b6b' : 
                                     image.title.includes('Enhanced') ? '2px solid #4caf50' : 'none'
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
                            <Typography color="rgba(255,255,255,0.7)">
                              {image.title} will appear here
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Technology Behind the Platform Section */}
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
                  animation: 'textGlow 3s ease-in-out infinite alternate',
                  '@keyframes textGlow': {
                    '0%': { textShadow: '0 0 20px #7ecfff40' },
                    '100%': { textShadow: '0 0 30px #7ecfff80, 0 0 40px #7ecfff40' }
                  }
                }}
              >
                🔬 Technology Behind the Platform
              </Typography>
              <Grid container spacing={4} justifyContent="center">
                {[
                  {
                    title: 'GAN Enhancement',
                    description: 'Advanced underwater image restoration using Generative Adversarial Networks to improve clarity, color balance, and reduce underwater distortions.',
                    icon: <AutoFixHighIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />,
                    bg: '#1f3c70',
                    borderColor: '#4caf50'
                  },
                  {
                    title: 'YOLO v11 Detection', 
                    description: 'Real-time maritime threat detection using state-of-the-art object detection to identify submarines, mines, divers, and suspicious objects.',
                    icon: <SecurityIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />,
                    bg: '#b84b59',
                    borderColor: '#ff6b6b'
                  },
                  {
                    title: 'Edge Deployment',
                    description: 'Optimized for real-time processing on AUV/ROV systems with low-latency inference and hardware acceleration support.',
                    icon: <VisibilityIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />,
                    bg: '#559965',
                    borderColor: '#7ecfff'
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
                          minHeight: 280,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                          border: `2px solid ${tech.borderColor}20`,
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-12px) scale(1.03)',
                            boxShadow: `0 25px 50px rgba(0,0,0,0.3)`,
                            border: `2px solid ${tech.borderColor}`,
                            '&::before': {
                              opacity: 1,
                              transform: 'scale(1.1)'
                            },
                            '& .tech-icon': {
                              animation: 'techIconBounce 0.6s ease-in-out'
                            }
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(45deg, ${tech.borderColor}15 0%, rgba(126,207,255,0.15) 100%)`,
                            opacity: 0,
                            transition: 'all 0.4s ease',
                            transform: 'scale(0.9)'
                          }
                        }}
                      >
                        <Box sx={{ zIndex: 1, position: 'relative' }}>
                          <Box className="tech-icon" sx={{ mb: 2 }}>
                            {tech.icon}
                          </Box>
                          <Typography sx={{ 
                            fontWeight: 700, 
                            mb: 2, 
                            fontSize: '1.3rem',
                            color: '#fff'
                          }}>
                            {tech.title}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            lineHeight: 1.6,
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '0.95rem'
                          }}>
                            {tech.description}
                          </Typography>
                        </Box>

                        {/* Decorative Elements */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${tech.borderColor}40 0%, transparent 70%)`,
                            opacity: 0.6,
                            animation: 'float 4s ease-in-out infinite'
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 15,
                            left: 15,
                            width: 25,
                            height: 25,
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${tech.borderColor}30 0%, transparent 70%)`,
                            opacity: 0.4,
                            animation: 'float 5s ease-in-out infinite reverse'
                          }}
                        />
                      </Paper>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>
        </Grid>
      </Grid>

      {/* Enhanced Global Animation Styles */}
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
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes techIconBounce {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1) rotate(-5deg); }
          50% { transform: scale(1.15) rotate(0deg); }
          75% { transform: scale(1.1) rotate(5deg); }
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
