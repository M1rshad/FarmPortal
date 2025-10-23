import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Close as CloseIcon,
  Map as MapIcon,
  Download as DownloadIcon,
  Inventory as BatchIcon,
  Terrain as PlotIcon,
  Schedule as DateIcon,
  ShoppingCart as ProductIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { requestService } from '../services/requestService';
import { useNavigate } from 'react-router-dom';

const PurchaseOrderDetailsModal = ({ open, onClose, requestId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [poResponse, setPOResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && requestId) {
      loadPOResponse();
    }
  }, [open, requestId]);

  const loadPOResponse = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await requestService.getPurchaseOrderResponse(requestId);
      setPOResponse(response);
    } catch (error) {
      console.error('Failed to load PO response:', error);
      setError('Failed to load purchase order details');
      toast.error('Failed to load purchase order details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getRiskColor = (percentage) => {
    if (percentage > 5) return 'error';
    if (percentage > 1) return 'warning';
    return 'success';
  };

  const handleViewPlots = () => {
    if (poResponse?.data?.plots?.length > 0) {
      // Navigate to a plot view or create a map modal
      navigate(`/shared-plots/${requestId}`);
    }
  };

  const exportPOData = () => {
    if (!poResponse) return;
    
    const exportData = {
      purchase_order: poResponse.request.purchase_order_number,
      supplier: poResponse.request.supplier,
      submission_date: poResponse.request.creation,
      summary: poResponse.summary,
      batches: poResponse.data.batches,
      plots: poResponse.data.plots,
      production_dates: poResponse.data.production_dates,
      products: poResponse.data.products
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PO_${poResponse.request.purchase_order_number}_Details.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Purchase order data exported');
  };

  if (loading) {
    return (
      <Dialog open={open} maxWidth="lg" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading purchase order details...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !poResponse) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            {error || 'No purchase order data available'}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const { request, data, summary } = poResponse;

  if (!data) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Purchase Order Details</DialogTitle>
        <DialogContent>
          <Alert severity="info">
            Purchase order data has not been submitted by the supplier yet.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            Purchase Order Details - {request.purchase_order_number}
          </Typography>
          <Box>
            <Button
              startIcon={<DownloadIcon />}
              onClick={exportPOData}
              sx={{ mr: 1 }}
            >
              Export
            </Button>
            <Button
              startIcon={<CloseIcon />}
              onClick={onClose}
            >
              Close
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BatchIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{summary.total_batches}</Typography>
                <Typography color="text.secondary">Batches</Typography>
                <Typography variant="caption" display="block">
                  {summary.eudr_relevant_batches} EUDR Relevant
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PlotIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{summary.total_plots}</Typography>
                <Typography color="text.secondary">Land Plots</Typography>
                <Typography variant="caption" display="block">
                  {Math.round(summary.total_area)} hectares
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ProductIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{summary.total_products}</Typography>
                <Typography color="text.secondary">Products</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4">{Math.round(summary.compliance_rate)}%</Typography>
                <Typography color="text.secondary">Compliance</Typography>
                <Typography variant="caption" display="block">
                  EUDR Relevant
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Sections */}
        <Grid container spacing={3}>
          {/* Batches Section */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BatchIcon sx={{ mr: 1 }} />
                Batch Details ({data.batches.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Batch Number</TableCell>
                      <TableCell>Validity Date</TableCell>
                      <TableCell>EUDR Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.batches.map((batch, index) => (
                      <TableRow key={index}>
                        <TableCell>{batch.batchNumber}</TableCell>
                        <TableCell>{formatDate(batch.validityDate)}</TableCell>
                        <TableCell>
                          <Chip
                            label={batch.eudrRelevant ? "Relevant" : "Not Relevant"}
                            color={batch.eudrRelevant ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Plots Section */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PlotIcon sx={{ mr: 1 }} />
                  Land Plots ({data.plots.length})
                </Typography>
                <Button
                  size="small"
                  startIcon={<MapIcon />}
                  onClick={handleViewPlots}
                  disabled={data.plots.length === 0}
                >
                  View on Map
                </Button>
              </Box>
              
              <List dense>
                {data.plots.map((plot) => (
                  <ListItem key={plot.id} divider>
                    <ListItemIcon>
                      {plot.deforestation_percentage > 5 ? 
                        <WarningIcon color="error" /> : 
                        <CheckIcon color="success" />
                      }
                    </ListItemIcon>
                    <ListItemText
                      primary={`${plot.plot_id} - ${plot.plot_name}`}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {plot.area} ha • {plot.country}
                          </Typography>
                          {plot.deforestation_percentage > 0 && (
                            <Chip
                              label={`${plot.deforestation_percentage.toFixed(1)}% deforestation`}
                              color={getRiskColor(plot.deforestation_percentage)}
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Production Dates Section */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DateIcon sx={{ mr: 1 }} />
                Production Dates ({data.production_date_scope.replace('_', ' ')})
              </Typography>
              
              <List dense>
                {data.production_dates.map((pd, index) => {
                  const isPerPlot = pd.type === 'plot';
                  const relatedItem = isPerPlot 
                    ? data.plots.find(p => p.id === pd.plotId)
                    : data.batches.find(b => b.id === pd.batchId);
                  
                  return (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={
                          isPerPlot 
                            ? `${relatedItem?.plot_id} - ${relatedItem?.plot_name}`
                            : `Batch: ${relatedItem?.batchNumber}`
                        }
                        secondary={`Production Date: ${formatDate(pd.date)}`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>

          {/* Products Section */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ProductIcon sx={{ mr: 1 }} />
                Products ({data.products.length})
              </Typography>
              
              <Grid container spacing={1}>
                {data.products.map((product) => (
                  <Grid item xs={12} sm={6} key={product.id}>
                    <Card variant="outlined">
                      <CardContent sx={{ py: 1 }}>
                        <Typography variant="subtitle2">{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.category}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* High Risk Alert */}
        {summary.high_risk_plots > 0 && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            ⚠️ {summary.high_risk_plots} plot(s) have high deforestation risk (&gt;5%). 
            Review EUDR compliance requirements.
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderDetailsModal;
