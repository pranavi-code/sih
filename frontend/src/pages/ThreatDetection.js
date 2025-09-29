import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Security as SecurityIcon,
  Download as DownloadIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { detectionAPI, utils } from '../services/api';

const ThreatDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [detectedImageUrl, setDetectedImageUrl] = useState(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setResults(null);
      setError(null);
      
      // Create preview URL for original image
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
      
      // Clean up detected image URL
      if (detectedImageUrl) {
        URL.revokeObjectURL(detectedImageUrl);
        setDetectedImageUrl(null);
      }
    }
  }, [detectedImageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleDetectThreats = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError(null);

    try {
      const result = await detectionAPI.processDetection(selectedFile, confidenceThreshold, true);
      setResults(result);

      // Get detected image with annotations
      if (result.annotated_image) {
        const filename = result.annotated_image.replace(/\\/g, '/').split('/').pop();
        const blob = await detectionAPI.getDetectedImage(filename);
        if (blob) {
          const url = utils.createImageUrl(blob);
          setDetectedImageUrl(url);
        }
      }
    } catch (err) {
      setError(err.message || 'Detection failed');
      console.error('Detection error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const getSeverityColor = (severity) => {
    return utils.getSeverityColor(severity);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <ErrorIcon sx={{ color: '#d32f2f' }} />;
      case 'high': return <WarningIcon sx={{ color: '#f57c00' }} />;
      case 'medium': return <WarningIcon sx={{ color: '#fbc02d' }} />;
      case 'low': return <CheckCircleIcon sx={{ color: '#388e3c' }} />;
      default: return <CheckCircleIcon sx={{ color: '#9e9e9e' }} />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Maritime Threat Detection
      </Typography>

      <Grid container spacing={3}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Upload Image for Analysis
              </Typography>
              
              <Paper
                {...getRootProps()}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an underwater image'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  or click to select from your computer
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: JPEG, PNG, BMP, TIFF (max 10MB)
                </Typography>
              </Paper>

              {selectedFile && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <strong>Selected:</strong> {selectedFile.name} ({utils.formatFileSize(selectedFile.size)})
                  </Alert>
                  
                  <Button
                    variant="contained"
                    onClick={handleDetectThreats}
                    disabled={processing}
                    startIcon={<SecurityIcon />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {processing ? 'Analyzing...' : 'Detect Threats'}
                  </Button>

                  {processing && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress />
                      <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                        Scanning for maritime threats with YOLO v11...
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          {results && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                  Detection Results
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  <Paper variant="outlined" sx={{ p: 2, minWidth: 200, flex: '1 1 220px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <SecurityIcon sx={{ color: results.total_detections > 0 ? '#d32f2f' : '#4caf50' }} />
                      <Typography sx={{ fontWeight: 'bold' }}>Overview</Typography>
                    </Box>
                    <Chip 
                      label={`${results.total_detections || 0} Threats`} 
                      color={results.total_detections > 0 ? 'error' : 'success'}
                      size="small"
                      sx={{ mr: 1, mb: 1 }} 
                    />
                    <Chip 
                      label={`Conf ≥ ${(confidenceThreshold * 100).toFixed(0)}%`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Paper>

                  {results.threat_summary && (
                    <Paper variant="outlined" sx={{ p: 2, minWidth: 240, flex: '1 1 260px' }}>
                      <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Severity Breakdown</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={`Critical ${results.threat_summary.critical_threats || 0}`} size="small" sx={{ backgroundColor: '#ffebee', color: '#d32f2f' }} />
                        <Chip label={`High ${results.threat_summary.high_threats || 0}`} size="small" sx={{ backgroundColor: '#fff3e0', color: '#f57c00' }} />
                        <Chip label={`Medium ${results.threat_summary.medium_threats || 0}`} size="small" sx={{ backgroundColor: '#fffde7', color: '#fbc02d' }} />
                      </Box>
                    </Paper>
                  )}

                  {results.threat_summary?.threat_types && (
                    <Paper variant="outlined" sx={{ p: 2, minWidth: 240, flex: '1 1 260px' }}>
                      <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Threat Types</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {Object.entries(results.threat_summary.threat_types).map(([type, count]) => (
                          <Chip key={type} label={`${type.replace('_',' ')} ${count}`} size="small" />
                        ))}
                      </Box>
                    </Paper>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      const payload = {
                        metadata: { created_at: new Date().toISOString(), filename: selectedFile?.name || 'image' },
                        total_detections: results.total_detections || 0,
                        threat_summary: results.threat_summary || {},
                        detections: results.detections || [],
                      };
                      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${(selectedFile?.name || 'results').replace(/\.[^.]+$/, '')}_detection.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download Report
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    disabled={!results?.annotated_image}
                    onClick={async () => {
                      const filename = (results?.annotated_image || '').replace(/\\/g, '/').split('/').pop();
                      if (!filename) return;
                      const blob = await detectionAPI.getDetectedImage(filename);
                      const url = utils.createImageUrl(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = filename;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download Annotated Image
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Detailed Detection Results */}
        {results && results.detections && results.detections.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Detected Threats
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Threat Type</strong></TableCell>
                        <TableCell><strong>Confidence</strong></TableCell>
                        <TableCell><strong>Severity</strong></TableCell>
                        <TableCell><strong>Location</strong></TableCell>
                        <TableCell><strong>Size</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.detections.map((detection, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getSeverityIcon(detection.severity)}
                              <Typography sx={{ ml: 1, fontWeight: 'bold' }}>
                                {detection.threat_type.replace('_', ' ').toUpperCase()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 'bold' }}>
                              {(detection.confidence * 100).toFixed(1)}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={detection.severity.toUpperCase()}
                              size="small"
                              sx={{ 
                                backgroundColor: getSeverityColor(detection.severity),
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              ({Math.round(detection.bbox.x1)}, {Math.round(detection.bbox.y1)}) 
                              - ({Math.round(detection.bbox.x2)}, {Math.round(detection.bbox.y2)})
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {Math.round(detection.area)} px²
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Image Comparison */}
        {originalImageUrl && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                  <VisibilityIcon sx={{ mr: 1 }} />
                  Detection Results Visualization
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Original Image
                      </Typography>
                      <Box
                        component="img"
                        src={originalImageUrl}
                        alt="Original"
                        sx={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: 400,
                          objectFit: 'contain',
                          borderRadius: 1,
                        }}
                      />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Detected Threats (Annotated)
                      </Typography>
                      {detectedImageUrl ? (
                        <Box
                          component="img"
                          src={detectedImageUrl}
                          alt="Detected"
                          sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 400,
                            objectFit: 'contain',
                            borderRadius: 1,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: 400,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'grey.100',
                            borderRadius: 1,
                          }}
                        >
                          <Typography color="text.secondary">
                            {processing ? 'Analyzing...' : 'Detection results will appear here'}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Threat Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Detectable Maritime Threats
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <ErrorIcon sx={{ color: '#d32f2f' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Submarines" 
                        secondary="Critical threat - Military underwater vessels with distinctive hull shapes and periscopes"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ErrorIcon sx={{ color: '#d32f2f' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Naval Mines" 
                        secondary="Critical threat - Explosive devices with spherical shapes and spike attachments"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon sx={{ color: '#f57c00' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Divers/Swimmers" 
                        secondary="High threat - Human figures with diving equipment and fins"
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon sx={{ color: '#f57c00' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Underwater Drones" 
                        secondary="High threat - Unmanned vehicles with propellers and camera equipment"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WarningIcon sx={{ color: '#fbc02d' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Suspicious Objects" 
                        secondary="Medium threat - Unidentified artificial objects or foreign materials"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Detection Accuracy:</strong> This system uses YOLO v11 trained on underwater imagery 
                with 94.7% accuracy for maritime threat detection.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThreatDetection;