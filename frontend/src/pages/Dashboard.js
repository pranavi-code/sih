import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityIcon from '@mui/icons-material/Security';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();

  const headingColor = "#7ecfff";

  const cardBackgrounds = [
    '#162b4d',
    '#1f3c70',
    '#b84b59',
    '#559965',
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      color: '#FFFFFF', 
      py: 0, 
      px: 2, 
      bgcolor: 'transparent',
      overflow: 'hidden'
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 8,
          pt: 4,
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 800,
            color: headingColor,
            mb: 2,
            letterSpacing: 1.5,
            fontSize: { xs: 28, sm: 38, md: 44 },
          }}
        >
           Jal Nethra-जलनेत्र
        </Typography>
        <Typography
          align="center"
          sx={{
            color: '#dbe9ff',
            mb: 4,
            maxWidth: 600,
            fontSize: 18,
          }}
        >
          A unified platform for real-time image enhancement, threat detection, and actionable maritime safety insights. Designed to keep oceans safer and operations smarter.
        </Typography>
        <Button
          size="large"
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #6bbcff 30%, #3f78c7 100%)",
            color: "#fff",
            px: 4,
            py: 1.5,
            fontWeight: 700,
            fontSize: 18,
            boxShadow: '0 8px 32px rgba(107, 188, 255, 0.3)',
            borderRadius: 2,
            mb: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: "linear-gradient(45deg, #3f78c7 30%, #6bbcff 100%)",
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(107, 188, 255, 0.4)'
            },
          }}
          onClick={() => navigate('/processing')}
        >
          START PROCESSING
        </Button>
      </Box>

      {/* Steps Section */}
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ 
            fontWeight: 700, 
            color: headingColor, 
            mb: 5, 
            letterSpacing: 1,
          }}
        >
          How Our Website Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {['Upload Data', 'Image Enhancement', 'Threat Detection', 'Actionable Insights'].map((title, index) => {
            let icon = null;
            let description = '';

            switch (index) {
              case 0:
                icon = <CloudUploadIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />;
                description = 'Start by uploading maritime surveillance images or video footage directly to the platform.';
                break;
              case 1:
                icon = <VisibilityIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />;
                description = 'Our AI models improve visibility by enhancing clarity and quality of underwater or low-light visuals.';
                break;
              case 2:
                icon = <SecurityIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />;
                description = 'Advanced detection models identify submarines, mines, drones, and other threats in real time.';
                break;
              case 3:
                icon = <TrendingUpIcon sx={{ fontSize: 48, color: '#fff', mb: 2 }} />;
                description = 'Get real-time insights and alerts to respond quickly and maintain maritime security.';
                break;
              default:
                break;
            }

            return (
              <Grid item xs={12} sm={6} md={3} key={title}>
                <Paper
                  elevation={12}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    backgroundColor: cardBackgrounds[index],
                    borderRadius: 3,
                    color: '#fff',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
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
                    },
                  }}
                >
                  {icon}
                  <Typography sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {`${index + 1}. ${title}`}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      position: 'relative',
                      zIndex: 1,
                      lineHeight: 1.6
                    }}
                  >
                    {description}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;