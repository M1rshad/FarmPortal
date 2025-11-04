import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { AddCircleOutline, Upload } from '@mui/icons-material';
import { landPlotService } from '../services/landPlotService';

const LandPlotUpload = ({ onSuccess }) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Create single plot state
  const [plotData, setPlotData] = useState({
    name: '',
    country: '',
    area_ha: '',
    geometry: ''
  });
  const [validationError, setValidationError] = useState('');

  // CSV import state
  const [selectedFile, setSelectedFile] = useState(null);
  const [importName, setImportName] = useState('');

  // Snackbar handler
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Validate GeoJSON
  const validateGeoJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.type || !parsed.coordinates) {
        return { valid: false, error: 'GeoJSON must have "type" and "coordinates" fields' };
      }
      if (!['Polygon', 'MultiPolygon'].includes(parsed.type)) {
        return { valid: false, error: 'Geometry type must be Polygon or MultiPolygon' };
      }
      return { valid: true, data: parsed };
    } catch (e) {
      return { valid: false, error: 'Invalid JSON format: ' + e.message };
    }
  };

  // Handle single plot creation
  const handleCreatePlot = async () => {
    setValidationError('');

    // Validate fields
    if (!plotData.name || !plotData.country || !plotData.area_ha || !plotData.geometry) {
      setValidationError('All fields are required');
      return;
    }

    // Validate GeoJSON
    const validation = validateGeoJSON(plotData.geometry);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    setLoading(true);
    try {
      await landPlotService.createLandPlot({
        name: plotData.name,
        country: plotData.country,
        area_ha: Number(plotData.area_ha),
        geometry: validation.data
      }, true);

      showSnackbar('Land plot created successfully!', 'success');
      setCreateDialogOpen(false);
      setPlotData({ name: '', country: '', area_ha: '', geometry: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      showSnackbar('Failed to create land plot: ' + error.message, 'error');
      console.error('Create plot error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV import
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        showSnackbar('Please select a CSV file', 'error');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleImportCSV = async () => {
    if (!selectedFile) {
      showSnackbar('Please select a CSV file', 'error');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Begin import
      const importDoc = await landPlotService.beginImport();
      setImportName(importDoc.name);

      // Step 2: Upload file
      await landPlotService.uploadImportFile({
        name: importDoc.name,
        file: selectedFile
      });

      // Step 3: Finalize import
      await landPlotService.finalizeImport({
        name: importDoc.name,
        total_plots: 0, // Server will calculate
        log: 'Import completed',
        status: 'Completed'
      });

      showSnackbar('CSV imported successfully!', 'success');
      setImportDialogOpen(false);
      setSelectedFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      showSnackbar('Failed to import CSV: ' + error.message, 'error');
      console.error('CSV import error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Empty State */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 2,
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          border: '2px dashed #ddd'
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Land Plots Available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create a new land plot or import multiple plots from CSV
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Plot
          </Button>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={() => setImportDialogOpen(true)}
          >
            Import CSV
          </Button>
        </Box>
      </Box>

      {/* Create Plot Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => !loading && setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Land Plot</DialogTitle>
        <DialogContent>
          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Plot Name"
            value={plotData.name}
            onChange={(e) => setPlotData({ ...plotData, name: e.target.value })}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Country"
            value={plotData.country}
            onChange={(e) => setPlotData({ ...plotData, country: e.target.value })}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Area (hectares)"
            type="number"
            value={plotData.area_ha}
            onChange={(e) => setPlotData({ ...plotData, area_ha: e.target.value })}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Geometry (GeoJSON)"
            multiline
            rows={6}
            value={plotData.geometry}
            onChange={(e) => setPlotData({ ...plotData, geometry: e.target.value })}
            margin="normal"
            placeholder='{"type": "Polygon", "coordinates": [[[lng, lat], [lng, lat], ...]]}'
            helperText="Paste GeoJSON Polygon or MultiPolygon. Coordinates must be [longitude, latitude]"
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePlot} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Plot'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog 
        open={importDialogOpen} 
        onClose={() => !loading && setImportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Land Plots from CSV</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload a CSV file containing land plot data. The CSV should include columns for plot name, country, area, and coordinates.
            </Typography>
            
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ py: 2 }}
            >
              {selectedFile ? selectedFile.name : 'Choose CSV File'}
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleFileSelect}
              />
            </Button>

            {selectedFile && (
              <Alert severity="info" sx={{ mt: 2 }}>
                File selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setImportDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleImportCSV} 
            variant="contained" 
            disabled={loading || !selectedFile}
          >
            {loading ? <CircularProgress size={24} /> : 'Import'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LandPlotUpload;
