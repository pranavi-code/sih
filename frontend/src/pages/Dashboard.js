import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  PhotoCamera as PhotoCameraIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dashboardAPI.getDashboardOverview();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Load sample data for prototype
      setDashboardData(getSampleDashboardData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleDashboardData = () => ({
    system_info: {
      version: '1.0.0',
      status: 'operational',
      uptime: '15d 4h 23m',
    },
    recent_activity: {
      last_24_hours: {
        images_processed: 67,
        threats_detected: 18,
        critical_alerts: 3,
        enhancement_requests: 52,
      },
    },
    quick_stats: {
      total_images_processed: 2543,
      total_threats_detected: 487,
      average_quality_improvement: '32%',
      system_accuracy: '94.7%',
    },
    alerts: [
      {
        id: 'alert_001',
        type: 'critical_threat',
        message: 'Submarine detected in sector 7-Alpha',
        timestamp: '2025-09-28T10:45:00Z',
        status: 'active',
      },
      {
        id: 'alert_002',
        type: 'system_warning',
        message: 'GPU utilization high (89%)',
        timestamp: '2025-09-28T10:30:00Z',
        status: 'acknowledged',
      },
    ],
    model_status: {
      enhancement_model: {
        status: 'loaded',
        version: 'GAN-v2.1',
        accuracy: '96.2%',
      },
      detection_model: {
        status: 'loaded',
        version: 'YOLOv8-underwater',
        accuracy: '94.7%',
      },
    },
  });

  // Sample chart data
  const processingTrendData = [
    { time: '00:00', processed: 12, threats: 3 },
    { time: '04:00', processed: 8, threats: 1 },
    { time: '08:00', processed: 25, threats: 7 },
    { time: '12:00', processed: 34, threats: 12 },
    { time: '16:00', processed: 28, threats: 9 },
    { time: '20:00', processed: 19, threats: 4 },
  ];

  const threatDistributionData = [
    { name: 'Submarine', count: 8, severity: 'critical' },
    { name: 'Diver', count: 15, severity: 'high' },
    { name: 'Drone', count: 6, severity: 'high' },
    { name: 'Mine', count: 3, severity: 'critical' },
    { name: 'Suspicious', count: 12, severity: 'medium' },
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Maritime Security Dashboard
      </Typography>

      {/* System Status Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #0277bd, #58a5f0)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhotoCameraIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Images Processed
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                {dashboardData?.recent_activity?.last_24_hours?.images_processed || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #d32f2f, #f57c00)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Threats Detected
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                {dashboardData?.recent_activity?.last_24_hours?.threats_detected || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #2e7d32, #66bb6a)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SpeedIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  System Accuracy
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                {dashboardData?.quick_stats?.system_accuracy || '0%'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Overall performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #7b1fa2, #ba68c8)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Quality Improvement
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                {dashboardData?.quick_stats?.average_quality_improvement || '0%'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Average enhancement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Alerts */}
      <Grid container spacing={3}>
        {/* Processing Trends Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Processing Activity (Last 24 Hours)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={processingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="processed" 
                    stroke="#0277bd" 
                    strokeWidth={3}
                    name="Images Processed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threats" 
                    stroke="#d32f2f" 
                    strokeWidth={3}
                    name="Threats Detected"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Alerts */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Active Alerts
              </Typography>
              <List>
                {dashboardData?.alerts?.map((alert, index) => (
                  <React.Fragment key={alert.id}>
                    <ListItem>
                      <ListItemIcon>
                        {alert.type === 'critical_threat' ? (
                          <ErrorIcon color="error" />
                        ) : (
                          <WarningIcon color="warning" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={alert.message}
                        secondary={new Date(alert.timestamp).toLocaleString()}
                      />
                    </ListItem>
                    {index < dashboardData.alerts.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              {(!dashboardData?.alerts || dashboardData.alerts.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography color="text.secondary">No active alerts</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Threat Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Threat Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={threatDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0277bd" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                AI Model Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1">Enhancement Model</Typography>
                  <Chip 
                    label={dashboardData?.model_status?.enhancement_model?.status || 'unknown'} 
                    color="success" 
                    size="small" 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Version: {dashboardData?.model_status?.enhancement_model?.version || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accuracy: {dashboardData?.model_status?.enhancement_model?.accuracy || 'N/A'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1">Detection Model</Typography>
                  <Chip 
                    label={dashboardData?.model_status?.detection_model?.status || 'unknown'} 
                    color="success" 
                    size="small" 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Version: {dashboardData?.model_status?.detection_model?.version || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accuracy: {dashboardData?.model_status?.detection_model?.accuracy || 'N/A'}
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                System Status: {dashboardData?.system_info?.status || 'Unknown'} • 
                Uptime: {dashboardData?.system_info?.uptime || 'N/A'}
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;