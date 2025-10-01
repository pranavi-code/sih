import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
  Box,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AutoFixHigh as AutoFixHighIcon,
  Memory as MemoryIcon,
  PhotoCamera as PhotoCameraIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Add states for notification and warning menus
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [warningsAnchor, setWarningsAnchor] = useState(null);
  
  // Sample notifications and warnings data
  const notifications = [
    { id: 1, text: 'New threat detected in Bay of Bengal sector', time: '10 minutes ago' },
    { id: 2, text: 'Enhancement model update available', time: '1 hour ago' },
    { id: 3, text: 'System maintenance scheduled', time: '3 hours ago' },
  ];
  
  const warnings = [
    { id: 1, text: 'Critical: High turbidity detected in surveillance zone A4', level: 'critical' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Handle opening notification menu
  const handleNotificationsClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };
  
  // Handle closing notification menu
  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };
  
  // Handle opening warnings menu
  const handleWarningsClick = (event) => {
    setWarningsAnchor(event.currentTarget);
  };
  
  // Handle closing warnings menu
  const handleWarningsClose = () => {
    setWarningsAnchor(null);
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Unified Processing', icon: <AutoFixHighIcon />, path: '/processing' },
    { text: 'Model Management', icon: <MemoryIcon />, path: '/models' },
    { text: 'Image Enhancement', icon: <PhotoCameraIcon />, path: '/enhancement' },
    { text: 'Threat Detection', icon: <SecurityIcon />, path: '/detection' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #0277bd, #00acc1)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Maritime AI System
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ py: 1 }}>
        {navigationItems.map((item, index) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              my: 0.5, // Add margin top and bottom for spacing
              '&.Mui-selected': {
                backgroundColor: 'rgba(2, 119, 189, 0.1)',
                borderRight: '3px solid #0277bd',
              },
              '&:hover': {
                backgroundColor: 'rgba(2, 119, 189, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#0277bd' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{ 
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? '#0277bd' : 'inherit',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" color="text.secondary">
          System Status: Online
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(90deg, #0a1929 0%, #132f4c 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            AI-Based Underwater Image Enhancement System
          </Typography>
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationsClick}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="System Warnings">
            <IconButton color="inherit" onClick={handleWarningsClick}>
              <Badge badgeContent={1} color="warning">
                <WarningIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'linear-gradient(180deg, #0a1929 0%, #132f4c 100%)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 320,
            maxHeight: 400,
            overflow: 'auto',
            mt: 1.5,
            backgroundColor: '#132f4c',
            color: '#fff',
            borderRadius: 1,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
          <IconButton size="small" onClick={handleNotificationsClose} sx={{ color: '#fff' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationsClose} sx={{ py: 1.5 }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {notification.text}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem onClick={handleNotificationsClose} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: '#0277bd' }}>
            View all notifications
          </Typography>
        </MenuItem>
      </Menu>
      
      {/* Warnings Menu */}
      <Menu
        anchorEl={warningsAnchor}
        open={Boolean(warningsAnchor)}
        onClose={handleWarningsClose}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 320,
            maxHeight: 400,
            overflow: 'auto',
            mt: 1.5,
            backgroundColor: '#132f4c',
            color: '#fff',
            borderRadius: 1,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            System Warnings
          </Typography>
          <IconButton size="small" onClick={handleWarningsClose} sx={{ color: '#fff' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        {warnings.map((warning) => (
          <MenuItem 
            key={warning.id} 
            onClick={handleWarningsClose} 
            sx={{ 
              py: 1.5, 
              borderLeft: warning.level === 'critical' ? '3px solid #f44336' : 'none'
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {warning.text}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: warning.level === 'critical' ? '#f44336' : 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'uppercase',
                  fontWeight: 'bold'
                }}
              >
                {warning.level}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <MenuItem onClick={handleWarningsClose} sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: '#0277bd' }}>
            View all warnings
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Navbar;