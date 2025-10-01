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
  Fade,
  Slide,
  Zoom,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Sample data for prototype
  const performanceData = [
    { date: '09-22', processed: 45, threats: 12, avgPsnr: 28.2, avgSsim: 0.82 },
    { date: '09-23', processed: 52, threats: 8, avgPsnr: 29.1, avgSsim: 0.84 },
    { date: '09-24', processed: 38, threats: 15, avgPsnr: 27.8, avgSsim: 0.81 },
    { date: '09-25', processed: 67, threats: 18, avgPsnr: 30.2, avgSsim: 0.86 },
    { date: '09-26', processed: 43, threats: 9, avgPsnr: 28.9, avgSsim: 0.83 },
    { date: '09-27', processed: 58, threats: 14, avgPsnr: 29.5, avgSsim: 0.85 },
    { date: '09-28', processed: 67, threats: 18, avgPsnr: 31.2, avgSsim: 0.87 },
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

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <Fade in={value === index} timeout={800}>
            <Box>{children}</Box>
          </Fade>
        </Box>
      )}
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
            📊 System Analytics & Performance
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
            Real-time monitoring and performance insights for maritime AI systems
          </Typography>
        </Box>
      </Fade>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={800}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: 3,
              boxShadow: '0 15px 35px rgba(102,126,234,0.3)',
              border: '1px solid rgba(126,207,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 25px 50px rgba(102,126,234,0.4)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TimelineIcon sx={{ 
                  fontSize: 40, 
                  color: 'white', 
                  mb: 1,
                  animation: 'pulse 2s infinite'
                }} />
                <Typography variant="h4" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {systemStats.totalProcessed.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Images Processed
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={1000}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              borderRadius: 3,
              boxShadow: '0 15px 35px rgba(240,147,251,0.3)',
              border: '1px solid rgba(126,207,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 25px 50px rgba(240,147,251,0.4)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SecurityIcon sx={{ 
                  fontSize: 40, 
                  color: 'white', 
                  mb: 1,
                  animation: 'pulse 2s infinite 0.5s'
                }} />
                <Typography variant="h4" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {systemStats.totalThreats}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Threats Detected
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={1200}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
              borderRadius: 3,
              boxShadow: '0 15px 35px rgba(79,172,254,0.3)',
              border: '1px solid rgba(126,207,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 25px 50px rgba(79,172,254,0.4)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SpeedIcon sx={{ 
                  fontSize: 40, 
                  color: 'white', 
                  mb: 1,
                  animation: 'pulse 2s infinite 1s'
                }} />
                <Typography variant="h4" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {systemStats.accuracyRate}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Detection Accuracy
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={1400}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #fa709a, #fee140)',
              borderRadius: 3,
              boxShadow: '0 15px 35px rgba(250,112,154,0.3)',
              border: '1px solid rgba(126,207,255,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 25px 50px rgba(250,112,154,0.4)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUpIcon sx={{ 
                  fontSize: 40, 
                  color: 'white', 
                  mb: 1,
                  animation: 'pulse 2s infinite 1.5s'
                }} />
                <Typography variant="h4" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  {systemStats.uptime}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  System Uptime
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      {/* Main Analytics Dashboard */}
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
              value={tabValue} 
              onChange={handleTabChange} 
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
              <Tab 
                label="Performance Trends" 
                id="analytics-tab-0"
                aria-controls="analytics-tabpanel-0"
              />
              <Tab 
                label="Quality Metrics" 
                id="analytics-tab-1"
                aria-controls="analytics-tabpanel-1"
              />
              <Tab 
                label="Threat Analysis" 
                id="analytics-tab-2"
                aria-controls="analytics-tabpanel-2"
              />
              <Tab 
                label="System Health" 
                id="analytics-tab-3"
                aria-controls="analytics-tabpanel-3"
              />
            </Tabs>
          </Box>

          <CardContent>
            {/* Performance Trends Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: '#7ecfff',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3
              }}>
                <AnalyticsIcon /> 📈 7-Day Performance Overview
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(31,60,112,0.5)',
                    borderRadius: 3,
                    border: '1px solid rgba(126,207,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 10px 30px rgba(31,60,112,0.4)'
                    }
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      color: '#7ecfff'
                    }}>
                      Processing Volume & Threat Detection
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(126,207,255,0.2)" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#bcdcff"
                          fontSize={12}
                        />
                        <YAxis stroke="#bcdcff" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f3c70',
                            border: '1px solid #7ecfff',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="processed" 
                          stroke="#7ecfff" 
                          strokeWidth={3} 
                          name="Images Processed"
                          dot={{ fill: '#7ecfff', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#7ecfff', strokeWidth: 2, fill: '#fff' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="threats" 
                          stroke="#ff6b6b" 
                          strokeWidth={3} 
                          name="Threats Detected"
                          dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#ff6b6b', strokeWidth: 2, fill: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(31,60,112,0.5)',
                    borderRadius: 3,
                    border: '1px solid rgba(126,207,255,0.2)',
                    height: 'fit-content'
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      color: '#7ecfff'
                    }}>
                      📊 Weekly Summary
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#bcdcff' }}>Total Processed</Typography>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 'bold', 
                        color: '#7ecfff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {performanceData.reduce((sum, day) => sum + day.processed, 0)}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#bcdcff' }}>Total Threats</Typography>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 'bold', 
                        color: '#ff6b6b',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {performanceData.reduce((sum, day) => sum + day.threats, 0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#bcdcff' }}>Threat Rate</Typography>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 'bold', 
                        color: '#ffa726',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
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
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: '#7ecfff',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3
              }}>
                <SpeedIcon /> 🎯 Image Enhancement Quality Analysis
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(31,60,112,0.5)',
                    borderRadius: 3,
                    border: '1px solid rgba(126,207,255,0.2)'
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      color: '#7ecfff'
                    }}>
                      Quality Metrics Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(126,207,255,0.2)" />
                        <XAxis dataKey="date" stroke="#bcdcff" fontSize={12} />
                        <YAxis stroke="#bcdcff" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f3c70',
                            border: '1px solid #7ecfff',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avgPsnr" 
                          stroke="#4caf50" 
                          strokeWidth={3} 
                          name="Avg PSNR"
                          dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avgSsim" 
                          stroke="#9c27b0" 
                          strokeWidth={3} 
                          name="Avg SSIM"
                          dot={{ fill: '#9c27b0', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TableContainer component={Paper} sx={{
                    bgcolor: 'rgba(31,60,112,0.5)',
                    borderRadius: 3,
                    border: '1px solid rgba(126,207,255,0.2)'
                  }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ '& th': { color: '#7ecfff', fontWeight: 'bold' } }}>
                          <TableCell>Metric</TableCell>
                          <TableCell>Current</TableCell>
                          <TableCell>Trend</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {qualityTrends.map((item, index) => (
                          <TableRow key={item.metric} sx={{ 
                            '& td': { color: '#fff', borderColor: 'rgba(126,207,255,0.1)' },
                            '&:hover': {
                              backgroundColor: 'rgba(126,207,255,0.1)'
                            }
                          }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>{item.metric}</TableCell>
                            <TableCell>
                              <Typography sx={{ fontWeight: 'bold', color: '#7ecfff' }}>
                                {item.current}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={item.trend}
                                size="small"
                                sx={{
                                  backgroundColor: item.trend.startsWith('+') ? '#4caf50' : '#2196f3',
                                  color: 'white',
                                  fontWeight: 'bold'
                                }}
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
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: '#7ecfff',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3
              }}>
                <SecurityIcon /> 🛡️ Threat Detection Analysis
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(31,60,112,0.5)',
                    borderRadius: 3,
                    border: '1px solid rgba(126,207,255,0.2)'
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      color: '#7ecfff'
                    }}>
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
                          stroke="#fff"
                          strokeWidth={2}
                        >
                          {threatDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f3c70',
                            border: '1px solid #7ecfff',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(31,60,112,0.5)',
                    borderRadius: 3,
                    border: '1px solid rgba(126,207,255,0.2)'
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      color: '#7ecfff'
                    }}>
                      Threat Frequency
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={threatDistribution} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(126,207,255,0.2)" />
                        <XAxis type="number" stroke="#bcdcff" fontSize={12} />
                        <YAxis dataKey="name" type="category" width={80} stroke="#bcdcff" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#1f3c70',
                            border: '1px solid #7ecfff',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Bar dataKey="value" fill="#7ecfff" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* System Health Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: '#7ecfff',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3
              }}>
                <ComputerIcon /> ⚡ System Health & Performance
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(31,60,112,0.5)',
                    borderRadius: 3,
                    border: '1px solid rgba(126,207,255,0.2)'
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      color: '#7ecfff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <MemoryIcon /> Resource Utilization
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#bcdcff' }}>CPU Usage</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#7ecfff' }}>45%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={45} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(126,207,255,0.2)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#7ecfff',
                            borderRadius: 4
                          }
                        }} 
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#bcdcff' }}>Memory Usage</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800' }}>62%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={62} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(255,152,0,0.2)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#ff9800',
                            borderRadius: 4
                          }
                        }} 
                      />
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#bcdcff' }}>GPU Usage</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336' }}>78%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={78} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(244,67,54,0.2)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#f44336',
                            borderRadius: 4
                          }
                        }} 
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#bcdcff' }}>Storage Usage</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>34%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={34} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(76,175,80,0.2)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#4caf50',
                            borderRadius: 4
                          }
                        }} 
                      />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(31,60,112,0.5)',
                    borderRadius: 3,
                    border: '1px solid rgba(126,207,255,0.2)'
                  }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      color: '#7ecfff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <StorageIcon /> System Status
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Alert 
                        severity="success" 
                        sx={{
                          bgcolor: 'rgba(76,175,80,0.2)',
                          color: '#4caf50',
                          border: '1px solid rgba(76,175,80,0.3)',
                          '& .MuiAlert-icon': {
                            color: '#4caf50'
                          }
                        }}
                      >
                        ✅ All systems operational
                      </Alert>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#bcdcff' }}>System Uptime</Typography>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 'bold',
                        color: '#7ecfff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        15d 4h 23m
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#bcdcff' }}>Average Response Time</Typography>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 'bold',
                        color: '#7ecfff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {systemStats.avgResponseTime}s
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#bcdcff' }}>Active Connections</Typography>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 'bold',
                        color: '#7ecfff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        12
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </CardContent>
        </Card>
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
      `}</style>
    </Box>
  );
};

export default Analytics;