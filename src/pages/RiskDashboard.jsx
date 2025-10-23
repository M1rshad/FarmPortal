// // frontend/src/pages/RiskDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Grid,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   List,
//   ListItem,
//   ListItemText,
//   Chip,
//   LinearProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Divider
// } from '@mui/material';
// import {
//   Assessment as AssessmentIcon,
//   Warning as WarningIcon,
//   CheckCircle as CheckIcon,
//   PendingActions as PendingIcon,
//   Refresh as RefreshIcon
// } from '@mui/icons-material';
// import { riskService } from '../services/riskService';
// import { customerService } from '../services/customerService';
// import { toast } from 'react-toastify';

// const RiskDashboard = () => {
//   const [loading, setLoading] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [riskData, setRiskData] = useState({
//     suppliers: [],
//     summary: {
//       totalSuppliers: 0,
//       highRisk: 0,
//       mediumRisk: 0,
//       lowRisk: 0,
//       pendingAnalysis: 0
//     }
//   });

//   useEffect(() => {
//     fetchRiskData();
//   }, []);

//   const fetchRiskData = async () => {
//     try {
//       setLoading(true);
//       // In real implementation, this would fetch actual risk data
//       const response = await customerService.getSuppliers();
      
//       // Mock risk categorization based on EUDR requirements
//       const suppliers = response.data.suppliers.map(supplier => ({
//         ...supplier,
//         riskLevel: Math.random() > 0.5 ? 'low' : Math.random() > 0.5 ? 'medium' : 'high',
//         lastAnalysis: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
//         compliance: Math.floor(Math.random() * 100),
//         issues: Math.floor(Math.random() * 5),
//         deforestationRisk: Math.random() > 0.7 ? 'high' : 'low',
//         geoDataComplete: Math.random() > 0.3,
//         documentsComplete: Math.random() > 0.4
//       }));

//       const summary = suppliers.reduce((acc, curr) => {
//         acc.totalSuppliers++;
//         if (curr.riskLevel === 'high') acc.highRisk++;
//         if (curr.riskLevel === 'medium') acc.mediumRisk++;
//         if (curr.riskLevel === 'low') acc.lowRisk++;
//         if (!curr.lastAnalysis || new Date(curr.lastAnalysis) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
//           acc.pendingAnalysis++;
//         }
//         return acc;
//       }, {
//         totalSuppliers: 0,
//         highRisk: 0,
//         mediumRisk: 0,
//         lowRisk: 0,
//         pendingAnalysis: 0
//       });

//       setRiskData({ suppliers, summary });
//     } catch (error) {
//       toast.error('Failed to fetch risk data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const runRiskAnalysis = async () => {
//     try {
//       setAnalyzing(true);
//       await riskService.trigger();
//       toast.success('Risk analysis completed successfully');
//       // Refresh data after analysis
//       setTimeout(() => {
//         fetchRiskData();
//       }, 2000);
//     } catch (error) {
//       toast.error('Risk analysis failed');
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   const getRiskColor = (level) => {
//     switch (level) {
//       case 'high': return 'error';
//       case 'medium': return 'warning';
//       case 'low': return 'success';
//       default: return 'default';
//     }
//   };

//   const getRiskIcon = (level) => {
//     switch (level) {
//       case 'high': return <WarningIcon color="error" />;
//       case 'medium': return <PendingIcon color="warning" />;
//       case 'low': return <CheckIcon color="success" />;
//       default: return <PendingIcon />;
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4">EUDR Risk Dashboard</Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="outlined"
//             startIcon={<RefreshIcon />}
//             onClick={fetchRiskData}
//           >
//             Refresh
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<AssessmentIcon />}
//             onClick={runRiskAnalysis}
//             disabled={analyzing}
//           >
//             {analyzing ? 'Analyzing...' : 'Run Risk Analysis'}
//           </Button>
//         </Box>
//       </Box>

//       {/* Summary Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Total Suppliers
//               </Typography>
//               <Typography variant="h4">
//                 {riskData.summary.totalSuppliers}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 High Risk
//               </Typography>
//               <Typography variant="h4" color="error.main">
//                 {riskData.summary.highRisk}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Medium Risk
//               </Typography>
//               <Typography variant="h4" color="warning.main">
//                 {riskData.summary.mediumRisk}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Low Risk
//               </Typography>
//               <Typography variant="h4" color="success.main">
//                 {riskData.summary.lowRisk}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Risk Analysis Progress */}
//       {analyzing && (
//         <Alert severity="info" sx={{ mb: 3 }}>
//           <Typography variant="body2" sx={{ mb: 1 }}>
//             Running EUDR compliance analysis...
//           </Typography>
//           <LinearProgress />
//         </Alert>
//       )}

//       {/* Pending Analysis Alert */}
//       {riskData.summary.pendingAnalysis > 0 && (
//         <Alert severity="warning" sx={{ mb: 3 }}>
//           {riskData.summary.pendingAnalysis} supplier(s) require analysis or have outdated risk assessments.
//         </Alert>
//       )}

//       {/* Detailed Supplier Risk Table */}
//       <Paper>
//         <Box sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             Supplier Risk Details
//           </Typography>
//         </Box>
//         <Divider />
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Supplier</TableCell>
//                 <TableCell>Country</TableCell>
//                 <TableCell>Risk Level</TableCell>
//                 <TableCell>Compliance Score</TableCell>
//                 <TableCell>Deforestation Risk</TableCell>
//                 <TableCell>Geo Data</TableCell>
//                 <TableCell>Documents</TableCell>
//                 <TableCell>Last Analysis</TableCell>
//                 <TableCell>Issues</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {riskData.suppliers.map((supplier) => (
//                 <TableRow key={supplier._id}>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       {getRiskIcon(supplier.riskLevel)}
//                       {supplier.supplier_name}
//                     </Box>
//                   </TableCell>
//                   <TableCell>{supplier.country || 'N/A'}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={supplier.riskLevel?.toUpperCase()} 
//                       color={getRiskColor(supplier.riskLevel)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <LinearProgress 
//                         variant="determinate" 
//                         value={supplier.compliance} 
//                         sx={{ width: 60, height: 8 }}
//                       />
//                       <Typography variant="caption">
//                         {supplier.compliance}%
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={supplier.deforestationRisk} 
//                       color={supplier.deforestationRisk === 'high' ? 'error' : 'success'}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={supplier.geoDataComplete ? 'Complete' : 'Missing'} 
//                       color={supplier.geoDataComplete ? 'success' : 'error'}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={supplier.documentsComplete ? 'Complete' : 'Incomplete'} 
//                       color={supplier.documentsComplete ? 'success' : 'warning'}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="caption">
//                       {supplier.lastAnalysis ? 
//                         new Date(supplier.lastAnalysis).toLocaleDateString() : 
//                         'Never'
//                       }
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     {supplier.issues > 0 ? (
//                       <Chip 
//                         label={`${supplier.issues} issues`} 
//                         color="error" 
//                         size="small"
//                       />
//                     ) : (
//                       <Chip 
//                         label="No issues" 
//                         color="success" 
//                         size="small"
//                       />
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {riskData.suppliers.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center">
//                     No suppliers found. Add suppliers to see risk analysis.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// };

// export default RiskDashboard;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  PendingActions as PendingIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Map as MapIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { riskService } from '../services/riskService';
import { toast } from 'react-toastify';

const RiskDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [expandedSupplier, setExpandedSupplier] = useState(null);
  const [plotDetailsDialog, setPlotDetailsDialog] = useState(false);
  const [selectedPlots, setSelectedPlots] = useState([]);
  const [riskData, setRiskData] = useState({
    suppliers: [],
    summary: {
      total_suppliers: 0,
      high_risk: 0,
      medium_risk: 0,
      low_risk: 0,
      unknown_risk: 0,
      total_plots: 0,
      total_area: 0,
      total_deforestation: 0,
      avg_compliance: 0
    }
  });

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      const response = await riskService.getRiskDashboardData();
      console.log('Risk data received:', response);
      setRiskData(response);
    } catch (error) {
      console.error('Failed to fetch risk data:', error);
      toast.error('Failed to fetch risk data');
    } finally {
      setLoading(false);
    }
  };

  const runRiskAnalysis = async () => {
    try {
      setAnalyzing(true);
      await riskService.trigger();
      toast.success('Risk analysis completed successfully');
      setTimeout(() => {
        fetchRiskData();
      }, 1000);
    } catch (error) {
      console.error('Risk analysis failed:', error);
      toast.error('Risk analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return <WarningIcon color="error" />;
      case 'medium': return <PendingIcon color="warning" />;
      case 'low': return <CheckIcon color="success" />;
      default: return <PendingIcon />;
    }
  };

  const handleSupplierExpand = (supplierName) => {
    setExpandedSupplier(expandedSupplier === supplierName ? null : supplierName);
  };

  const handleViewSharedPlots = (requestId) => {
    navigate(`/shared-plots/${requestId}`);
  };

  const handlePlotDetails = (plots) => {
    setSelectedPlots(plots);
    setPlotDetailsDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading risk analysis...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>EUDR Risk Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchRiskData}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            onClick={runRiskAnalysis}
            disabled={analyzing}
          >
            {analyzing ? 'Analyzing...' : 'Run Risk Analysis'}
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Total Suppliers
              </Typography>
              <Typography variant="h4">
                {riskData.summary.total_suppliers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                High Risk
              </Typography>
              <Typography variant="h4" color="error.main">
                {riskData.summary.high_risk}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Medium Risk
              </Typography>
              <Typography variant="h4" color="warning.main">
                {riskData.summary.medium_risk}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Low Risk
              </Typography>
              <Typography variant="h4" color="success.main">
                {riskData.summary.low_risk}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Total Plots
              </Typography>
              <Typography variant="h4">
                {riskData.summary.total_plots}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Avg. Compliance
              </Typography>
              <Typography variant="h4" color="primary.main">
                {Math.round(riskData.summary.avg_compliance)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Risk Analysis Progress */}
      {analyzing && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Running EUDR compliance analysis...
          </Typography>
          <LinearProgress />
        </Alert>
      )}

      {/* High Risk Alert */}
      {riskData.summary.high_risk > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          ⚠️ {riskData.summary.high_risk} supplier(s) have HIGH deforestation risk. Immediate action required for EUDR compliance.
        </Alert>
      )}

      {/* Detailed Supplier Risk Table */}
      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Supplier Risk Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based on shared land plot deforestation data
          </Typography>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="40"></TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Compliance Score</TableCell>
                <TableCell>Shared Plots</TableCell>
                <TableCell>Total Area (ha)</TableCell>
                <TableCell>Avg. Deforestation</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riskData.suppliers.map((supplier) => (
                <React.Fragment key={supplier.name}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleSupplierExpand(supplier.name)}
                      >
                        {expandedSupplier === supplier.name ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getRiskIcon(supplier.overall_risk)}
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {supplier.supplier_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {supplier.supplier_group}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{supplier.country}</TableCell>
                    <TableCell>
                      <Chip 
                        label={supplier.overall_risk?.toUpperCase()} 
                        color={getRiskColor(supplier.overall_risk)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={supplier.compliance_score} 
                          sx={{ 
                            width: 60, 
                            height: 8,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: supplier.compliance_score > 80 ? 'success.main' : 
                                             supplier.compliance_score > 60 ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                        <Typography variant="caption">
                          {Math.round(supplier.compliance_score)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${supplier.shared_plots.length} plots`}
                        variant="outlined"
                        size="small"
                        onClick={() => handlePlotDetails(supplier.shared_plots)}
                        clickable
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {Math.round(supplier.total_area)} ha
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        color={supplier.avg_deforestation > 5 ? 'error' : 
                               supplier.avg_deforestation > 1 ? 'warning.main' : 'success.main'}
                      >
                        {supplier.avg_deforestation.toFixed(2)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewSharedPlots(supplier.requests[0]?.id)}
                          title="View on Map"
                        >
                          <MapIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleSupplierExpand(supplier.name)}
                          title="View Details"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Row - Plot Details */}
                  <TableRow>
                    <TableCell colSpan={9} sx={{ p: 0 }}>
                      <Collapse in={expandedSupplier === supplier.name}>
                        <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Shared Land Plot Details
                          </Typography>
                          <Grid container spacing={2}>
                            {supplier.shared_plots.map((plot) => (
                              <Grid item xs={12} sm={6} md={4} key={plot.name}>
                                <Card variant="outlined" size="small">
                                  <CardContent sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                      <Typography variant="subtitle2" noWrap>
                                        {plot.plot_id}
                                      </Typography>
                                      <Chip 
                                        label={plot.risk_level}
                                        color={getRiskColor(plot.risk_level)}
                                        size="small"
                                      />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                      {plot.plot_name}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      Area: {plot.area} ha
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      Country: {plot.country}
                                    </Typography>
                                    {plot.deforestation_percentage > 0 && (
                                      <Typography 
                                        variant="caption" 
                                        display="block"
                                        color="error.main"
                                        sx={{ mt: 0.5 }}
                                      >
                                        🔥 {plot.deforestation_percentage.toFixed(1)}% deforestation
                                      </Typography>
                                    )}
                                    <Button
                                      size="small"
                                      startIcon={<MapIcon />}
                                      onClick={() => handleViewSharedPlots(plot.request_id)}
                                      sx={{ mt: 1 }}
                                    >
                                      View Map
                                    </Button>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
              {riskData.suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No suppliers with shared plots found. Request land plot data from suppliers to see risk analysis.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Plot Details Dialog */}
      <Dialog open={plotDetailsDialog} onClose={() => setPlotDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Land Plot Details</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Plot ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Area (ha)</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Deforestation</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPlots.map((plot) => (
                  <TableRow key={plot.name}>
                    <TableCell>{plot.plot_id}</TableCell>
                    <TableCell>{plot.plot_name}</TableCell>
                    <TableCell>{plot.area}</TableCell>
                    <TableCell>
                      <Chip 
                        label={plot.risk_level}
                        color={getRiskColor(plot.risk_level)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2"
                        color={plot.deforestation_percentage > 5 ? 'error' : 
                               plot.deforestation_percentage > 1 ? 'warning.main' : 'success.main'}
                      >
                        {plot.deforestation_percentage?.toFixed(1) || '0.0'}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewSharedPlots(plot.request_id)}
                      >
                        <MapIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlotDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RiskDashboard;
