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
//   Chip,
//   LinearProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Divider,
//   IconButton,
//   Collapse,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import {
//   Assessment as AssessmentIcon,
//   Warning as WarningIcon,
//   CheckCircle as CheckIcon,
//   PendingActions as PendingIcon,
//   Refresh as RefreshIcon,
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon,
//   Map as MapIcon,
//   Visibility as ViewIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { riskService } from '../services/riskService';
// import { toast } from 'react-toastify';

// const RiskDashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [expandedSupplier, setExpandedSupplier] = useState(null);
//   const [plotDetailsDialog, setPlotDetailsDialog] = useState(false);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [selectedPlots, setSelectedPlots] = useState([]);
//   const [riskData, setRiskData] = useState({
//     suppliers: [],
//     summary: {
//       total_suppliers: 0,
//       high_risk: 0,
//       medium_risk: 0,
//       low_risk: 0,
//       unknown_risk: 0,
//       total_plots: 0,
//       total_area: 0,
//       total_deforestation: 0,
//       avg_compliance: 0
//     }
//   });

//   useEffect(() => {
//     fetchRiskData();
//   }, []);

//   const fetchRiskData = async () => {
//     try {
//       setLoading(true);
//       const response = await riskService.getRiskDashboardData();
//       console.log('Risk data received:', response);
//       setRiskData(response);
//     } catch (error) {
//       console.error('Failed to fetch risk data:', error);
//       toast.error('Failed to fetch risk data');
//     } finally {
//       setLoading(false);
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

//   const handleSupplierExpand = (supplierName) => {
//     setExpandedSupplier(expandedSupplier === supplierName ? null : supplierName);
//   };

//   const handleViewSupplierPlots = (supplier) => {
//     if (!supplier) return;

//     const requestId = supplier.requests?.[0]?.id || supplier.supplier_id || supplier.name || supplier.supplier_name || 'supplier';

//     navigate(`/shared-plots/${requestId}`, {
//       state: {
//         plots: supplier.shared_plots || [],
//         supplierName: supplier.supplier_name,
//         supplierGroup: supplier.supplier_group,
//         supplierId: supplier.supplier_id,
//         requestId,
//         source: 'risk-dashboard'
//       }
//     });
//   };

//   const handlePlotDetails = (supplier) => {
//     if (!supplier) return;
//     setSelectedPlots(supplier.shared_plots || []);
//     setSelectedSupplier(supplier);
//     setPlotDetailsDialog(true);
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
//         <CircularProgress />
//         <Typography sx={{ ml: 2 }}>Loading risk analysis...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>EUDR Risk Dashboard</Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="outlined"
//             startIcon={<RefreshIcon />}
//             onClick={fetchRiskData}
//           >
//             Refresh
//           </Button>
//         </Box>
//       </Box>

//       {/* Summary Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom variant="body2">
//                 Total Suppliers
//               </Typography>
//               <Typography variant="h4">
//                 {riskData.summary.total_suppliers}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom variant="body2">
//                 High Risk
//               </Typography>
//               <Typography variant="h4" color="error.main">
//                 {riskData.summary.high_risk}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom variant="body2">
//                 Medium Risk
//               </Typography>
//               <Typography variant="h4" color="warning.main">
//                 {riskData.summary.medium_risk}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom variant="body2">
//                 Low Risk
//               </Typography>
//               <Typography variant="h4" color="success.main">
//                 {riskData.summary.low_risk}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom variant="body2">
//                 Total Plots
//               </Typography>
//               <Typography variant="h4">
//                 {riskData.summary.total_plots}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom variant="body2">
//                 Avg. Compliance
//               </Typography>
//               <Typography variant="h4" color="primary.main">
//                 {Math.round(riskData.summary.avg_compliance)}%
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>


//       {/* High Risk Alert */}
//       {riskData.summary.high_risk > 0 && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           ⚠️ {riskData.summary.high_risk} supplier(s) have HIGH deforestation risk. Immediate action required for EUDR compliance.
//         </Alert>
//       )}

//       {/* Detailed Supplier Risk Table */}
//       <Paper>
//         <Box sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             Supplier Risk Analysis
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Based on shared land plot deforestation data
//           </Typography>
//         </Box>
//         <Divider />
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell width="40"></TableCell>
//                 <TableCell>Supplier</TableCell>
//                 <TableCell>Country</TableCell>
//                 <TableCell>Risk Level</TableCell>
//                 <TableCell>Compliance Score</TableCell>
//                 <TableCell>Shared Plots</TableCell>
//                 <TableCell>Total Area (ha)</TableCell>
//                 <TableCell>Avg. Deforestation</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {riskData.suppliers.map((supplier) => (
//                 <React.Fragment key={supplier.name}>
//                   <TableRow>
//                     <TableCell>
//                       <IconButton
//                         size="small"
//                         onClick={() => handleSupplierExpand(supplier.name)}
//                       >
//                         {expandedSupplier === supplier.name ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                       </IconButton>
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         {getRiskIcon(supplier.overall_risk)}
//                         <Box>
//                           <Typography variant="body2" fontWeight="medium">
//                             {supplier.supplier_name}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {supplier.supplier_group}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </TableCell>
//                     <TableCell>{supplier.country}</TableCell>
//                     <TableCell>
//                       <Chip 
//                         label={supplier.overall_risk?.toUpperCase()} 
//                         color={getRiskColor(supplier.overall_risk)}
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <LinearProgress 
//                           variant="determinate" 
//                           value={supplier.compliance_score} 
//                           sx={{ 
//                             width: 60, 
//                             height: 8,
//                             '& .MuiLinearProgress-bar': {
//                               backgroundColor: supplier.compliance_score > 80 ? 'success.main' : 
//                                              supplier.compliance_score > 60 ? 'warning.main' : 'error.main'
//                             }
//                           }}
//                         />
//                         <Typography variant="caption">
//                           {Math.round(supplier.compliance_score)}%
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Chip 
//                         label={`${supplier.shared_plots.length} plots`}
//                         variant="outlined"
//                         size="small"
//                         onClick={() => handlePlotDetails(supplier)}
//                         clickable
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {Math.round(supplier.total_area)} ha
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography 
//                         variant="body2" 
//                         color={supplier.avg_deforestation > 5 ? 'error' : 
//                                supplier.avg_deforestation > 1 ? 'warning.main' : 'success.main'}
//                       >
//                         {supplier.avg_deforestation.toFixed(2)}%
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 1 }}>
//                         <IconButton
//                           size="small"
//                           onClick={() => handleViewSupplierPlots(supplier)}
//                           title="View on Map"
//                         >
//                           <MapIcon />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           onClick={() => handleSupplierExpand(supplier.name)}
//                           title="View Details"
//                         >
//                           <ViewIcon />
//                         </IconButton>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
                  
//                   {/* Expanded Row - Plot Details */}
//                   <TableRow>
//                     <TableCell colSpan={9} sx={{ p: 0 }}>
//                       <Collapse in={expandedSupplier === supplier.name}>
//                         <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
//                           <Typography variant="subtitle2" gutterBottom>
//                             Shared Land Plot Details
//                           </Typography>
//                           <Grid container spacing={2}>
//                             {supplier.shared_plots.map((plot) => (
//                               <Grid item xs={12} sm={6} md={4} key={plot.name}>
//                                 <Card variant="outlined" size="small">
//                                   <CardContent sx={{ p: 2 }}>
//                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
//                                       <Typography variant="subtitle2" noWrap>
//                                         {plot.plot_id}
//                                       </Typography>
//                                       <Chip 
//                                         label={plot.risk_level}
//                                         color={getRiskColor(plot.risk_level)}
//                                         size="small"
//                                       />
//                                     </Box>
//                                     <Typography variant="body2" color="text.secondary" gutterBottom>
//                                       {plot.plot_name}
//                                     </Typography>
//                                     <Typography variant="caption" display="block">
//                                       Area: {plot.area} ha
//                                     </Typography>
//                                     <Typography variant="caption" display="block">
//                                       Country: {plot.country}
//                                     </Typography>
//                                     {plot.deforestation_percentage > 0 && (
//                                       <Typography 
//                                         variant="caption" 
//                                         display="block"
//                                         color="error.main"
//                                         sx={{ mt: 0.5 }}
//                                       >
//                                         🔥 {plot.deforestation_percentage.toFixed(1)}% deforestation
//                                       </Typography>
//                                     )}
//                                     <Button
//                                       size="small"
//                                       startIcon={<MapIcon />}
//                                       onClick={() => handleViewSupplierPlots(supplier)}
//                                       sx={{ mt: 1 }}
//                                     >
//                                       View Map
//                                     </Button>
//                                   </CardContent>
//                                 </Card>
//                               </Grid>
//                             ))}
//                           </Grid>
//                         </Box>
//                       </Collapse>
//                     </TableCell>
//                   </TableRow>
//                 </React.Fragment>
//               ))}
//               {riskData.suppliers.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       No suppliers with shared plots found. Request land plot data from suppliers to see risk analysis.
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Plot Details Dialog */}
//       <Dialog 
//         open={plotDetailsDialog} 
//         onClose={() => {
//           setPlotDetailsDialog(false);
//           setSelectedSupplier(null);
//         }} 
//         maxWidth="md" 
//         fullWidth
//       >
//         <DialogTitle>Land Plot Details</DialogTitle>
//         <DialogContent>
//           <TableContainer>
//             <Table size="small">
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Plot ID</TableCell>
//                       <TableCell>Name</TableCell>
//                       <TableCell>Area (ha)</TableCell>
//                   <TableCell>Risk Level</TableCell>
//                   <TableCell>Deforestation</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {selectedPlots.map((plot) => (
//                   <TableRow key={plot.name}>
//                     <TableCell>{plot.plot_id}</TableCell>
//                     <TableCell>{plot.plot_name}</TableCell>
//                     <TableCell>{plot.area}</TableCell>
//                     <TableCell>
//                       <Chip 
//                         label={plot.risk_level}
//                         color={getRiskColor(plot.risk_level)}
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Typography 
//                         variant="body2"
//                         color={plot.deforestation_percentage > 5 ? 'error' : 
//                                plot.deforestation_percentage > 1 ? 'warning.main' : 'success.main'}
//                       >
//                         {plot.deforestation_percentage?.toFixed(1) || '0.0'}%
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <IconButton
//                         size="small"
//                         onClick={() => selectedSupplier && handleViewSupplierPlots(selectedSupplier)}
//                       >
//                         <MapIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => {
//             setPlotDetailsDialog(false);
//             setSelectedSupplier(null);
//           }}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default RiskDashboard;
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Grid, CircularProgress, Alert, Card, CardContent,
  Chip, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, Collapse, Dialog, DialogTitle, DialogContent, DialogActions,
  Fade, useTheme, alpha, Avatar
} from '@mui/material';
import {
  Assessment as AssessmentIcon, Warning as WarningIcon, CheckCircle as CheckIcon,
  PendingActions as PendingIcon, Refresh as RefreshIcon, ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon, Map as MapIcon, Visibility as ViewIcon,
  Landscape as LandscapeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { riskService } from '../services/riskService';
import { toast } from 'react-toastify';

// --- STYLED COMPONENTS ---

const StatCard = ({ title, value, subValue, color, icon }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 4,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(0,0,0,0.08)',
          borderColor: 'transparent'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: `${color}.main`,
              borderRadius: 2
            }}
          >
            {icon}
          </Avatar>
          {subValue && (
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              {subValue}
            </Typography>
          )}
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const RiskChip = ({ level }) => {
  const l = (level || '').toLowerCase();
  let color = 'default';
  if (l === 'high') color = 'error';
  if (l === 'medium') color = 'warning';
  if (l === 'low') color = 'success';
  
  return (
    <Chip 
      label={level?.toUpperCase()} 
      color={color} 
      size="small" 
      sx={{ borderRadius: 1, fontWeight: 700, minWidth: 70 }} 
    />
  );
};

const RiskDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [expandedSupplier, setExpandedSupplier] = useState(null);
  const [plotDetailsDialog, setPlotDetailsDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedPlots, setSelectedPlots] = useState([]);
  
  const [riskData, setRiskData] = useState({
    suppliers: [],
    summary: {
      total_suppliers: 0, high_risk: 0, medium_risk: 0, low_risk: 0,
      unknown_risk: 0, total_plots: 0, total_area: 0, total_deforestation: 0,
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
      setRiskData(response);
    } catch (error) {
      console.error('Failed to fetch risk data:', error);
      toast.error('Failed to fetch risk data');
    } finally {
      setLoading(false);
    }
  };

  const handleSupplierExpand = (name) => setExpandedSupplier(expandedSupplier === name ? null : name);

  const handleViewSupplierPlots = (supplier) => {
    if (!supplier) return;
    const requestId = supplier.requests?.[0]?.id || supplier.supplier_id || supplier.name || 'supplier';
    navigate(`/shared-plots/${requestId}`, {
      state: {
        plots: supplier.shared_plots || [],
        supplierName: supplier.supplier_name,
        supplierGroup: supplier.supplier_group,
        supplierId: supplier.supplier_id,
        requestId,
        source: 'risk-dashboard'
      }
    });
  };

  const handlePlotDetails = (supplier) => {
    if (!supplier) return;
    setSelectedPlots(supplier.shared_plots || []);
    setSelectedSupplier(supplier);
    setPlotDetailsDialog(true);
  };

  if (loading) return <Box display="flex" justifyContent="center" p={10}><CircularProgress /></Box>;

  return (
    <Fade in={true}>
      <Box>
        {/* --- HEADER --- */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={800} 
              sx={{ 
                mb: 0.5,
                background: 'linear-gradient(45deg, #2E3B55 30%, #6a5acd 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Risk Dashboard
            </Typography>
            <Typography color="text.secondary">Monitor deforestation risks and supplier compliance.</Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchRiskData}
            sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
          >
            Refresh Analysis
          </Button>
        </Box>

        {/* --- SUMMARY CARDS --- */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard title="Total Suppliers" value={riskData.summary.total_suppliers} color="primary" icon={<AssessmentIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard title="High Risk" value={riskData.summary.high_risk} color="error" icon={<WarningIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard title="Medium Risk" value={riskData.summary.medium_risk} color="warning" icon={<PendingIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard title="Low Risk" value={riskData.summary.low_risk} color="success" icon={<CheckIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard title="Total Plots" value={riskData.summary.total_plots} color="info" icon={<LandscapeIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <StatCard 
              title="Avg. Compliance" 
              value={`${Math.round(riskData.summary.avg_compliance)}%`} 
              color="primary" 
              icon={<CheckIcon />} 
            />
          </Grid>
        </Grid>

        {/* --- ALERTS --- */}
        {riskData.summary.high_risk > 0 && (
          <Alert 
            severity="error" 
            variant="standard" // Changed from 'filled' to 'standard'
            sx={{ 
              mb: 4, 
              borderRadius: 2, 
              fontWeight: 600,
              border: '1px solid',
              borderColor: 'error.light',
              bgcolor: alpha(theme.palette.error.main, 0.05), // Very light red background
              color: 'error.dark' // Darker red text for readability
            }}
          >
            ⚠️ {riskData.summary.high_risk} supplier(s) flagged with HIGH deforestation risk. Immediate action required.
          </Alert>
        )}

        {/* --- SUPPLIER TABLE --- */}
        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography variant="h6" fontWeight={700}>Supplier Risk Analysis</Typography>
            <Typography variant="body2" color="text.secondary">Analysis based on satellite data from shared land plots.</Typography>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'background.neutral' }}>
                <TableRow>
                  <TableCell width="50" />
                  <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Risk Level</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Compliance Score</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Shared Plots</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Area</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Avg. Deforestation</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, pr: 4 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riskData.suppliers.map((supplier) => (
                  <React.Fragment key={supplier.name}>
                    <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleSupplierExpand(supplier.name)}>
                          {expandedSupplier === supplier.name ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600} variant="body2">{supplier.supplier_name}</Typography>
                        <Typography variant="caption" color="text.secondary">{supplier.supplier_group}</Typography>
                      </TableCell>
                      <TableCell>{supplier.country}</TableCell>
                      <TableCell><RiskChip level={supplier.overall_risk} /></TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress 
                            variant="determinate" 
                            value={supplier.compliance_score} 
                            sx={{ 
                              width: 60, height: 6, borderRadius: 3,
                              bgcolor: alpha(theme.palette.grey[500], 0.2),
                              '& .MuiLinearProgress-bar': {
                                bgcolor: supplier.compliance_score > 80 ? 'success.main' : 
                                         supplier.compliance_score > 60 ? 'warning.main' : 'error.main'
                              }
                            }}
                          />
                          <Typography variant="caption" fontWeight={600}>{Math.round(supplier.compliance_score)}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${supplier.shared_plots.length} Plots`} 
                          size="small" 
                          onClick={() => handlePlotDetails(supplier)}
                          sx={{ borderRadius: 1, fontWeight: 600, cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>{Math.round(supplier.total_area)} ha</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" fontWeight={600}
                          color={supplier.avg_deforestation > 5 ? 'error.main' : supplier.avg_deforestation > 1 ? 'warning.main' : 'success.main'}
                        >
                          {supplier.avg_deforestation.toFixed(2)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 4 }}>
                        <IconButton size="small" color="primary" onClick={() => handleViewSupplierPlots(supplier)}>
                          <MapIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    {/* EXPANDED ROW */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                        <Collapse in={expandedSupplier === supplier.name} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.02), borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>
                              Detailed Plot Risk Breakdown
                            </Typography>
                            <Grid container spacing={2} mt={0.5}>
                              {supplier.shared_plots.map((plot) => (
                                <Grid item xs={12} sm={6} md={4} key={plot.name}>
                                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                      <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="subtitle2" fontWeight={600}>{plot.plot_id}</Typography>
                                        <RiskChip level={plot.risk_level} />
                                      </Box>
                                      <Typography variant="body2" color="text.secondary" noWrap>{plot.plot_name}</Typography>
                                      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="caption" display="block" color="text.secondary">Area: {plot.area} ha</Typography>
                                            {plot.deforestation_percentage > 0 && (
                                                <Typography variant="caption" color="error.main" fontWeight={600}>
                                                    Deforestation: {plot.deforestation_percentage.toFixed(1)}%
                                                </Typography>
                                            )}
                                        </Box>
                                        <Button size="small" startIcon={<MapIcon />} onClick={() => handleViewSupplierPlots(supplier)}>Map</Button>
                                      </Box>
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
                    <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                      <Typography variant="subtitle1" fontWeight={600} color="text.secondary">No risk data available.</Typography>
                      <Typography variant="body2" color="text.secondary">Request land plot data from suppliers to generate analysis.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* --- PLOT DETAILS DIALOG --- */}
        <Dialog 
          open={plotDetailsDialog} 
          onClose={() => setPlotDetailsDialog(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Land Plot Risk Details</DialogTitle>
          <DialogContent dividers>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Plot ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Area (ha)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Risk</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Deforestation %</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Map</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPlots.map((plot) => (
                    <TableRow key={plot.name} hover>
                      <TableCell>{plot.plot_id}</TableCell>
                      <TableCell>{plot.plot_name}</TableCell>
                      <TableCell>{plot.area}</TableCell>
                      <TableCell><RiskChip level={plot.risk_level} /></TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color={plot.deforestation_percentage > 0 ? 'error.main' : 'success.main'}>
                          {plot.deforestation_percentage?.toFixed(1) || '0.0'}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => { setPlotDetailsDialog(false); handleViewSupplierPlots(selectedSupplier); }}>
                          <MapIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setPlotDetailsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default RiskDashboard;
