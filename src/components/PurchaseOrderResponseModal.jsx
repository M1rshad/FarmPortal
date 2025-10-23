import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  Alert,
  CircularProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  Save as SaveIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  CheckCircle as CheckIcon,
  Search as SearchIcon,
  SelectAll as SelectAllIcon,
  ClearAll as ClearAllIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { requestService } from '../services/requestService';

const steps = ['Batch Details', 'Select Plots', 'Production Dates', 'Select Products'];

// Leaflet map component
const PlotMap = ({ selectedPlots, availablePlots }) => {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const plotsLayerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const selectedPlotData = (availablePlots || []).filter(p => selectedPlots.includes(p.id));

  const styles = {
    polygon: {
      color: '#2E7D32',
      fillColor: '#4CAF50',
      fillOpacity: 0.6,
      weight: 3
    },
    pointDot: (z) => ({
      radius: Math.max(8, Math.min(15, (8 * (z - 3)) / 1.3)),
      color: '#1E88E5',
      weight: 3,
      fillColor: '#42A5F5',
      fillOpacity: 0.8
    }),
    pointRing: {
      color: '#1E88E5',
      weight: 2,
      opacity: 0.4,
      fillOpacity: 0.1
    }
  };

  useEffect(() => {
    (async () => {
      // CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      // JS
      if (!window.L) {
        await new Promise((resolve) => {
          if (document.getElementById('leaflet-js')) return resolve();
          const script = document.createElement('script');
          script.id = 'leaflet-js';
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }
      const L = window.L;
      if (!mapContainerRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true
      });
      leafletMapRef.current = map;

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
      }).addTo(map);

      plotsLayerRef.current = L.layerGroup().addTo(map);
      map.on('zoomend', () => drawSelectedPlots());
      setMapReady(true);
      setTimeout(() => {
        map.invalidateSize();
        drawSelectedPlots();
      }, 200);
    })();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapReady) drawSelectedPlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, selectedPlotData]);

  const extractCoordinates = (plot) => {
    let lat = null;
    let lng = null;
    let coordinates = null;

    const latFields = ['latitude', 'lat', 'Latitude', 'LAT', 'y', 'Y'];
    const lngFields = ['longitude', 'lng', 'lon', 'Longitude', 'LONGITUDE', 'x', 'X'];
    for (const lf of latFields) {
      if (plot?.[lf] != null) {
        lat = parseFloat(plot[lf]);
        break;
      }
    }
    for (const lf of lngFields) {
      if (plot?.[lf] != null) {
        lng = parseFloat(plot[lf]);
        break;
      }
    }
    if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
      return [[lng, lat]];
    }

    const coordFields = ['coordinates', 'coords', 'coordinate', 'position', 'location'];
    for (const cf of coordFields) {
      const v = plot?.[cf];
      if (!v) continue;
      if (typeof v === 'string') {
        try {
          const arr = JSON.parse(v);
          if (Array.isArray(arr)) return arr;
        } catch {
          if (v.includes(',')) {
            const [a, b] = v.split(',');
            const pl = parseFloat(a);
            const pg = parseFloat(b);
            if (!Number.isNaN(pl) && !Number.isNaN(pg)) return [[pg, pl]];
          }
        }
      } else if (Array.isArray(v)) {
        return v;
      }
    }

    if (plot?.geojson?.coordinates) {
      const g = plot.geojson;
      if (g.type === 'Point') return [g.coordinates];
      if (g.type === 'Polygon' && g.coordinates?.[0]) return g.coordinates[0];
      if (Array.isArray(g.coordinates)) return g.coordinates;
    }

    // Simple per-country demo fallback if backend lacks coords
    const countryFallback = {
      Ghana: [[-1.0232, 7.9465]],
      Brazil: [[-47.9292, -15.7801]],
      India: [[77.5946, 12.9716]]
    };
    if (plot?.country && countryFallback[plot.country]) return countryFallback[plot.country];

    return null;
  };

  const drawSelectedPlots = () => {
    const L = window.L;
    const map = leafletMapRef.current;
    const layer = plotsLayerRef.current;
    if (!L || !map || !layer || !mapReady) return;

    layer.clearLayers();
    if (selectedPlotData.length === 0) return;

    const allBounds = [];

    selectedPlotData.forEach((plot) => {
      const coords = extractCoordinates(plot);
      if (!coords || coords.length === 0) return;

      const ring = Array.isArray(coords[0]) && Array.isArray(coords[0][0]) ? coords[0] : coords;
      let latLngs = [];

      if (ring.length > 1) {
        latLngs = ring
          .map((c) => {
            if (!Array.isArray(c) || c.length !== 2) return null;
            const [lng, lat] = c.map(Number);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
            return [lat, lng];
          })
          .filter(Boolean);

        if (latLngs.length >= 3) {
          const first = latLngs[0];
          const last = latLngs[latLngs.length - 1];
          if (first[0] !== last[0] || first[1] !== last[1]) latLngs.push([first[0], first[1]]);

          const polygon = L.polygon(latLngs, styles.polygon).addTo(layer);
          const center = polygon.getBounds().getCenter();
          L.circleMarker([center.lat, center.lng], {
            ...styles.pointDot(map.getZoom()),
            color: '#FF5722',
            fillColor: '#FF8A65'
          })
            .addTo(layer)
            .bindTooltip(`${plot.plot_id || plot.id} — ${plot.plot_name || ''}`, { sticky: true });

          latLngs.forEach((ll) => allBounds.push(ll));
        } else {
          const pt = ring[0];
          if (Array.isArray(pt) && pt.length === 2) {
            const [lng, lat] = pt.map(Number);
            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
              const dot = L.circleMarker([lat, lng], { ...styles.pointDot(map.getZoom()) }).addTo(layer);
              L.circle([lat, lng], { radius: 100, ...styles.pointRing, interactive: false }).addTo(layer);
              dot.bindTooltip(`${plot.plot_id || plot.id} — ${plot.plot_name || ''}`, { sticky: true, direction: 'top' });
              allBounds.push([lat, lng]);
            }
          }
        }
      } else {
        const pt = Array.isArray(ring) && ring.length === 1 ? ring[0] : ring;
        if (!Array.isArray(pt) || pt.length !== 2) return;
        const [lng, lat] = pt.map(Number);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return;

        const dot = L.circleMarker([lat, lng], { ...styles.pointDot(map.getZoom()) }).addTo(layer);
        L.circle([lat, lng], { radius: 100, ...styles.pointRing, interactive: false }).addTo(layer);
        dot.bindTooltip(`${plot.plot_id || plot.id} — ${plot.plot_name || ''}`, { sticky: true, direction: 'top' });
        allBounds.push([lat, lng]);
      }
    });

    if (allBounds.length > 0) {
      try {
        const bounds = L.latLngBounds(allBounds);
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 14 });
      } catch {
        // ignore
      }
    }
  };

  return (
    <Box sx={{ height: 350, border: '1px solid #e0e0e0', borderRadius: 1, position: 'relative', overflow: 'hidden' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%', background: '#f5f5f5' }} />
      {!mapReady && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.8)' }}>
          <CircularProgress size={28} />
        </Box>
      )}
    </Box>
  );
};

const PurchaseOrderResponseModal = ({ open, onClose, onSubmit, requestId, purchaseOrderNumber }) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [poDetails, setPODetails] = useState(null);
  const [showValidation, setShowValidation] = useState(false);

  const [batch, setBatch] = useState({ batchNumber: '', validityDate: '', eudrRelevant: true });

  const [selectedPlots, setSelectedPlots] = useState([]);
  const [availablePlots, setAvailablePlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('');

  const [productionDateScope, setProductionDateScope] = useState('per_plot');
  // per_plot: { type:'plot', plotId, from, to }, per_batch: { type:'batch', from, to }
  const [productionDates, setProductionDates] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    if (open && requestId) {
      loadPODetails();
      resetSteps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, requestId]);

  const resetSteps = () => {
    setCurrentStep(0);
    setShowValidation(false);
    setBatch({ batchNumber: '', validityDate: '', eudrRelevant: true });
    setSelectedPlots([]);
    setProductionDates([]);
    setSelectedProducts([]);
    setProductionDateScope('per_plot');
    setSearchTerm('');
    setCountryFilter('');
    setCommodityFilter('');
  };

  const loadPODetails = async () => {
    try {
      setLoading(true);
      const response = await requestService.getPurchaseOrderDetails(requestId);
      setPODetails(response);
      setAvailablePlots(response.plots || []);
      setAvailableProducts(response.products || []);
    } catch (error) {
      toast.error('Failed to load PO details');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlots = useMemo(() => {
    return (availablePlots || []).filter((plot) => {
      const matchesSearch =
        !searchTerm ||
        (plot.plot_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plot.plot_name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = !countryFilter || plot.country === countryFilter;
      const matchesCommodity =
        !commodityFilter ||
        (Array.isArray(plot.commodities)
          ? plot.commodities.includes(commodityFilter)
          : plot.commodities === commodityFilter);
      return matchesSearch && matchesCountry && matchesCommodity;
    });
  }, [availablePlots, searchTerm, countryFilter, commodityFilter]);

  const uniqueCountries = useMemo(() => [...new Set((availablePlots || []).map((p) => p.country))].filter(Boolean), [availablePlots]);
  const uniqueCommodities = useMemo(() => {
    const all = (availablePlots || []).flatMap((p) => (Array.isArray(p.commodities) ? p.commodities : [p.commodities])).filter(Boolean);
    return [...new Set(all)];
  }, [availablePlots]);

  const isStep1Valid = () => batch.batchNumber.trim() !== '';
  const isStep2Valid = () => selectedPlots.length > 0;
  const isStep3Valid = () => {
    const validRange = (f, t) => !!f && !!t && new Date(f) <= new Date(t);
    if (productionDateScope === 'per_plot') {
      if (selectedPlots.length === 0) return false;
      return selectedPlots.every((plotId) => {
        const entry = productionDates.find((pd) => pd.type === 'plot' && pd.plotId === plotId);
        return entry && validRange(entry.from, entry.to);
      });
    } else {
      const entry = productionDates.find((pd) => pd.type === 'batch');
      return entry && validRange(entry.from, entry.to);
    }
  };
  const isStep4Valid = () => selectedProducts.length > 0;

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: return isStep1Valid();
      case 1: return isStep2Valid();
      case 2: return isStep3Valid();
      case 3: return isStep4Valid();
      default: return false;
    }
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      setShowValidation(true);
      return;
    }
    if (currentStep < steps.length - 1) {
      if (currentStep === 1 && productionDates.length === 0) {
        if (productionDateScope === 'per_plot') {
          setProductionDates(selectedPlots.map((plotId) => ({ type: 'plot', plotId, from: '', to: '' })));
        } else {
          setProductionDates([{ type: 'batch', from: '', to: '' }]);
        }
      }
      setCurrentStep((s) => s + 1);
      setShowValidation(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setShowValidation(false);
    }
  };

  const handleSubmit = async () => {
    if (!isStep4Valid()) {
      setShowValidation(true);
      toast.error('Please select at least one product');
      return;
    }
    try {
      setLoading(true);
      const poData = {
        batches: [batch],
        selected_plots: selectedPlots,
        production_date_scope: productionDateScope,
        production_dates: productionDates,
        products: selectedProducts,
        purchase_order_number: purchaseOrderNumber
      };
      await onSubmit(poData);
      onClose();
    } catch (error) {
      // upstream handles toast
    } finally {
      setLoading(false);
    }
  };

  const updateBatch = (field, value) => setBatch((prev) => ({ ...prev, [field]: value }));
  const handlePlotSelection = (plotId) => {
    setSelectedPlots((prev) => (prev.includes(plotId) ? prev.filter((id) => id !== plotId) : [...prev, plotId]));
  };
  const toggleProduct = (id) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const updateProductionDateScope = (scope) => {
    setProductionDateScope(scope);
    if (scope === 'per_plot') {
      setProductionDates(selectedPlots.map((plotId) => ({ type: 'plot', plotId, from: '', to: '' })));
    } else {
      setProductionDates([{ type: 'batch', from: '', to: '' }]);
    }
  };
  const handleSelectAll = () => {
    const allFilteredIds = filteredPlots.map((plot) => plot.id);
    setSelectedPlots((prev) => [...new Set([...prev, ...allFilteredIds])]);
  };
  const handleClearAll = () => {
    const filteredIds = new Set(filteredPlots.map((plot) => plot.id));
    setSelectedPlots((prev) => prev.filter((id) => !filteredIds.has(id)));
  };

  if (loading && !poDetails) {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Batch Information</Typography>
            {showValidation && !isStep1Valid() && (
              <Alert severity="error" sx={{ mb: 3 }}>Please enter a batch number to continue.</Alert>
            )}
            <Box sx={{ border: batch.batchNumber ? '1px solid #e0e0e0' : showValidation ? '2px solid #f44336' : '1px solid #2196f3', borderRadius: 2, p: 3, '&:hover': { borderColor: '#1976d2' } }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={<span>Batch Number <span style={{ color: '#f44336' }}>*</span></span>}
                    value={batch.batchNumber}
                    onChange={(e) => updateBatch('batchNumber', e.target.value)}
                    error={showValidation && !batch.batchNumber}
                    helperText={showValidation && !batch.batchNumber ? 'Batch number is required' : 'Enter the batch number for this purchase order'}
                    placeholder="e.g., BATCH-2025-001"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Validity Date"
                    value={batch.validityDate}
                    onChange={(e) => updateBatch('validityDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    helperText="Optional: Set batch expiration date"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={batch.eudrRelevant} onChange={(e) => updateBatch('eudrRelevant', e.target.checked)} color="primary" />}
                    label={
                      <Box>
                        <Typography component="span">EUDR Relevant</Typography>
                        <Typography variant="body2" color="text.secondary" component="div">
                          This batch is subject to EU Deforestation Regulation requirements
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Land Plots ({selectedPlots.length} of {filteredPlots.length} selected)
            </Typography>
            {showValidation && !isStep2Valid() && (
              <Alert severity="error" sx={{ mb: 2 }}>Please select at least one land plot to continue.</Alert>
            )}
            <Alert severity="info" sx={{ mb: 3 }}>
              Use filters and search to find specific plots, then select the ones for this purchase order
            </Alert>

            <Paper sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Search plots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Country</InputLabel>
                    <Select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} label="Country">
                      <MenuItem value="">All Countries</MenuItem>
                      {uniqueCountries.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Commodity</InputLabel>
                    <Select value={commodityFilter} onChange={(e) => setCommodityFilter(e.target.value)} label="Commodity">
                      <MenuItem value="">All Commodities</MenuItem>
                      {uniqueCommodities.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<SelectAllIcon />} onClick={handleSelectAll} disabled={filteredPlots.length === 0}>
                      Select All
                    </Button>
                    <Button size="small" startIcon={<ClearAllIcon />} onClick={handleClearAll} disabled={selectedPlots.length === 0}>
                      Clear All
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Typography variant="body2" color="text.secondary">{filteredPlots.length} plots found</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={2} sx={{ height: 450 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" color="text.secondary">Available Plots</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {filteredPlots.length === 0 ? (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          {(availablePlots || []).length === 0
                            ? 'No plots available. Please add plots in the Land Plots section first.'
                            : 'No plots match your filters. Try adjusting your search criteria.'}
                        </Typography>
                      </Box>
                    ) : (
                      <List dense>
                        {filteredPlots.map((plot, index) => (
                          <React.Fragment key={plot.id}>
                            <ListItem disablePadding>
                              <ListItemButton onClick={() => handlePlotSelection(plot.id)} selected={selectedPlots.includes(plot.id)}>
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    tabIndex={-1}
                                    disableRipple
                                    checked={selectedPlots.includes(plot.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={() => handlePlotSelection(plot.id)}
                                    inputProps={{ 'aria-labelledby': `plot-${plot.id}` }}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  id={`plot-${plot.id}`}
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography variant="subtitle2" fontWeight="medium">{plot.plot_id}</Typography>
                                      <Typography variant="body2" color="text.secondary">- {plot.plot_name}</Typography>
                                    </Box>
                                  }
                                  secondary={
                                    <Box>
                                      <Typography variant="caption" display="block">📍 {plot.country} • 📏 {plot.area} ha</Typography>
                                      {plot.commodities && (
                                        <Box sx={{ mt: 0.5 }}>
                                          {(Array.isArray(plot.commodities) ? plot.commodities : [plot.commodities])
                                            .slice(0, 2)
                                            .map((commodity) => (
                                              <Chip key={commodity} label={commodity} size="small" sx={{ mr: 0.5, height: 16, fontSize: '0.6rem' }} color="primary" variant="outlined" />
                                            ))}
                                          {Array.isArray(plot.commodities) && plot.commodities.length > 2 && (
                                            <Typography variant="caption" color="text.secondary">+{plot.commodities.length - 2} more</Typography>
                                          )}
                                        </Box>
                                      )}
                                    </Box>
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                            {index < filteredPlots.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" color="text.secondary">Selected Plots Map</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1, p: 2 }}>
                    <PlotMap selectedPlots={selectedPlots} availablePlots={availablePlots} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Production Date Configuration</Typography>
            {showValidation && !isStep3Valid() && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Please set valid date ranges for all selected {productionDateScope === 'per_plot' ? 'plots' : 'batch'}.
              </Alert>
            )}

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Production dates are relevant:</Typography>
              <RadioGroup value={productionDateScope} onChange={(e) => updateProductionDateScope(e.target.value)}>
                <FormControlLabel value="per_plot" control={<Radio color="primary" />} label="Per Plot (individual date ranges for each plot)" />
                <FormControlLabel value="per_batch" control={<Radio color="primary" />} label="Per Batch (single date range for entire batch)" />
              </RadioGroup>
            </FormControl>

            {productionDateScope === 'per_plot' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Set production date ranges for selected plots:</Typography>
                {selectedPlots.length === 0 ? (
                  <Alert severity="info">No plots selected. Please go back to select plots first.</Alert>
                ) : (
                  <Grid container spacing={2}>
                    {selectedPlots.map((plotId) => {
                      const plot = (availablePlots || []).find((p) => p.id === plotId);
                      const entry = productionDates.find((pd) => pd.type === 'plot' && pd.plotId === plotId) || { from: '', to: '' };
                      const hasValid = entry.from && entry.to && new Date(entry.from) <= new Date(entry.to);

                      return (
                        <Grid item xs={12} sm={6} key={plotId}>
                          <Card variant="outlined" sx={{ border: hasValid ? '1px solid #4caf50' : showValidation ? '2px solid #f44336' : '1px solid #2196f3', '&:hover': { borderColor: hasValid ? '#4caf50' : '#1976d2' } }}>
                            <CardContent>
                              <Typography variant="subtitle2" gutterBottom>{plot?.plot_id} - {plot?.plot_name}</Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    label="From"
                                    value={entry.from || ''}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setProductionDates((prev) => {
                                        const others = prev.filter((pd) => !(pd.type === 'plot' && pd.plotId === plotId));
                                        return [...others, { type: 'plot', plotId, from: v, to: entry.to || '' }];
                                      });
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    error={showValidation && !entry.from}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    type="date"
                                    label="To"
                                    value={entry.to || ''}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setProductionDates((prev) => {
                                        const others = prev.filter((pd) => !(pd.type === 'plot' && pd.plotId === plotId));
                                        return [...others, { type: 'plot', plotId, from: entry.from || '', to: v }];
                                      });
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    error={showValidation && (!entry.to || (entry.from && entry.to && new Date(entry.from) > new Date(entry.to)))}
                                    helperText={showValidation && entry.from && entry.to && new Date(entry.from) > new Date(entry.to) ? 'From must be before To' : ''}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            )}

            {productionDateScope === 'per_batch' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Set production date range for batch:</Typography>
                <Card variant="outlined" sx={{
                  border: (() => {
                    const entry = productionDates.find((pd) => pd.type === 'batch');
                    const ok = entry && entry.from && entry.to && new Date(entry.from) <= new Date(entry.to);
                    return ok ? '1px solid #4caf50' : showValidation ? '2px solid #f44336' : '1px solid #2196f3';
                  })(),
                  '&:hover': { borderColor: '#1976d2' },
                  maxWidth: 520
                }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Batch: {batch.batchNumber || 'Current Batch'}</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="From"
                          value={productionDates.find((pd) => pd.type === 'batch')?.from || ''}
                          onChange={(e) => {
                            const v = e.target.value;
                            setProductionDates((prev) => {
                              const others = prev.filter((pd) => pd.type !== 'batch');
                              const existing = prev.find((pd) => pd.type === 'batch') || { type: 'batch', from: '', to: '' };
                              return [...others, { ...existing, from: v }];
                            });
                          }}
                          InputLabelProps={{ shrink: true }}
                          required
                          error={showValidation && !productionDates.find((pd) => pd.type === 'batch')?.from}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="To"
                          value={productionDates.find((pd) => pd.type === 'batch')?.to || ''}
                          onChange={(e) => {
                            const v = e.target.value;
                            setProductionDates((prev) => {
                              const others = prev.filter((pd) => pd.type !== 'batch');
                              const existing = prev.find((pd) => pd.type === 'batch') || { type: 'batch', from: '', to: '' };
                              return [...others, { ...existing, to: v }];
                            });
                          }}
                          InputLabelProps={{ shrink: true }}
                          required
                          error={(() => {
                            const entry = productionDates.find((pd) => pd.type === 'batch');
                            return showValidation && (!entry?.to || (entry?.from && entry?.to && new Date(entry.from) > new Date(entry.to)));
                          })()}
                          helperText={(() => {
                            const entry = productionDates.find((pd) => pd.type === 'batch');
                            return showValidation && entry?.from && entry?.to && new Date(entry.from) > new Date(entry.to) ? 'From must be before To' : '';
                          })()}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Select Products ({selectedProducts.length} selected)</Typography>
            {showValidation && !isStep4Valid() && (
              <Alert severity="error" sx={{ mb: 2 }}>Please select at least one product to complete the purchase order.</Alert>
            )}
            <Grid container spacing={2}>
              {(availableProducts || []).map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      border: selectedProducts.includes(product.id) ? 2 : 1,
                      borderColor: selectedProducts.includes(product.id) ? 'primary.main' : 'divider',
                      '&:hover': { borderColor: 'primary.light' }
                    }}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleProduct(product.id)}
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': `product-${product.id}` }}
                        />
                        <Box>
                          <Typography id={`product-${product.id}`} variant="subtitle1" fontWeight="medium">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.category}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant="h5" gutterBottom>Purchase Order Response - {purchaseOrderNumber}</Typography>
          <LinearProgress variant="determinate" value={((currentStep + 1) / steps.length) * 100} sx={{ mt: 1, '& .MuiLinearProgress-bar': { backgroundColor: '#2196f3' } }} />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ minHeight: 500 }}>
        <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: completed ? '#4caf50' : active ? '#2196f3' : '#e0e0e0', color: 'white', fontSize: '0.875rem' }}>
                    {completed ? <CheckIcon fontSize="small" /> : index + 1}
                  </Box>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 2 }}>{renderStepContent()}</Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Button onClick={onClose} disabled={loading}>Cancel</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={handleBack} disabled={currentStep === 0 || loading} startIcon={<BackIcon />}>Back</Button>
            {currentStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext} disabled={loading} endIcon={<NextIcon />} color="primary">Next</Button>
            ) : (
              <Button variant="contained" onClick={handleSubmit} disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} color="primary">
                {loading ? 'Submitting...' : 'Submit Purchase Order'}
              </Button>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderResponseModal;
  