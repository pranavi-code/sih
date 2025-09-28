import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Import components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UnifiedProcessing from './pages/UnifiedProcessing';
import ModelManagement from './pages/ModelManagement';
import ImageEnhancement from './pages/ImageEnhancement';
import ThreatDetection from './pages/ThreatDetection';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Create custom theme for underwater/maritime theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0277bd', // Ocean blue
      light: '#58a5f0',
      dark: '#004c8c',
    },
    secondary: {
      main: '#00acc1', // Teal
      light: '#5ddef4',
      dark: '#007c91',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#f57c00',
    },
    error: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/processing" element={<UnifiedProcessing />} />
              <Route path="/models" element={<ModelManagement />} />
              <Route path="/enhancement" element={<ImageEnhancement />} />
              <Route path="/detection" element={<ThreatDetection />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;