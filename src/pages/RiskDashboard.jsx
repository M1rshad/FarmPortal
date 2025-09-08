// frontend/src/pages/RiskDashboard.jsx

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
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  PendingActions as PendingIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { riskService } from '../services/riskService';
import { customerService } from '../services/customerService';
import { toast } from 'react-toastify';

const RiskDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [riskData, setRiskData] = useState({
    suppliers: [],
    summary: {
      totalSuppliers: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
      pendingAnalysis: 0
    }
  });

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      // In real implementation, this would fetch actual risk data
      const response = await customerService.getSuppliers();
      
      // Mock risk categorization based on EUDR requirements
      const suppliers = response.data.suppliers.map(supplier => ({
        ...supplier,
        riskLevel: Math.random() > 0.5 ? 'low' : Math.random() > 0.5 ? 'medium' : 'high',
        lastAnalysis: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        compliance: Math.floor(Math.random() * 100),
        issues: Math.floor(Math.random() * 5),
        deforestationRisk: Math.random() > 0.7 ? 'high' : 'low',
        geoDataComplete: Math.random() > 0.3,
        documentsComplete: Math.random() > 0.4
      }));

      const summary = suppliers.reduce((acc, curr) => {
        acc.totalSuppliers++;
        if (curr.riskLevel === 'high') acc.highRisk++;
        if (curr.riskLevel === 'medium') acc.mediumRisk++;
        if (curr.riskLevel === 'low') acc.lowRisk++;
        if (!curr.lastAnalysis || new Date(curr.lastAnalysis) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
          acc.pendingAnalysis++;
        }
        return acc;
      }, {
        totalSuppliers: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
        pendingAnalysis: 0
      });

      setRiskData({ suppliers, summary });
    } catch (error) {
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
      // Refresh data after analysis
      setTimeout(() => {
        fetchRiskData();
      }, 2000);
    } catch (error) {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">EUDR Risk Dashboard</Typography>
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
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Suppliers
              </Typography>
              <Typography variant="h4">
                {riskData.summary.totalSuppliers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                High Risk
              </Typography>
              <Typography variant="h4" color="error.main">
                {riskData.summary.highRisk}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Medium Risk
              </Typography>
              <Typography variant="h4" color="warning.main">
                {riskData.summary.mediumRisk}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Low Risk
              </Typography>
              <Typography variant="h4" color="success.main">
                {riskData.summary.lowRisk}
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

      {/* Pending Analysis Alert */}
      {riskData.summary.pendingAnalysis > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {riskData.summary.pendingAnalysis} supplier(s) require analysis or have outdated risk assessments.
        </Alert>
      )}

      {/* Detailed Supplier Risk Table */}
      <Paper>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Supplier Risk Details
          </Typography>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supplier</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Compliance Score</TableCell>
                <TableCell>Deforestation Risk</TableCell>
                <TableCell>Geo Data</TableCell>
                <TableCell>Documents</TableCell>
                <TableCell>Last Analysis</TableCell>
                <TableCell>Issues</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riskData.suppliers.map((supplier) => (
                <TableRow key={supplier._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRiskIcon(supplier.riskLevel)}
                      {supplier.supplier_name}
                    </Box>
                  </TableCell>
                  <TableCell>{supplier.country || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={supplier.riskLevel?.toUpperCase()} 
                      color={getRiskColor(supplier.riskLevel)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={supplier.compliance} 
                        sx={{ width: 60, height: 8 }}
                      />
                      <Typography variant="caption">
                        {supplier.compliance}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={supplier.deforestationRisk} 
                      color={supplier.deforestationRisk === 'high' ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={supplier.geoDataComplete ? 'Complete' : 'Missing'} 
                      color={supplier.geoDataComplete ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={supplier.documentsComplete ? 'Complete' : 'Incomplete'} 
                      color={supplier.documentsComplete ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {supplier.lastAnalysis ? 
                        new Date(supplier.lastAnalysis).toLocaleDateString() : 
                        'Never'
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {supplier.issues > 0 ? (
                      <Chip 
                        label={`${supplier.issues} issues`} 
                        color="error" 
                        size="small"
                      />
                    ) : (
                      <Chip 
                        label="No issues" 
                        color="success" 
                        size="small"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {riskData.suppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No suppliers found. Add suppliers to see risk analysis.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RiskDashboard;