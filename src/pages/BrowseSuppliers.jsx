// // src/pages/BrowseSuppliers.jsx (COMPLETE)
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
//   Alert
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
//       const response = await dataService.getSuppliers();
//       setSuppliers(response.data.suppliers);
//     } catch (error) {
//       toast.error('Failed to fetch suppliers');
//     }
//   };

//   const handleViewProducts = async (supplier) => {
//     setSelectedSupplier(supplier);
//     // Mock products for now - in real implementation, fetch from API
//     setSupplierProducts([
//       { 
//         id: 1, 
//         name: 'Coffee Beans - Arabica', 
//         category: 'Coffee', 
//         origin: 'Brazil',
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
//         supplierId: selectedSupplier._id,
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
//       toast.error('Failed to create request');
//     }
//   };

//   const handleProductSelect = (product) => {
//     const isSelected = selectedProducts.find(p => p.id === product.id);
//     if (isSelected) {
//       setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
//     } else {
//       setSelectedProducts([...selectedProducts, product]);
//     }
//   };

//   const handleViewOnMap = (product) => {
//     // Navigate to map view with product data
//     navigate('/map', { 
//       state: { 
//         product,
//         supplier: selectedSupplier 
//       } 
//     });
//   };

//   const filteredSuppliers = suppliers.filter(s => 
//     s.companyName.toLowerCase().includes(search.toLowerCase()) ||
//     s.country.toLowerCase().includes(search.toLowerCase())
//   );

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

//       <Grid container spacing={3}>
//         {filteredSuppliers.map((supplier) => (
//           <Grid item xs={12} md={6} lg={4} key={supplier._id}>
//             <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//               <CardContent sx={{ flex: 1 }}>
//                 <Typography variant="h6" gutterBottom>
//                   {supplier.companyName}
//                 </Typography>
//                 <Box sx={{ mb: 2 }}>
//                   <Chip 
//                     icon={<LocationIcon />} 
//                     label={supplier.country} 
//                     size="small" 
//                     sx={{ mr: 1 }}
//                   />
//                   {supplier.isEU && (
//                     <Chip label="EU" color="primary" size="small" />
//                   )}
//                 </Box>
//                 <Typography variant="body2" color="text.secondary">
//                   Click to view available products and their origins
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <Button 
//                   size="small" 
//                   startIcon={<ProductIcon />}
//                   onClick={() => handleViewProducts(supplier)}
//                 >
//                   View Products
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Product Dialog */}
//       <Dialog 
//         open={productDialogOpen} 
//         onClose={() => setProductDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           Products from {selectedSupplier?.companyName}
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

// src/pages/BrowseSuppliers.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Inventory as ProductIcon,
  RequestQuote as RequestIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { requestService } from '../services/requestService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BrowseSuppliers = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
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
      // FIX: dataService already returns { suppliers: [...] }
      const res = await dataService.getSuppliers();
      setSuppliers(Array.isArray(res?.suppliers) ? res.suppliers : []);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProducts = async (supplier) => {
    setSelectedSupplier(supplier);
    // Mock products for now - replace with API later
    setSupplierProducts([
      { 
        id: 1, 
        name: 'Coffee Beans - Arabica', 
        category: 'Coffee', 
        origin: supplier?.country || '—',
        landPlots: [
          { name: 'Plot A1', area: '50 hectares', coordinates: { lat: -15.7801, lng: -47.9292 } },
          { name: 'Plot A2', area: '30 hectares', coordinates: { lat: -15.7901, lng: -47.9392 } }
        ]
      },
      { 
        id: 2, 
        name: 'Coffee Beans - Robusta', 
        category: 'Coffee', 
        origin: 'Vietnam',
        landPlots: [
          { name: 'Plot B1', area: '40 hectares', coordinates: { lat: 10.8231, lng: 106.6297 } }
        ]
      },
      { 
        id: 3, 
        name: 'Cocoa Beans', 
        category: 'Cocoa', 
        origin: 'Ghana',
        landPlots: [
          { name: 'Plot C1', area: '60 hectares', coordinates: { lat: 7.9465, lng: -1.0232 } }
        ]
      }
    ]);
    setProductDialogOpen(true);
  };

  const handleCreateRequest = () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return;
    }
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
          productCode: p.id,
          productName: p.name,
          category: p.category
        }))
      });
      toast.success('Request sent successfully');
      setRequestDialogOpen(false);
      setSelectedProducts([]);
      setMessage('');
      navigate('/requests');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to create request');
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some(p => p.id === product.id);
      return exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
    });
  };

  const handleViewOnMap = (product) => {
    navigate('/map', { state: { product, supplier: selectedSupplier } });
  };

  const filteredSuppliers = (suppliers || []).filter((s) => {
    const name = (s.companyName || s.supplier_name || s.name || '').toLowerCase();
    const country = (s.country || '').toLowerCase();
    const q = (search || '').toLowerCase();
    return name.includes(q) || country.includes(q);
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Browse Suppliers
      </Typography>

      <TextField
        fullWidth
        placeholder="Search suppliers by name or country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {filteredSuppliers.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Alert severity="info">No suppliers found.</Alert>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredSuppliers.map((supplier) => {
            const id = supplier._id || supplier.name || supplier.id;
            const company = supplier.companyName || supplier.supplier_name || supplier.name || '—';
            const country = supplier.country || '—';
            const isEU = !!supplier.isEU;

            return (
              <Grid item xs={12} md={6} lg={4} key={id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {company}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        icon={<LocationIcon />}
                        label={country}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {isEU && <Chip label="EU" color="primary" size="small" />}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Click to view available products and their origins
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<ProductIcon />}
                      onClick={() => handleViewProducts(supplier)}
                    >
                      View Products
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Product Dialog */}
      <Dialog 
        open={productDialogOpen} 
        onClose={() => setProductDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Products from {selectedSupplier?.companyName || selectedSupplier?.supplier_name || selectedSupplier?.name}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Select products to request detailed EUDR compliance data
          </Alert>
          <List>
            {supplierProducts.map((product) => (
              <ListItem 
                key={product.id}
                sx={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1, 
                  mb: 1,
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={selectedProducts.some(p => p.id === product.id)}
                    onChange={() => handleProductSelect(product)}
                  />
                  <ListItemText
                    primary={product.name}
                    secondary={`Category: ${product.category} | Origin: ${product.origin}`}
                  />
                  <Button
                    size="small"
                    startIcon={<MapIcon />}
                    onClick={() => handleViewOnMap(product)}
                  >
                    View on Map
                  </Button>
                </Box>
                <Box sx={{ pl: 6, mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Land Plots: {product.landPlots.map(lp => lp.name).join(', ')}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            startIcon={<RequestIcon />}
            onClick={handleCreateRequest}
            disabled={selectedProducts.length === 0}
          >
            Create Request ({selectedProducts.length} selected)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Dialog */}
      <Dialog 
        open={requestDialogOpen} 
        onClose={() => setRequestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Request</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Request Type</InputLabel>
            <Select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <MenuItem value="land_plot">Land Plot Data</MenuItem>
              <MenuItem value="product_data">Product Data with EUDR Compliance</MenuItem>
              <MenuItem value="purchase_order">Purchase Order</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Products:
            </Typography>
            {selectedProducts.map(p => (
              <Chip 
                key={p.id} 
                label={p.name} 
                size="small" 
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Additional Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add any specific requirements or questions..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitRequest} variant="contained">
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BrowseSuppliers;
