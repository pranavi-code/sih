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
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Save as SaveIcon,
  RestartAlt as RestartIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Enhancement Settings
    enhancementModel: 'GAN-v2.1',
    qualityTarget: 'high',
    batchSize: 4,
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
    
    // Performance Settings
    maxConcurrentRequests: 10,
    requestTimeout: 30,
    cacheEnabled: true,
    logLevel: 'INFO',
  });

  const [saveStatus, setSaveStatus] = useState(null);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    // In production, this would send settings to the backend
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
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

  const systemInfo = {
    version: '1.0.0',
    buildDate: '2025-09-28',
    pythonVersion: '3.11.4',
    tensorflowVersion: '2.13.0',
    opencvVersion: '4.8.1',
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        System Settings & Configuration
      </Typography>

      {saveStatus && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* AI Model Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                <SettingsIcon sx={{ mr: 1 }} />
                AI Model Configuration
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Image Enhancement
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Enhancement Model</InputLabel>
                  <Select
                    value={settings.enhancementModel}
                    label="Enhancement Model"
                    onChange={(e) => handleSettingChange('enhancementModel', e.target.value)}
                  >
                    <MenuItem value="GAN-v2.1">GAN v2.1 (Recommended)</MenuItem>
                    <MenuItem value="GAN-v2.0">GAN v2.0</MenuItem>
                    <MenuItem value="U-Net">U-Net</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Quality Target</InputLabel>
                  <Select
                    value={settings.qualityTarget}
                    label="Quality Target"
                    onChange={(e) => handleSettingChange('qualityTarget', e.target.value)}
                  >
                    <MenuItem value="high">High Quality (Slower)</MenuItem>
                    <MenuItem value="balanced">Balanced</MenuItem>
                    <MenuItem value="fast">Fast Processing</MenuItem>
                  </Select>
                </FormControl>

                <Typography gutterBottom>Batch Size: {settings.batchSize}</Typography>
                <Slider
                  value={settings.batchSize}
                  onChange={(e, value) => handleSettingChange('batchSize', value)}
                  min={1}
                  max={16}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ mb: 2 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.gpuAcceleration}
                      onChange={(e) => handleSettingChange('gpuAcceleration', e.target.checked)}
                    />
                  }
                  label="GPU Acceleration"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Threat Detection
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Detection Model</InputLabel>
                  <Select
                    value={settings.detectionModel}
                    label="Detection Model"
                    onChange={(e) => handleSettingChange('detectionModel', e.target.value)}
                  >
                    <MenuItem value="YOLOv8-underwater">YOLO v8 Underwater (Recommended)</MenuItem>
                    <MenuItem value="YOLOv11">YOLO v11</MenuItem>
                    <MenuItem value="RCNN">R-CNN</MenuItem>
                  </Select>
                </FormControl>

                <Typography gutterBottom>
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
                  sx={{ mb: 2 }}
                />

                <Typography gutterBottom>
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
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Maximum Detections"
                  type="number"
                  value={settings.maxDetections}
                  onChange={(e) => handleSettingChange('maxDetections', parseInt(e.target.value) || 20)}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                System Configuration
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Performance Settings
                </Typography>
                
                <TextField
                  fullWidth
                  label="Max Concurrent Requests"
                  type="number"
                  value={settings.maxConcurrentRequests}
                  onChange={(e) => handleSettingChange('maxConcurrentRequests', parseInt(e.target.value) || 10)}
                  sx={{ mb: 2 }}
                  inputProps={{ min: 1, max: 50 }}
                />

                <TextField
                  fullWidth
                  label="Request Timeout (seconds)"
                  type="number"
                  value={settings.requestTimeout}
                  onChange={(e) => handleSettingChange('requestTimeout', parseInt(e.target.value) || 30)}
                  sx={{ mb: 2 }}
                  inputProps={{ min: 5, max: 300 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.cacheEnabled}
                      onChange={(e) => handleSettingChange('cacheEnabled', e.target.checked)}
                    />
                  }
                  label="Enable Caching"
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Log Level</InputLabel>
                  <Select
                    value={settings.logLevel}
                    label="Log Level"
                    onChange={(e) => handleSettingChange('logLevel', e.target.value)}
                  >
                    <MenuItem value="DEBUG">Debug</MenuItem>
                    <MenuItem value="INFO">Info</MenuItem>
                    <MenuItem value="WARNING">Warning</MenuItem>
                    <MenuItem value="ERROR">Error</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Alert & Notification Settings
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.criticalThreatNotification}
                      onChange={(e) => handleSettingChange('criticalThreatNotification', e.target.checked)}
                    />
                  }
                  label="Critical Threat Notifications"
                  sx={{ display: 'block', mb: 1 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                  sx={{ display: 'block', mb: 1 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.smsAlerts}
                      onChange={(e) => handleSettingChange('smsAlerts', e.target.checked)}
                    />
                  }
                  label="SMS Alerts"
                  sx={{ display: 'block', mb: 1 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.slackIntegration}
                      onChange={(e) => handleSettingChange('slackIntegration', e.target.checked)}
                    />
                  }
                  label="Slack Integration"
                  sx={{ display: 'block', mb: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                System Information
              </Typography>
              
              <List>
                {Object.entries(systemInfo).map(([key, value]) => (
                  <ListItem key={key} divider>
                    <ListItemText 
                      primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      secondary={value}
                    />
                  </ListItem>
                ))}
              </List>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  System is running optimally. Last health check: 2 minutes ago
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Model Status & Management
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Enhancement Model"
                    secondary="GAN v2.1 - Last updated: 2025-09-20"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Loaded" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Detection Model"
                    secondary="YOLO v8 Underwater - Last updated: 2025-09-18"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Loaded" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<RestartIcon />}
                  sx={{ mr: 1, mb: 1 }}
                  size="small"
                >
                  Reload Models
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ mr: 1, mb: 1 }}
                  size="small"
                >
                  Update Models
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Configuration Management
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                sx={{ minWidth: 150 }}
              >
                Save Settings
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportConfig}
                sx={{ minWidth: 150 }}
              >
                Export Config
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                sx={{ minWidth: 150 }}
              >
                Import Config
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<RestartIcon />}
                color="warning"
                sx={{ minWidth: 150 }}
              >
                Restart System
              </Button>
            </Box>

            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Some settings require a system restart to take effect. 
                Critical detection settings will be applied immediately.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;