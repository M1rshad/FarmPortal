// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Chip,
//   TextField,
//   InputAdornment,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox,
//   Alert,
//   CircularProgress,
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   LocationOn as LocationIcon,
//   Inventory as ProductIcon,
//   RequestQuote as RequestIcon,
//   Map as MapIcon
// } from '@mui/icons-material';
// import { dataService } from '../services/dataService';
// import { requestService } from '../services/requestService';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const BrowseSuppliers = () => {
//   const navigate = useNavigate();
//   const [suppliers, setSuppliers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [productDialogOpen, setProductDialogOpen] = useState(false);
//   const [requestDialogOpen, setRequestDialogOpen] = useState(false);
//   const [supplierProducts, setSupplierProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [requestType, setRequestType] = useState('product_data');
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   const fetchSuppliers = async () => {
//     try {
//       setLoading(true);
//       // FIX: dataService already returns { suppliers: [...] }
//       const res = await dataService.getSuppliers();
//       setSuppliers(Array.isArray(res?.suppliers) ? res.suppliers : []);
//     } catch (error) {
//       console.error('Failed to fetch suppliers:', error);
//       toast.error(error?.response?.data?.message || 'Failed to fetch suppliers');
//       setSuppliers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewProducts = async (supplier) => {
//     setSelectedSupplier(supplier);
//     // Mock products for now - replace with API later
//     setSupplierProducts([
//       { 
//         id: 1, 
//         name: 'Coffee Beans - Arabica', 
//         category: 'Coffee', 
//         origin: supplier?.country || '—',
//         landPlots: [
//           { name: 'Plot A1', area: '50 hectares', coordinates: { lat: -15.7801, lng: -47.9292 } },
//           { name: 'Plot A2', area: '30 hectares', coordinates: { lat: -15.7901, lng: -47.9392 } }
//         ]
//       },
//       { 
//         id: 2, 
//         name: 'Coffee Beans - Robusta', 
//         category: 'Coffee', 
//         origin: 'Vietnam',
//         landPlots: [
//           { name: 'Plot B1', area: '40 hectares', coordinates: { lat: 10.8231, lng: 106.6297 } }
//         ]
//       },
//       { 
//         id: 3, 
//         name: 'Cocoa Beans', 
//         category: 'Cocoa', 
//         origin: 'Ghana',
//         landPlots: [
//           { name: 'Plot C1', area: '60 hectares', coordinates: { lat: 7.9465, lng: -1.0232 } }
//         ]
//       }
//     ]);
//     setProductDialogOpen(true);
//   };

//   const handleCreateRequest = () => {
//     if (selectedProducts.length === 0) {
//       toast.error('Please select at least one product');
//       return;
//     }
//     setProductDialogOpen(false);
//     setRequestDialogOpen(true);
//   };

//   const handleSubmitRequest = async () => {
//     try {
//       await requestService.createRequest({
//         supplierId: selectedSupplier?._id || selectedSupplier?.name || selectedSupplier?.id,
//         requestType,
//         message,
//         requestedProducts: selectedProducts.map(p => ({
//           productCode: p.id,
//           productName: p.name,
//           category: p.category
//         }))
//       });
//       toast.success('Request sent successfully');
//       setRequestDialogOpen(false);
//       setSelectedProducts([]);
//       setMessage('');
//       navigate('/requests');
//     } catch (error) {
//       console.error(error);
//       toast.error(error?.response?.data?.message || 'Failed to create request');
//     }
//   };

//   const handleProductSelect = (product) => {
//     setSelectedProducts((prev) => {
//       const exists = prev.some(p => p.id === product.id);
//       return exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
//     });
//   };

//   const handleViewOnMap = (product) => {
//     navigate('/map', { state: { product, supplier: selectedSupplier } });
//   };

//   const filteredSuppliers = (suppliers || []).filter((s) => {
//     const name = (s.companyName || s.supplier_name || s.name || '').toLowerCase();
//     const country = (s.country || '').toLowerCase();
//     const q = (search || '').toLowerCase();
//     return name.includes(q) || country.includes(q);
//   });

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
//         Browse Suppliers
//       </Typography>

//       <TextField
//         fullWidth
//         placeholder="Search suppliers by name or country..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         sx={{ mb: 4 }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon />
//             </InputAdornment>
//           ),
//         }}
//       />

//       {filteredSuppliers.length === 0 ? (
//         <Paper sx={{ p: 3 }}>
//           <Alert severity="info">No suppliers found.</Alert>
//         </Paper>
//       ) : (
//         <Grid container spacing={3}>
//           {filteredSuppliers.map((supplier) => {
//             const id = supplier._id || supplier.name || supplier.id;
//             const company = supplier.companyName || supplier.supplier_name || supplier.name || '—';
//             const country = supplier.country || '—';
//             const isEU = !!supplier.isEU;

//             return (
//               <Grid item xs={12} md={6} lg={4} key={id}>
//                 <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//                   <CardContent sx={{ flex: 1 }}>
//                     <Typography variant="h6" gutterBottom>
//                       {company}
//                     </Typography>
//                     <Box sx={{ mb: 2 }}>
//                       <Chip
//                         icon={<LocationIcon />}
//                         label={country}
//                         size="small"
//                         sx={{ mr: 1 }}
//                       />
//                       {isEU && <Chip label="EU" color="primary" size="small" />}
//                     </Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Click to view available products and their origins
//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button
//                       size="small"
//                       startIcon={<ProductIcon />}
//                       onClick={() => handleViewProducts(supplier)}
//                     >
//                       View Products
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             );
//           })}
//         </Grid>
//       )}

//       {/* Product Dialog */}
//       <Dialog 
//         open={productDialogOpen} 
//         onClose={() => setProductDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           Products from {selectedSupplier?.companyName || selectedSupplier?.supplier_name || selectedSupplier?.name}
//         </DialogTitle>
//         <DialogContent>
//           <Alert severity="info" sx={{ mb: 2 }}>
//             Select products to request detailed EUDR compliance data
//           </Alert>
//           <List>
//             {supplierProducts.map((product) => (
//               <ListItem 
//                 key={product.id}
//                 sx={{ 
//                   border: '1px solid #e0e0e0', 
//                   borderRadius: 1, 
//                   mb: 1,
//                   flexDirection: 'column',
//                   alignItems: 'flex-start'
//                 }}
//               >
//                 <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
//                   <Checkbox
//                     checked={selectedProducts.some(p => p.id === product.id)}
//                     onChange={() => handleProductSelect(product)}
//                   />
//                   <ListItemText
//                     primary={product.name}
//                     secondary={`Category: ${product.category} | Origin: ${product.origin}`}
//                   />
//                   <Button
//                     size="small"
//                     startIcon={<MapIcon />}
//                     onClick={() => handleViewOnMap(product)}
//                   >
//                     View on Map
//                   </Button>
//                 </Box>
//                 <Box sx={{ pl: 6, mt: 1 }}>
//                   <Typography variant="caption" color="text.secondary">
//                     Land Plots: {product.landPlots.map(lp => lp.name).join(', ')}
//                   </Typography>
//                 </Box>
//               </ListItem>
//             ))}
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setProductDialogOpen(false)}>Cancel</Button>
//           <Button 
//             variant="contained" 
//             startIcon={<RequestIcon />}
//             onClick={handleCreateRequest}
//             disabled={selectedProducts.length === 0}
//           >
//             Create Request ({selectedProducts.length} selected)
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Request Dialog */}
//       <Dialog 
//         open={requestDialogOpen} 
//         onClose={() => setRequestDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>Create Request</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Request Type</InputLabel>
//             <Select
//               value={requestType}
//               onChange={(e) => setRequestType(e.target.value)}
//             >
//               <MenuItem value="land_plot">Land Plot Data</MenuItem>
//               <MenuItem value="product_data">Product Data with EUDR Compliance</MenuItem>
//               <MenuItem value="purchase_order">Purchase Order</MenuItem>
//             </Select>
//           </FormControl>
          
//           <Box sx={{ mt: 2, mb: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Selected Products:
//             </Typography>
//             {selectedProducts.map(p => (
//               <Chip 
//                 key={p.id} 
//                 label={p.name} 
//                 size="small" 
//                 sx={{ mr: 1, mb: 1 }}
//               />
//             ))}
//           </Box>

//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Additional Message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Add any specific requirements or questions..."
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setRequestDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleSubmitRequest} variant="contained">
//             Send Request
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default BrowseSuppliers;
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent, CardActions, Button, Chip,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText,
  Checkbox, Alert, CircularProgress, Fade, useTheme, alpha, Avatar
} from '@mui/material';
import {
  Search as SearchIcon, LocationOn as LocationIcon, Inventory as ProductIcon,
  RequestQuote as RequestIcon, Map as MapIcon, Business as BusinessIcon
} from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { requestService } from '../services/requestService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// --- STYLED COMPONENT: Hover Card ---
const SupplierCard = ({ supplier, onSelect }) => (
  <Card 
    elevation={0}
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 4,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
        borderColor: 'transparent'
      }
    }}
  >
    <CardContent sx={{ flex: 1, p: 3 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', mr: 2 }}>
          {supplier.companyName ? supplier.companyName[0] : <BusinessIcon />}
        </Avatar>
        <Typography variant="h6" fontWeight={700} noWrap>
          {supplier.companyName || supplier.supplier_name || supplier.name}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          icon={<LocationIcon fontSize="small" />} 
          label={supplier.country || 'Unknown'} 
          size="small" 
          variant="outlined"
          sx={{ borderRadius: 1, fontWeight: 600 }}
        />
        {supplier.isEU && (
          <Chip label="EU Member" color="primary" size="small" sx={{ borderRadius: 1, fontWeight: 600 }} />
        )}
      </Box>
      
      <Typography variant="body2" color="text.secondary">
        View available coffee and cocoa products with origin data.
      </Typography>
    </CardContent>
    
    <CardActions sx={{ p: 3, pt: 0 }}>
      <Button 
        fullWidth 
        variant="outlined" 
        startIcon={<ProductIcon />} 
        onClick={() => onSelect(supplier)}
        sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
      >
        View Products
      </Button>
    </CardActions>
  </Card>
);

const BrowseSuppliers = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Selection & Dialog State
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  
  // Request Data
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [requestType, setRequestType] = useState('product_data');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await dataService.getSuppliers();
      setSuppliers(Array.isArray(res?.suppliers) ? res.suppliers : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProducts = (supplier) => {
    setSelectedSupplier(supplier);
    // Mock Data - in production this would be an API call
    setSupplierProducts([
      { 
        id: 1, name: 'Coffee Beans - Arabica', category: 'Coffee', origin: supplier?.country || 'Brazil',
        landPlots: [{ name: 'Plot A1', area: '50 ha' }, { name: 'Plot A2', area: '30 ha' }]
      },
      { 
        id: 2, name: 'Coffee Beans - Robusta', category: 'Coffee', origin: 'Vietnam',
        landPlots: [{ name: 'Plot B1', area: '40 ha' }]
      },
      { 
        id: 3, name: 'Cocoa Beans', category: 'Cocoa', origin: 'Ghana',
        landPlots: [{ name: 'Plot C1', area: '60 ha' }]
      }
    ]);
    setProductDialogOpen(true);
  };

  const handleCreateRequest = () => {
    if (selectedProducts.length === 0) return toast.error('Please select at least one product');
    setProductDialogOpen(false);
    setRequestDialogOpen(true);
  };

  const handleSubmitRequest = async () => {
    try {
      await requestService.createRequest({
        supplierId: selectedSupplier?._id || selectedSupplier?.name || selectedSupplier?.id,
        requestType,
        message,
        requestedProducts: selectedProducts.map(p => ({
          productCode: p.id, productName: p.name, category: p.category
        }))
      });
      toast.success('Request sent successfully');
      setRequestDialogOpen(false);
      setSelectedProducts([]);
      setMessage('');
      navigate('/requests');
    } catch (error) {
      toast.error('Failed to create request');
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      return exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
    });
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const q = search.toLowerCase();
    return (s.companyName || s.name || '').toLowerCase().includes(q) || (s.country || '').toLowerCase().includes(q);
  });

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Fade in={true}>
      <Box>
        {/* --- HEADER --- */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            fontWeight={800} 
            sx={{ 
              mb: 1,
              background: 'linear-gradient(45deg, #2E3B55 30%, #6a5acd 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Browse Suppliers
          </Typography>
          <Typography color="text.secondary">
            Discover verified suppliers and request compliance data.
          </Typography>
        </Box>

        {/* --- SEARCH --- */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1, mb: 4, borderRadius: 3, 
            border: '1px solid', borderColor: 'divider', 
            display: 'flex', alignItems: 'center' 
          }}
        >
          <InputAdornment position="start" sx={{ pl: 2, color: 'text.secondary' }}>
            <SearchIcon />
          </InputAdornment>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search by supplier name or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ px: 2 }}
          />
        </Paper>

        {/* --- GRID --- */}
        {filteredSuppliers.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>No suppliers matching your search.</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredSuppliers.map((supplier) => (
              <Grid item xs={12} md={6} lg={4} key={supplier._id || supplier.id}>
                <SupplierCard supplier={supplier} onSelect={handleViewProducts} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* --- PRODUCT DIALOG --- */}
        <Dialog 
          open={productDialogOpen} 
          onClose={() => setProductDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            Products: {selectedSupplier?.companyName || selectedSupplier?.name}
          </DialogTitle>
          <DialogContent dividers>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Select products below to request specific EUDR compliance data.
            </Alert>
            <List>
              {supplierProducts.map((product) => {
                const isSelected = selectedProducts.some(p => p.id === product.id);
                return (
                  <Paper 
                    key={product.id} 
                    elevation={0} 
                    variant="outlined" 
                    sx={{ 
                      mb: 2, borderRadius: 2, overflow: 'hidden',
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
                      borderColor: isSelected ? 'primary.main' : 'divider'
                    }}
                  >
                    <ListItem disablePadding>
                      <Box sx={{ width: '100%', p: 2 }}>
                        <Box display="flex" alignItems="start" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={2}>
                             <Checkbox 
                                checked={isSelected} 
                                onChange={() => handleProductSelect(product)}
                                color="primary"
                             />
                             <Box>
                               <Typography fontWeight={600}>{product.name}</Typography>
                               <Typography variant="body2" color="text.secondary">
                                 {product.category} • Origin: {product.origin}
                               </Typography>
                             </Box>
                          </Box>
                          <Button 
                            size="small" 
                            startIcon={<MapIcon />} 
                            onClick={() => navigate('/map', { state: { product, supplier: selectedSupplier } })}
                            sx={{ borderRadius: 2 }}
                          >
                            Map
                          </Button>
                        </Box>
                        
                        <Box sx={{ mt: 2, pl: 6 }}>
                          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                            Associated Plots
                          </Typography>
                          <Box display="flex" gap={1} mt={0.5} flexWrap="wrap">
                            {product.landPlots.map((lp, idx) => (
                               <Chip key={idx} label={`${lp.name} (${lp.area})`} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                  </Paper>
                );
              })}
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setProductDialogOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
            <Button 
              variant="contained" 
              startIcon={<RequestIcon />} 
              onClick={handleCreateRequest}
              disabled={selectedProducts.length === 0}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Request Data ({selectedProducts.length})
            </Button>
          </DialogActions>
        </Dialog>

        {/* --- REQUEST CONFIRMATION DIALOG --- */}
        <Dialog 
          open={requestDialogOpen} 
          onClose={() => setRequestDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Finalize Request</DialogTitle>
          <DialogContent dividers>
            <FormControl fullWidth margin="normal">
              <InputLabel>Request Type</InputLabel>
              <Select value={requestType} onChange={(e) => setRequestType(e.target.value)} label="Request Type">
                <MenuItem value="land_plot">Land Plot Data</MenuItem>
                <MenuItem value="product_data">Product Data (EUDR)</MenuItem>
                <MenuItem value="purchase_order">Purchase Order</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Selected Items:</Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                {selectedProducts.map(p => (
                  <Chip key={p.id} label={p.name} size="small" />
                ))}
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message to Supplier"
              placeholder="Add any specific requirements..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setRequestDialogOpen(false)} sx={{ color: 'text.secondary' }}>Back</Button>
            <Button onClick={handleSubmitRequest} variant="contained" sx={{ borderRadius: 2, px: 4 }}>
              Send Request
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Fade>
  );
};

export default BrowseSuppliers;
