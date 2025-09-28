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
      // Fallback to sample data
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
            id: 'yolo_v11_underwater_nano',
            name: 'YOLO v11 Underwater (Nano)',
            type: 'detection',
            size: '12 MB',
            accuracy: '89.3%',
            speed: 'Very Fast',
            description: 'Ultra-lightweight model for edge devices',
            compatibility: ['AUV/ROV', 'Embedded Systems'],
            requirements: '512MB RAM, ARM/x86',
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
          },
        ]
      });
    }
  };

  const deviceTypes = [
    { value: 'gpu_server', label: 'GPU Server', icon: '🖥️' },
    { value: 'auv_rov', label: 'AUV/ROV System', icon: '🤖' },
    { value: 'jetson', label: 'NVIDIA Jetson', icon: '🔧' },
    { value: 'embedded', label: 'Embedded Device', icon: '📱' },
    { value: 'cpu_only', label: 'CPU Only', icon: '⚙️' },
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
      <Chip
        key={index}
        label={device}
        size="small"
        variant="outlined"
        sx={{ mr: 0.5, mb: 0.5 }}
      />
    ));
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        🔧 AI Model Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Download and manage AI models for edge device deployment
      </Typography>

      {/* Model Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PsychologyIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {availableModels.enhancement.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Enhancement Models
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {availableModels.detection.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Detection Models
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <DevicesIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {installedModels.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Installed Models
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a, #fee140)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <StorageIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {(availableModels.enhancement.reduce((sum, m) => sum + parseInt(m.size), 0) + 
                  availableModels.detection.reduce((sum, m) => sum + parseInt(m.size), 0)).toFixed(0)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Total Size (MB)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Card>
        <CardContent>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="Available Models" />
            <Tab label="Installed Models" />
            <Tab label="Device Configuration" />
          </Tabs>

          {/* Available Models Tab */}
          <TabPanel value={selectedTab} index={0}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Download AI Models for Edge Deployment
            </Typography>
            
            {/* Enhancement Models */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
              🎨 Image Enhancement Models (GAN)
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Model</strong></TableCell>
                    <TableCell><strong>Size</strong></TableCell>
                    <TableCell><strong>Accuracy</strong></TableCell>
                    <TableCell><strong>Speed</strong></TableCell>
                    <TableCell><strong>Compatibility</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableModels.enhancement.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {model.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {model.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={model.size} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                          {model.accuracy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={model.speed} 
                          size="small"
                          sx={{ 
                            backgroundColor: getSpeedColor(model.speed),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {getCompatibilityChips(model.compatibility)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={downloading[model.id] ? <LinearProgress /> : <CloudDownloadIcon />}
                          onClick={() => handleDownloadClick(model)}
                          disabled={downloading[model.id] || installedModels.some(m => m.id === model.id)}
                        >
                          {downloading[model.id] ? 'Downloading...' : 
                           installedModels.some(m => m.id === model.id) ? 'Installed' : 'Download'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Detection Models */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
              🛡️ Threat Detection Models (YOLO v11)
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Model</strong></TableCell>
                    <TableCell><strong>Size</strong></TableCell>
                    <TableCell><strong>Accuracy</strong></TableCell>
                    <TableCell><strong>Speed</strong></TableCell>
                    <TableCell><strong>Compatibility</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableModels.detection.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {model.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {model.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={model.size} size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                          {model.accuracy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={model.speed} 
                          size="small"
                          sx={{ 
                            backgroundColor: getSpeedColor(model.speed),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {getCompatibilityChips(model.compatibility)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={downloading[model.id] ? <LinearProgress /> : <CloudDownloadIcon />}
                          onClick={() => handleDownloadClick(model)}
                          disabled={downloading[model.id] || installedModels.some(m => m.id === model.id)}
                        >
                          {downloading[model.id] ? 'Downloading...' : 
                           installedModels.some(m => m.id === model.id) ? 'Installed' : 'Download'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Installed Models Tab */}
          <TabPanel value={selectedTab} index={1}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Installed Models on Edge Devices
            </Typography>
            
            {installedModels.length > 0 ? (
              <List>
                {installedModels.map((model) => (
                  <ListItem key={model.id} divider>
                    <ListItemIcon>
                      {model.type === 'enhancement' ? <PsychologyIcon color="primary" /> : <SecurityIcon color="error" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {model.name}
                          </Typography>
                          <Chip label={model.deviceType} size="small" variant="outlined" />
                          <Chip label={model.size} size="small" />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Installed: {new Date(model.installedAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Accuracy: {model.accuracy} • Speed: {model.speed}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Uninstall Model">
                        <IconButton edge="end" onClick={() => handleUninstall(model.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <DevicesIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Models Installed
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Download models from the Available Models tab to get started
                </Typography>
              </Paper>
            )}
          </TabPanel>

          {/* Device Configuration Tab */}
          <TabPanel value={selectedTab} index={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Edge Device Configuration
            </Typography>
            
            <Grid container spacing={3}>
              {deviceTypes.map((device) => (
                <Grid item xs={12} md={6} key={device.value}>
                  <Paper variant="outlined" sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ mr: 2 }}>{device.icon}</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {device.label}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {device.value === 'gpu_server' && 'High-performance server with dedicated GPU for maximum accuracy'}
                      {device.value === 'auv_rov' && 'Autonomous underwater vehicles with limited computational resources'}
                      {device.value === 'jetson' && 'NVIDIA Jetson series for edge AI with GPU acceleration'}
                      {device.value === 'embedded' && 'Low-power embedded systems for real-time processing'}
                      {device.value === 'cpu_only' && 'CPU-only deployment for basic processing capabilities'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={`${installedModels.filter(m => m.deviceType === device.value).length} Installed`}
                        size="small"
                        color="primary"
                      />
                    </Box>
                    
                    <Button variant="outlined" size="small" startIcon={<SettingsIcon />}>
                      Configure
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <strong>Edge Deployment:</strong> Models are automatically optimized for your selected device type.
              TensorRT optimization is applied for NVIDIA devices, while quantization is used for CPU-only deployments.
            </Alert>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Download Confirmation Dialog */}
      <Dialog open={downloadDialog} onClose={() => setDownloadDialog(false)}>
        <DialogTitle>Download Model for Edge Device</DialogTitle>
        <DialogContent>
          {selectedModel && (
            <Box sx={{ minWidth: 300 }}>
              <Typography variant="body1" gutterBottom>
                <strong>{selectedModel.name}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedModel.description}
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Typography variant="body2"><strong>Size:</strong> {selectedModel.size}</Typography>
                <Typography variant="body2"><strong>Accuracy:</strong> {selectedModel.accuracy}</Typography>
                <Typography variant="body2"><strong>Requirements:</strong> {selectedModel.requirements}</Typography>
              </Box>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Target Device Type</InputLabel>
                <Select
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  label="Target Device Type"
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
          <Button onClick={() => setDownloadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDownloadConfirm} 
            variant="contained"
            disabled={!deviceType}
            startIcon={<DownloadIcon />}
          >
            Download & Install
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelManagement;
