import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Tabs,
  Tab,
  Fade,
  Slide,
  Zoom,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  RestartAlt as RestartIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Speed as SpeedIcon,
  Info as InfoIcon,
  Computer as ComputerIcon,
  Tune as TuneIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Enhancement Settings
    enhancementModel: 'GAN-v2.1',
    qualityTarget: 'high',
    gpuAcceleration: true,
    
    // Detection Settings
    detectionModel: 'YOLOv8-underwater',
    confidenceThreshold: 0.5,
    nmsThreshold: 0.4,
    maxDetections: 20,
    
    // Alert Settings
    criticalThreatNotification: true,
    emailNotifications: true,
    smsAlerts: false,
    slackIntegration: true,

  });

  const [activeTab, setActiveTab] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1500);
  };

  const handleExportConfig = () => {
    const configJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'underwater-enhancement-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const systemInfo = {
    version: '1.0.0',
    buildDate: '2025-09-28',
    pythonVersion: '3.11.4',
    tensorflowVersion: '2.13.0',
    opencvVersion: '4.8.1',
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ paddingTop: 24 }}>
      {value === index && <Fade in={true} timeout={800}>{children}</Fade>}
    </div>
  );

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
             System Settings & Configuration
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
            Configure AI models, performance settings, and system preferences
          </Typography>
        </Box>
      </Fade>

      {/* Status Alert */}
      {saveStatus && (
        <Slide direction="down" in={Boolean(saveStatus)} timeout={500}>
          <Alert 
            severity={saveStatus === 'success' ? 'success' : saveStatus === 'saving' ? 'info' : 'error'} 
            sx={{ 
              mb: 3,
              bgcolor: saveStatus === 'success' ? 'rgba(76,175,80,0.2)' : 'rgba(33,150,243,0.2)',
              color: '#fff',
              border: `1px solid ${saveStatus === 'success' ? '#4caf50' : '#2196f3'}`,
              animation: saveStatus === 'saving' ? 'pulse 1.5s infinite' : 'none'
            }}
          >
            {saveStatus === 'saving' && '⏳ Saving settings...'}
            {saveStatus === 'success' && '✅ Settings saved successfully!'}
          </Alert>
        </Slide>
      )}

      {/* Settings Dashboard */}
      <Slide direction="up" in={true} timeout={1500}>
        <Card sx={{
          bgcolor: '#162b4d',
          color: '#fff',
          borderRadius: 3,
          boxShadow: '0 15px 35px rgba(22,43,77,0.3)',
          border: '1px solid rgba(126,207,255,0.2)'
        }}>
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(126,207,255,0.2)' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)} 
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  color: '#bcdcff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#7ecfff',
                    transform: 'translateY(-2px)'
                  }
                },
                '& .Mui-selected': {
                  color: '#7ecfff !important'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#7ecfff',
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                }
              }}
            >
              <Tab label="AI Models" icon={<PsychologyIcon />} />
              <Tab label="Notifications" icon={<NotificationsIcon />} />
            </Tabs>
          </Box>

          <CardContent>
            {/* AI Models Tab */}
            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                {/* Enhancement Settings */}
                <Grid item xs={12} md={6}>
                  <Zoom in={activeTab === 0} timeout={1000}>
                    <Paper sx={{
                      p: 3,
                      bgcolor: 'rgba(31,60,112,0.5)',
                      borderRadius: 3,
                      border: '1px solid rgba(126,207,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#7ecfff',
                        boxShadow: '0 10px 30px rgba(31,60,112,0.4)'
                      }
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        cursor: 'pointer'
                      }} onClick={() => toggleSection('enhancement')}>
                        <Typography variant="h6" sx={{
                          fontWeight: 'bold',
                          color: '#7ecfff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <PsychologyIcon sx={{ animation: 'pulse 2s infinite' }} />
                           Image Enhancement
                        </Typography>
                        <IconButton size="small" sx={{ color: '#7ecfff' }}>
                          {expandedSections.enhancement ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>

                      <Collapse in={expandedSections.enhancement !== false}>
                        <Fade in={true} timeout={600}>
                          <Box>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                              <InputLabel sx={{ color: '#7ecfff' }}>Enhancement Model</InputLabel>
                              <Select
                                value={settings.enhancementModel}
                                label="Enhancement Model"
                                onChange={(e) => handleSettingChange('enhancementModel', e.target.value)}
                                sx={{
                                  color: '#fff',
                                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#7ecfff' },
                                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#7ecfff' },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7ecfff' }
                                }}
                              >
                                <MenuItem value="GAN-v2.1"> GAN v2.1 (Recommended)</MenuItem>
                                <MenuItem value="GAN-v2.0">GAN v2.0</MenuItem>
                                <MenuItem value="U-Net">U-Net</MenuItem>
                              </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                              <InputLabel sx={{ color: '#7ecfff' }}>Quality Target</InputLabel>
                              <Select
                                value={settings.qualityTarget}
                                label="Quality Target"
                                onChange={(e) => handleSettingChange('qualityTarget', e.target.value)}
                                sx={{
                                  color: '#fff',
                                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#7ecfff' },
                                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#7ecfff' },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#7ecfff' }
                                }}
                              >
                                <MenuItem value="high"> High Quality (Slower)</MenuItem>
                                <MenuItem value="balanced"> Balanced</MenuItem>
                                <MenuItem value="fast"> Fast Processing</MenuItem>
                              </Select>
                            </FormControl>

                            <FormControlLabel
                              control={
                                <Switch
                                  checked={settings.gpuAcceleration}
                                  onChange={(e) => handleSettingChange('gpuAcceleration', e.target.checked)}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#7ecfff' },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7ecfff' }
                                  }}
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography> GPU Acceleration</Typography>
                                  <Chip label="Recommended" size="small" color="primary" />
                                </Box>
                              }
                            />
                          </Box>
                        </Fade>
                      </Collapse>
                    </Paper>
                  </Zoom>
                </Grid>

                {/* Detection Settings */}
                <Grid item xs={12} md={6}>
                  <Zoom in={activeTab === 0} timeout={1200}>
                    <Paper sx={{
                      p: 3,
                      bgcolor: 'rgba(31,60,112,0.5)',
                      borderRadius: 3,
                      border: '1px solid rgba(126,207,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#ff6b6b',
                        boxShadow: '0 10px 30px rgba(255,107,107,0.2)'
                      }
                    }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        cursor: 'pointer'
                      }} onClick={() => toggleSection('detection')}>
                        <Typography variant="h6" sx={{
                          fontWeight: 'bold',
                          color: '#ff6b6b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <SecurityIcon sx={{ animation: 'pulse 2s infinite 0.5s' }} />
                          🛡️ Threat Detection
                        </Typography>
                        <IconButton size="small" sx={{ color: '#ff6b6b' }}>
                          {expandedSections.detection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>

                      <Collapse in={expandedSections.detection !== false}>
                        <Fade in={true} timeout={600}>
                          <Box>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                              <InputLabel sx={{ color: '#ff6b6b' }}>Detection Model</InputLabel>
                              <Select
                                value={settings.detectionModel}
                                label="Detection Model"
                                onChange={(e) => handleSettingChange('detectionModel', e.target.value)}
                                sx={{
                                  color: '#fff',
                                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6b6b' },
                                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6b6b' },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff6b6b' }
                                }}
                              >
                                <MenuItem value="YOLOv8-underwater"> YOLO v8 Underwater (Recommended)</MenuItem>
                                <MenuItem value="YOLOv11">YOLO v11</MenuItem>
                                <MenuItem value="RCNN">R-CNN</MenuItem>
                              </Select>
                            </FormControl>

                            <Typography gutterBottom sx={{ color: '#bcdcff', fontWeight: 'bold' }}>
                              Confidence Threshold: {(settings.confidenceThreshold * 100).toFixed(0)}%
                            </Typography>
                            <Slider
                              value={settings.confidenceThreshold}
                              onChange={(e, value) => handleSettingChange('confidenceThreshold', value)}
                              min={0.1}
                              max={1.0}
                              step={0.05}
                              valueLabelDisplay="auto"
                              valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                              sx={{
                                mb: 3,
                                '& .MuiSlider-thumb': {
                                  backgroundColor: '#ff6b6b',
                                  '&:hover': { boxShadow: '0 0 0 8px rgba(255,107,107,0.16)' }
                                },
                                '& .MuiSlider-track': { backgroundColor: '#ff6b6b' },
                                '& .MuiSlider-rail': { backgroundColor: 'rgba(255,107,107,0.3)' }
                              }}
                            />

                            <Typography gutterBottom sx={{ color: '#bcdcff', fontWeight: 'bold' }}>
                              NMS Threshold: {(settings.nmsThreshold * 100).toFixed(0)}%
                            </Typography>
                            <Slider
                              value={settings.nmsThreshold}
                              onChange={(e, value) => handleSettingChange('nmsThreshold', value)}
                              min={0.1}
                              max={1.0}
                              step={0.05}
                              valueLabelDisplay="auto"
                              valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                              sx={{
                                mb: 3,
                                '& .MuiSlider-thumb': {
                                  backgroundColor: '#ff6b6b',
                                  '&:hover': { boxShadow: '0 0 0 8px rgba(255,107,107,0.16)' }
                                },
                                '& .MuiSlider-track': { backgroundColor: '#ff6b6b' },
                                '& .MuiSlider-rail': { backgroundColor: 'rgba(255,107,107,0.3)' }
                              }}
                            />

                            {/* <TextField
                              fullWidth
                              label="Maximum Detections"
                              type="number"
                              value={settings.maxDetections}
                              onChange={(e) => handleSettingChange('maxDetections', parseInt(e.target.value) || 20)}
                              inputProps={{ min: 1, max: 100 }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  color: '#fff',
                                  '& fieldset': { borderColor: '#ff6b6b' },
                                  '&:hover fieldset': { borderColor: '#ff6b6b' },
                                  '&.Mui-focused fieldset': { borderColor: '#ff6b6b' }
                                },
                                '& .MuiInputLabel-root': { color: '#ff6b6b' }
                              }}
                            /> */}
                          </Box>
                        </Fade>
                      </Collapse>
                    </Paper>
                  </Zoom>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Performance Tab */}
            <TabPanel value={activeTab} index={1}>
              <Grid container spacing={3}>



              </Grid>
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel value={activeTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Zoom in={activeTab === 1} timeout={1000}>
                    <Paper sx={{
                      p: 4,
                      bgcolor: 'rgba(31,60,112,0.5)',
                      borderRadius: 3,
                      border: '1px solid rgba(126,207,255,0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#9c27b0',
                        boxShadow: '0 10px 30px rgba(156,39,176,0.2)'
                      }
                    }}>
                      <Typography variant="h6" gutterBottom sx={{
                        fontWeight: 'bold',
                        color: '#9c27b0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 4
                      }}>
                        <NotificationsIcon sx={{ animation: 'pulse 2s infinite' }} />
                         Alert & Notification Settings
                      </Typography>

                      <Grid container spacing={3}>
                        {[
                          { key: 'criticalThreatNotification', label: ' Critical Threat Notifications', desc: 'Immediate alerts for high-risk threats' },
                          { key: 'emailNotifications', label: ' Email Notifications', desc: 'Send detection reports via email' },
                          { key: 'smsAlerts', label: ' SMS Alerts', desc: 'Text message alerts for urgent threats' },
                          { key: 'slackIntegration', label: ' Slack Integration', desc: 'Post alerts to Slack channels' }
                        ].map((item, index) => (
                          <Grid item xs={12} md={6} key={item.key}>
                            <Slide direction="up" in={activeTab === 1} timeout={1000 + index * 200}>
                              <Paper sx={{
                                p: 3,
                                bgcolor: 'rgba(22,43,77,0.3)',
                                borderRadius: 2,
                                border: '1px solid rgba(156,39,176,0.2)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 8px 25px rgba(156,39,176,0.2)'
                                }
                              }}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={settings[item.key]}
                                      onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                                      sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#9c27b0' },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#9c27b0' }
                                      }}
                                    />
                                  }
                                  label={
                                    <Box>
                                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                        {item.label}
                                      </Typography>
                                      <Typography variant="body2" sx={{ color: '#bcdcff' }}>
                                        {item.desc}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Paper>
                            </Slide>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Zoom>
                </Grid>
              </Grid>
            </TabPanel>


          </CardContent>
        </Card>
      </Slide>

      {/* Action Panel */}
      <Slide direction="up" in={true} timeout={2000}>
        <Paper sx={{ 
          p: 3, 
          mt: 3,
          bgcolor: '#162b4d',
          borderRadius: 3,
          boxShadow: '0 15px 35px rgba(22,43,77,0.3)',
          border: '1px solid rgba(126,207,255,0.2)'
        }}>
          <Typography variant="h6" gutterBottom sx={{
            fontWeight: 'bold',
            color: '#7ecfff',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 3
          }}>
            <SettingsIcon sx={{ animation: 'spin 4s linear infinite' }} />
             Configuration Management
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            {[
              { 
                icon: <SaveIcon />, 
                label: 'Save Settings', 
                onClick: handleSaveSettings,
                color: '#4caf50',
                loading: saveStatus === 'saving'
              },
              { 
                icon: <DownloadIcon />, 
                label: 'Export Config', 
                onClick: handleExportConfig,
                color: '#2196f3'
              },
              { 
                icon: <UploadIcon />, 
                label: 'Import Config',
                color: '#ff9800'
              },
              { 
                icon: <RestartIcon />, 
                label: 'Restart System',
                color: '#f44336'
              }
            ].map((btn, index) => (
              <Zoom key={btn.label} in={true} timeout={2500 + index * 200}>
                <Button
                  variant={btn.label === 'Save Settings' ? 'contained' : 'outlined'}
                  startIcon={btn.icon}
                  onClick={btn.onClick}
                  disabled={btn.loading}
                  sx={{
                    minWidth: 150,
                    py: 1.5,
                    color: btn.label === 'Save Settings' ? 'white' : btn.color,
                    backgroundColor: btn.label === 'Save Settings' ? btn.color : 'transparent',
                    borderColor: btn.color,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: btn.color,
                      color: 'white',
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 30px ${btn.color}40`
                    },
                    '&:disabled': {
                      opacity: 0.6
                    }
                  }}
                >
                  {btn.loading ? 'Saving...' : btn.label}
                </Button>
              </Zoom>
            ))}
          </Box>

          <Fade in={true} timeout={3000}>
            <Alert 
              severity="warning" 
              sx={{
                bgcolor: 'rgba(255,152,0,0.2)',
                color: '#ff9800',
                border: '1px solid rgba(255,152,0,0.3)',
                '& .MuiAlert-icon': { color: '#ff9800' }
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                 <strong>Note:</strong> Some settings require a system restart to take effect. 
                Critical detection settings will be applied immediately.
              </Typography>
            </Alert>
          </Fade>
        </Paper>
      </Slide>

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
          0% { text-shadow: 0 0 20px #7ecfff40; }
          100% { text-shadow: 0 0 30px #7ecfff80, 0 0 40px #7ecfff40; }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default Settings;