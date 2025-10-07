import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Fade,
  Slide,
  Zoom,
  Collapse,
  Link,
} from '@mui/material';
import {
  CloudDownload as CloudDownloadIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
  Devices as DevicesIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { modelAPI } from '../services/api';

const ModelManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [downloading, setDownloading] = useState({});
  const [downloadDialog, setDownloadDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [deviceType, setDeviceType] = useState('');
  const [installedModels, setInstalledModels] = useState([]);
  const [availableModels, setAvailableModels] = useState({ enhancement: [], detection: [] });
  const [expandedModel, setExpandedModel] = useState(null);

  // Load available and installed models
  useEffect(() => {
    loadModelsData();
  }, []);

  const loadModelsData = async () => {
    try {
      // Load available models
      const available = await modelAPI.getAvailableModels();
      setAvailableModels({
        enhancement: available.enhancement_models || [],
        detection: available.detection_models || []
      });

      // Load installed models
      const installed = await modelAPI.getInstalledModels();
      setInstalledModels(installed.installed_models || []);
    } catch (error) {
      console.error('Error loading models data:', error);
      // Fallback to sample data - UPDATED to remove YOLO Nano
      setAvailableModels({
        enhancement: [
          {
            id: 'gan_v2_1_full',
            name: 'GAN Enhancement v2.1 (Full)',
            type: 'enhancement',
            size: '245 MB',
            accuracy: '96.2%',
            speed: 'Medium',
            description: 'Full-precision GAN model for maximum quality enhancement',
            compatibility: ['GPU Server', 'High-end Edge'],
            requirements: 'CUDA 11.0+, 8GB VRAM',
          },
          {
            id: 'gan_v2_1_quantized',
            name: 'GAN Enhancement v2.1 (Quantized)',
            type: 'enhancement',
            size: '89 MB',
            accuracy: '94.8%',
            speed: 'Fast',
            description: 'INT8 quantized model optimized for edge deployment',
            compatibility: ['AUV/ROV', 'Edge Devices', 'CPU'],
            requirements: 'TensorRT 8.0+, 2GB RAM',
          },
          {
            id: 'gan_lite_v1_5',
            name: 'GAN Enhancement Lite v1.5',
            type: 'enhancement',
            size: '32 MB',
            accuracy: '91.5%',
            speed: 'Very Fast',
            description: 'Lightweight model for real-time processing',
            compatibility: ['Embedded Systems', 'Mobile Devices'],
            requirements: '1GB RAM, ARM/x86',
          },
        ],
        detection: [
          {
            id: 'yolo_v11_underwater_full',
            name: 'YOLO v11 Underwater (Full)',
            type: 'detection',
            size: '156 MB',
            accuracy: '94.7%',
            speed: 'Medium',
            description: 'Full precision model trained on Indian Ocean maritime data',
            compatibility: ['GPU Server', 'High-end Edge'],
            requirements: 'CUDA 11.0+, 4GB VRAM',
          },
          {
            id: 'yolo_v11_underwater_tensorrt',
            name: 'YOLO v11 Underwater (TensorRT)',
            type: 'detection',
            size: '78 MB',
            accuracy: '93.1%',
            speed: 'Fast',
            description: 'TensorRT optimized for NVIDIA edge devices',
            compatibility: ['Jetson Series', 'NVIDIA Edge'],
            requirements: 'TensorRT 8.0+, Jetson Xavier/Orin',
            dockerImage: 'nvcr.io/nvidia/tensorrt:22.12-py3',
            dockerLink: 'https://hub.docker.com/r/nvidia/tensorrt'
          },
        ]
      });
    }
  };

  // Updated device types - only CPU, GPU, and AUV/ROV
  const deviceTypes = [
    { value: 'cpu_only', label: 'CPU Only', icon: '⚙️' },
    { value: 'gpu_server', label: 'GPU Server', icon: '🖥️' },
    { value: 'auv_rov', label: 'AUV/ROV System', icon: '🤖' },
  ];

  useEffect(() => {
    // Load installed models from localStorage or API
    const installed = JSON.parse(localStorage.getItem('installedModels') || '[]');
    setInstalledModels(installed);
  }, []);

  const handleDownloadClick = (model) => {
    setSelectedModel(model);
    setDownloadDialog(true);
  };

  const handleDownloadConfirm = async () => {
    if (!selectedModel || !deviceType) return;

    setDownloading({ ...downloading, [selectedModel.id]: true });
    setDownloadDialog(false);

    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add to installed models
      const newInstalled = [...installedModels, {
        ...selectedModel,
        deviceType,
        installedAt: new Date().toISOString(),
        status: 'installed'
      }];
      
      setInstalledModels(newInstalled);
      localStorage.setItem('installedModels', JSON.stringify(newInstalled));
      
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading({ ...downloading, [selectedModel.id]: false });
    }
  };

  const handleUninstall = (modelId) => {
    const updated = installedModels.filter(m => m.id !== modelId);
    setInstalledModels(updated);
    localStorage.setItem('installedModels', JSON.stringify(updated));
  };

  const getSpeedColor = (speed) => {
    switch (speed) {
      case 'Very Fast': return '#4caf50';
      case 'Fast': return '#ff9800';
      case 'Medium': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const getCompatibilityChips = (compatibility) => {
    return compatibility.map((device, index) => (
      <Zoom key={index} in={true} timeout={500 + index * 100}>
        <Chip
          label={device}
          size="small"
          variant="outlined"
          sx={{ 
            mr: 0.5, 
            mb: 0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'rgba(126,207,255,0.1)'
            }
          }}
        />
      </Zoom>
    ));
  };

  const toggleModelDetails = (modelId) => {
    setExpandedModel(expandedModel === modelId ? null : modelId);
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  // Model card component to replace table rows
  const ModelCard = ({ model, type }) => {
    const isExpanded = expandedModel === model.id;
    const isInstalled = installedModels.some(m => m.id === model.id);
    const isDownloading = downloading[model.id];
    const isTensorRT = model.id === 'yolo_v11_underwater_tensorrt';

    return (
      <Fade in={true} timeout={800}>
        <Card sx={{
          mb: 2.5,
          bgcolor: 'rgba(31,60,112,0.4)',
          borderRadius: 2,
          boxShadow: isExpanded 
            ? '0 8px 25px rgba(126, 207, 255, 0.2)' 
            : '0 4px 15px rgba(0, 0, 0, 0.2)',
          border: isExpanded 
            ? '1px solid rgba(126, 207, 255, 0.4)'
            : '1px solid rgba(126, 207, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(126, 207, 255, 0.2)',
            transform: 'translateY(-4px)',
            borderColor: 'rgba(126, 207, 255, 0.4)'
          }
        }}>
          <CardContent sx={{ pb: 1 }}>
            {/* Header section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              pb: 1
            }} onClick={() => toggleModelDetails(model.id)}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {type === 'enhancement' ? (
                  <PsychologyIcon sx={{ color: '#7ecfff', mr: 1.5, fontSize: 28 }} />
                ) : (
                  <SecurityIcon sx={{ color: '#f6a5c1', mr: 1.5, fontSize: 28 }} />
                )}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 'bold', 
                      color: type === 'enhancement' ? '#7ecfff' : '#f6a5c1',
                      mb: 0.5
                    }}>
                      {model.name}
                    </Typography>
                    {/* Docker Hub link for TensorRT model */}
                    {isTensorRT && (
                      <Tooltip title="View Docker Container">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(model.dockerLink, '_blank');
                          }}
                          sx={{ 
                            color: '#7ecfff',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              color: '#fff',
                              backgroundColor: 'rgba(126,207,255,0.2)',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip 
                      label={model.size} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(126, 207, 255, 0.15)',
                        color: '#bcdcff',
                        borderRadius: '4px'
                      }}
                    />
                    <Chip 
                      label={model.accuracy} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(76, 175, 80, 0.15)',
                        color: '#b0e9b5',
                        borderRadius: '4px'
                      }}
                    />
                    <Chip 
                      label={model.speed} 
                      size="small" 
                      sx={{ 
                        bgcolor: `${getSpeedColor(model.speed)}22`,
                        color: getSpeedColor(model.speed),
                        borderRadius: '4px'
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isInstalled && (
                  <Chip 
                    icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                    label="Installed" 
                    size="small" 
                    sx={{ 
                      mr: 1.5, 
                      bgcolor: 'rgba(76, 175, 80, 0.15)',
                      color: '#b0e9b5',
                      borderColor: 'transparent'
                    }}
                  />
                )}
                <IconButton 
                  size="small"
                  sx={{ color: '#7ecfff' }}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            {/* Expanded details */}
            <Collapse in={isExpanded}>
              <Box sx={{ 
                pt: 1, 
                pb: 1,
                mt: 1,
                borderTop: '1px solid rgba(126, 207, 255, 0.15)'
              }}>
                <Typography variant="body2" sx={{ color: '#dbe9ff', mb: 2 }}>
                  {model.description}
                </Typography>
                
                {/* Show Docker container info for TensorRT model */}
                {isTensorRT && (
                  <Alert 
                    severity="info" 
                    sx={{
                      mb: 2,
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      color: '#90caf9',
                      border: '1px solid rgba(33, 150, 243, 0.2)',
                      '& .MuiAlert-icon': {
                        color: '#90caf9'
                      }
                    }}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={() => window.open(model.dockerLink, '_blank')}
                        startIcon={<LaunchIcon />}
                        sx={{
                          color: '#90caf9',
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.1)'
                          }
                        }}
                      >
                        View Container
                      </Button>
                    }
                  >
                    🐳 Available as Docker container: {model.dockerImage}
                  </Alert>
                )}
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#7ecfff', display: 'block', mb: 0.5 }}>
                      Compatible with:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getCompatibilityChips(model.compatibility)}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: '#7ecfff', display: 'block', mb: 0.5 }}>
                      Requirements:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#dbe9ff' }}>
                      {model.requirements}
                    </Typography>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={isDownloading ? null : <CloudDownloadIcon />}
                  onClick={() => handleDownloadClick(model)}
                  disabled={isDownloading || isInstalled}
                  sx={{
                    background: isInstalled 
                      ? 'rgba(76, 175, 80, 0.15)'
                      : 'linear-gradient(90deg, #026773, #05a0b5)',
                    color: isInstalled ? '#b0e9b5' : '#fff',
                    boxShadow: 'none',
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #05a0b5, #026773)',
                      boxShadow: '0 4px 15px rgba(5, 160, 181, 0.3)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      color: isInstalled ? '#b0e9b5' : 'rgba(255,255,255,0.5)'
                    }
                  }}
                >
                  {isDownloading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        size={16} 
                        sx={{ 
                          width: 60, 
                          borderRadius: 5,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#fff'
                          }
                        }} 
                      />
                      Downloading...
                    </Box>
                  ) : isInstalled ? (
                    'Installed'
                  ) : (
                    'Download Model'
                  )}
                </Button>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      </Fade>
    );
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
            minHeight: 120,
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
             Model Management
          </Typography>
          <Typography
            align="center"
            sx={{
              color: '#dbe9ff',
              mb: 2,
              maxWidth: 600,
              fontSize: 16,
              opacity: 0.9
            }}
          >
            Download and manage AI models for maritime security applications
          </Typography>
        </Box>
      </Fade>

      {/* Model Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={800}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #026773 0%, #05a0b5 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 15px 30px rgba(5, 160, 181, 0.3)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PsychologyIcon sx={{ 
                  fontSize: 40, 
                  color: 'white', 
                  mb: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {availableModels.enhancement.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Enhancement Models
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={1000}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e16f62 0%, #c25450 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 15px 30px rgba(225, 111, 98, 0.3)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SecurityIcon sx={{ 
                  fontSize: 40, 
                  color: 'white', 
                  mb: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {availableModels.detection.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Detection Models
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={1200}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #3e9b6d 0%, #6bbd9a 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 15px 30px rgba(62, 155, 109, 0.3)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <DevicesIcon sx={{ 
                  fontSize: 40, 
                  color: 'white', 
                  mb: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {installedModels.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Installed Models
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={1400}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e7cd90 0%, #dfb15b 100%)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 15px 30px rgba(231, 205, 144, 0.3)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <StorageIcon sx={{ 
                  fontSize: 40, 
                  color: 'white', 
                  mb: 1,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {(availableModels.enhancement.reduce((sum, m) => sum + (m.size ? parseInt(m.size.replace(' MB', '')) : 0), 0) + 
                    availableModels.detection.reduce((sum, m) => sum + (m.size ? parseInt(m.size.replace(' MB', '')) : 0), 0)).toFixed(0)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Total Size (MB)
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Slide direction="up" in={true} timeout={1500}>
        <Card sx={{
          bgcolor: 'rgba(1, 24, 42, 0.7)',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 15px 35px rgba(1, 24, 42, 0.5)',
          border: '1px solid rgba(5, 160, 181, 0.2)'
        }}>
          <CardContent>
            <Tabs 
              value={selectedTab} 
              onChange={(e, newValue) => setSelectedTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  color: '#bcdcff',
                  transition: 'all 0.3s ease',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: 16,
                  '&:hover': {
                    color: '#05a0b5',
                  }
                },
                '& .Mui-selected': {
                  color: '#05a0b5 !important',
                  fontWeight: 600
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#05a0b5',
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              <Tab label="Available Models" />
              <Tab label="Installed Models" />
            </Tabs>

            {/* Available Models Tab */}
            <TabPanel value={selectedTab} index={0}>
              <Fade in={selectedTab === 0} timeout={800}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    color: '#05a0b5',
                    mb: 3
                  }}>
                    🎨 Image Enhancement Models
                  </Typography>
                  
                  {/* Enhancement Models Cards */}
                  <Box sx={{ mb: 4 }}>
                    {availableModels.enhancement.map((model, index) => (
                      <ModelCard 
                        key={model.id} 
                        model={model} 
                        type="enhancement" 
                      />
                    ))}
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    color: '#e16f62',
                    mb: 3
                  }}>
                    🛡️ Threat Detection Models
                  </Typography>

                  {/* Detection Models Cards */}
                  <Box>
                    {availableModels.detection.map((model) => (
                      <ModelCard 
                        key={model.id} 
                        model={model} 
                        type="detection" 
                      />
                    ))}
                  </Box>
                </Box>
              </Fade>
            </TabPanel>

            {/* Installed Models Tab */}
            <TabPanel value={selectedTab} index={1}>
              <Fade in={selectedTab === 1} timeout={800}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    color: '#05a0b5',
                    mb: 3
                  }}>
                    Installed Models on Edge Devices
                  </Typography>
                  
                  {installedModels.length > 0 ? (
                    <List sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: 2
                    }}>
                      {installedModels.map((model, index) => (
                        <Slide key={model.id} direction="right" in={true} timeout={800 + index * 200}>
                          <Paper 
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: 'rgba(1, 24, 42, 0.5)',
                              border: '1px solid rgba(5, 160, 181, 0.2)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: '0 8px 25px rgba(5, 160, 181, 0.15)',
                                transform: 'translateY(-4px)'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                              {model.type === 'enhancement' ? 
                                <PsychologyIcon sx={{ color: '#05a0b5', fontSize: 28 }} /> : 
                                <SecurityIcon sx={{ color: '#e16f62', fontSize: 28 }} />
                              }
                              <Box>
                                <Typography variant="subtitle1" sx={{ 
                                  fontWeight: 'bold', 
                                  color: model.type === 'enhancement' ? '#05a0b5' : '#e16f62' 
                                }}>
                                  {model.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                  <Chip 
                                    label={deviceTypes.find(d => d.value === model.deviceType)?.label || model.deviceType} 
                                    size="small" 
                                    icon={<DevicesIcon sx={{ fontSize: '16px !important' }} />}
                                    sx={{ 
                                      bgcolor: 'rgba(5, 160, 181, 0.1)', 
                                      color: '#dbe9ff',
                                      borderColor: 'transparent'
                                    }} 
                                  />
                                  <Chip 
                                    label={model.size} 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: 'rgba(5, 160, 181, 0.1)', 
                                      color: '#dbe9ff',
                                      borderColor: 'transparent'
                                    }} 
                                  />
                                </Box>
                              </Box>
                            </Box>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mt: 2
                            }}>
                              <Typography variant="caption" sx={{ color: '#7ecfff' }}>
                                Installed: {new Date(model.installedAt).toLocaleDateString()}
                              </Typography>
                              
                              <Tooltip title="Uninstall Model">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleUninstall(model.id)}
                                  sx={{
                                    color: '#e16f62',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      color: '#fff',
                                      backgroundColor: '#e16f62',
                                      transform: 'scale(1.1)'
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Paper>
                        </Slide>
                      ))}
                    </List>
                  ) : (
                    <Fade in={true} timeout={1000}>
                      <Paper sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        bgcolor: 'rgba(1, 24, 42, 0.5)',
                        borderRadius: 3,
                        border: '2px dashed rgba(5, 160, 181, 0.3)'
                      }}>
                        <DevicesIcon sx={{ 
                          fontSize: 64, 
                          color: 'rgba(5, 160, 181, 0.5)', 
                          mb: 2
                        }} />
                        <Typography variant="h6" sx={{ color: '#05a0b5', mb: 1 }}>
                          No Models Installed
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#dbe9ff' }}>
                          Download models from the Available Models tab to get started
                        </Typography>
                      </Paper>
                    </Fade>
                  )}
                </Box>
              </Fade>
            </TabPanel>


          </CardContent>
        </Card>
      </Slide>

      {/* Download Confirmation Dialog */}
      <Dialog 
        open={downloadDialog} 
        onClose={() => setDownloadDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#01182a',
            color: '#fff',
            borderRadius: 2,
            border: '1px solid rgba(5, 160, 181, 0.3)'
          }
        }}
      >
        <DialogTitle sx={{ color: '#05a0b5', fontWeight: 600 }}>
          Download Model for Edge Device
        </DialogTitle>
        <DialogContent>
          {selectedModel && (
            <Box sx={{ minWidth: 300 }}>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 600 }}>
                {selectedModel.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#dbe9ff', mb: 2 }}>
                {selectedModel.description}
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Typography variant="body2"><strong>Size:</strong> {selectedModel.size}</Typography>
                <Typography variant="body2"><strong>Accuracy:</strong> {selectedModel.accuracy}</Typography>
                <Typography variant="body2"><strong>Requirements:</strong> {selectedModel.requirements}</Typography>
              </Box>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel sx={{ color: '#05a0b5' }}>Target Device Type</InputLabel>
                <Select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  label="Target Device Type"
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#05a0b5'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#05a0b5'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#05a0b5'
                    }
                  }}
                >
                  {deviceTypes.map((device) => (
                    <MenuItem key={device.value} value={device.value}>
                      {device.icon} {device.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDownloadDialog(false)}
            sx={{ color: '#dbe9ff' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDownloadConfirm} 
            variant="contained"
            disabled={!deviceType}
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: '#05a0b5',
              color: '#fff',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#026773'
              }
            }}
          >
            Download & Install
          </Button>
        </DialogActions>
      </Dialog>

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
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes textGlow {
          0% { text-shadow: 0 0 20px #05a0b540; }
          100% { text-shadow: 0 0 30px #05a0b580, 0 0 40px #05a0b540; }
        }
      `}</style>
    </Box>
  );
};

export default ModelManagement;