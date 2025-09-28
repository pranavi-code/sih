import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { metricsAPI } from '../services/api';

const Analytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Sample data for prototype
  const performanceData = [
    { date: '2025-09-22', processed: 45, threats: 12, avgPsnr: 28.2, avgSsim: 0.82 },
    { date: '2025-09-23', processed: 52, threats: 8, avgPsnr: 29.1, avgSsim: 0.84 },
    { date: '2025-09-24', processed: 38, threats: 15, avgPsnr: 27.8, avgSsim: 0.81 },
    { date: '2025-09-25', processed: 67, threats: 18, avgPsnr: 30.2, avgSsim: 0.86 },
    { date: '2025-09-26', processed: 43, threats: 9, avgPsnr: 28.9, avgSsim: 0.83 },
    { date: '2025-09-27', processed: 58, threats: 14, avgPsnr: 29.5, avgSsim: 0.85 },
    { date: '2025-09-28', processed: 67, threats: 18, avgPsnr: 31.2, avgSsim: 0.87 },
  ];

  const threatDistribution = [
    { name: 'Submarines', value: 23, color: '#d32f2f' },
    { name: 'Divers', value: 67, color: '#f57c00' },
    { name: 'Drones', value: 34, color: '#fbc02d' },
    { name: 'Mines', value: 12, color: '#7b1fa2' },
    { name: 'Suspicious', value: 89, color: '#388e3c' },
  ];

  const qualityTrends = [
    { metric: 'PSNR', current: 31.2, target: 30.0, trend: '+2.1%' },
    { metric: 'SSIM', current: 0.87, target: 0.85, trend: '+3.5%' },
    { metric: 'UIQM', current: 3.4, target: 3.0, trend: '+4.2%' },
    { metric: 'Processing Time', current: 2.1, target: 2.5, trend: '-8.7%' },
  ];

  const systemStats = {
    totalProcessed: 2543,
    totalThreats: 487,
    accuracyRate: 94.7,
    uptime: 99.2,
    avgResponseTime: 2.1,
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ paddingTop: 24 }}>
      {value === index && children}
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        System Analytics & Performance
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #0277bd, #58a5f0)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TimelineIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {systemStats.totalProcessed.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Images Processed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #d32f2f, #f57c00)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SecurityIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {systemStats.totalThreats}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Threats Detected
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #2e7d32, #66bb6a)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SpeedIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {systemStats.accuracyRate}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Detection Accuracy
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #7b1fa2, #ba68c8)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {systemStats.uptime}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                System Uptime
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different analytics views */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Performance Trends" />
            <Tab label="Quality Metrics" />
            <Tab label="Threat Analysis" />
            <Tab label="System Health" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Performance Trends Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              7-Day Performance Overview
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Processing Volume & Threat Detection
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="processed" stroke="#0277bd" strokeWidth={3} name="Images Processed" />
                      <Line type="monotone" dataKey="threats" stroke="#d32f2f" strokeWidth={3} name="Threats Detected" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Weekly Summary
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Total Processed</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0277bd' }}>
                      {performanceData.reduce((sum, day) => sum + day.processed, 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Total Threats</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                      {performanceData.reduce((sum, day) => sum + day.threats, 0)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Threat Rate</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                      {((performanceData.reduce((sum, day) => sum + day.threats, 0) / 
                         performanceData.reduce((sum, day) => sum + day.processed, 0)) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Quality Metrics Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Image Enhancement Quality Analysis
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Quality Metrics Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgPsnr" stroke="#2e7d32" strokeWidth={3} name="Avg PSNR" />
                      <Line type="monotone" dataKey="avgSsim" stroke="#7b1fa2" strokeWidth={3} name="Avg SSIM" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Metric</strong></TableCell>
                        <TableCell><strong>Current</strong></TableCell>
                        <TableCell><strong>Trend</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {qualityTrends.map((item) => (
                        <TableRow key={item.metric}>
                          <TableCell>{item.metric}</TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 'bold' }}>
                              {item.current}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={item.trend}
                              color={item.trend.startsWith('+') ? 'success' : 'primary'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Threat Analysis Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Threat Detection Analysis
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Threat Type Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={threatDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {threatDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Threat Frequency
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={threatDistribution} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0277bd" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* System Health Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              System Health & Performance
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Resource Utilization
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">CPU Usage</Typography>
                      <Typography variant="body2">45%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={45} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Memory Usage</Typography>
                      <Typography variant="body2">62%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={62} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">GPU Usage</Typography>
                      <Typography variant="body2">78%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={78} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Storage Usage</Typography>
                      <Typography variant="body2">34%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={34} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    System Status
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Alert severity="success">
                      All systems operational
                    </Alert>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">System Uptime</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      15d 4h 23m
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Average Response Time</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {systemStats.avgResponseTime}s
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Active Connections</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      12
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;