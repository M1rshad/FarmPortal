// import React, { useState, useEffect } from 'react';
// import {
//   Box, Paper, Typography, Grid, Card, CardContent, CardActions, Button, Chip,
//   TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
//   FormControl, InputLabel, Select, MenuItem, List, ListItem, Checkbox, Alert,
//   CircularProgress, Fade, useTheme, alpha, Avatar, IconButton
// } from '@mui/material';
// import {
//   Search as SearchIcon, LocationOn as LocationIcon, Inventory as ProductIcon,
//   RequestQuote as RequestIcon, Map as MapIcon, Business as BusinessIcon,
//   Add as AddIcon
// } from '@mui/icons-material';
// import { dataService } from '../services/dataService';
// import { requestService } from '../services/requestService';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// // --- STYLED COMPONENT: Hover Card ---
// const SupplierCard = ({ supplier, onSelect }) => (
//   <Card 
//     elevation={0}
//     sx={{ 
//       height: '100%', 
//       display: 'flex', 
//       flexDirection: 'column',
//       border: '1px solid',
//       borderColor: 'divider',
//       borderRadius: 4,
//       transition: 'all 0.3s ease',
//       '&:hover': {
//         transform: 'translateY(-4px)',
//         boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
//         borderColor: 'transparent'
//       }
//     }}
//   >
//     <CardContent sx={{ flex: 1, p: 3 }}>
//       <Box display="flex" alignItems="center" mb={2}>
//         <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main', mr: 2 }}>
//           {supplier.companyName ? supplier.companyName[0] : <BusinessIcon />}
//         </Avatar>
//         <Typography variant="h6" fontWeight={700} noWrap>
//           {supplier.companyName || supplier.supplier_name || supplier.name}
//         </Typography>
//       </Box>
      
//       <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//         <Chip 
//           icon={<LocationIcon fontSize="small" />} 
//           label={supplier.country || 'Unknown'} 
//           size="small" 
//           variant="outlined"
//           sx={{ borderRadius: 1, fontWeight: 600 }}
//         />
//         {supplier.isEU && (
//           <Chip label="EU Member" color="primary" size="small" sx={{ borderRadius: 1, fontWeight: 600 }} />
//         )}
//       </Box>
      
//       <Typography variant="body2" color="text.secondary">
//         View available coffee and cocoa products with origin data.
//       </Typography>
//     </CardContent>
    
//     <CardActions sx={{ p: 3, pt: 0 }}>
//       <Button 
//         fullWidth 
//         variant="outlined" 
//         startIcon={<ProductIcon />} 
//         onClick={() => onSelect(supplier)}
//         sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
//       >
//         View Products
//       </Button>
//     </CardActions>
//   </Card>
// );

// const BrowseSuppliers = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
  
//   const [suppliers, setSuppliers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
  
//   // Selection & Dialog State
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [productDialogOpen, setProductDialogOpen] = useState(false);
//   const [requestDialogOpen, setRequestDialogOpen] = useState(false);
//   const [addSupplierOpen, setAddSupplierOpen] = useState(false); // NEW STATE for Add Supplier Dialog
  
//   // Request Data
//   const [supplierProducts, setSupplierProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [requestType, setRequestType] = useState('product_data');
//   const [message, setMessage] = useState('');

//   // New Supplier Form Data
//   const [newSupplier, setNewSupplier] = useState({
//     name: '',
//     email: '',
//     country: ''
//   });

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   const fetchSuppliers = async () => {
//     try {
//       setLoading(true);
//       const res = await dataService.getSuppliers();
//       setSuppliers(Array.isArray(res?.suppliers) ? res.suppliers : []);
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'Failed to fetch suppliers');
//       setSuppliers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewProducts = (supplier) => {
//     setSelectedSupplier(supplier);
//     // Mock Data - in production this would be an API call
//     setSupplierProducts([
//       { 
//         id: 1, name: 'Coffee Beans - Arabica', category: 'Coffee', origin: supplier?.country || 'Brazil',
//         landPlots: [{ name: 'Plot A1', area: '50 ha' }, { name: 'Plot A2', area: '30 ha' }]
//       },
//       { 
//         id: 2, name: 'Coffee Beans - Robusta', category: 'Coffee', origin: 'Vietnam',
//         landPlots: [{ name: 'Plot B1', area: '40 ha' }]
//       },
//       { 
//         id: 3, name: 'Cocoa Beans', category: 'Cocoa', origin: 'Ghana',
//         landPlots: [{ name: 'Plot C1', area: '60 ha' }]
//       }
//     ]);
//     setProductDialogOpen(true);
//   };

//   const handleCreateRequest = () => {
//     if (selectedProducts.length === 0) return toast.error('Please select at least one product');
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
//           productCode: p.id, productName: p.name, category: p.category
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
//     setSelectedProducts(prev => {
//       const exists = prev.some(p => p.id === product.id);
//       return exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
//     });
//   };

//   // --- NEW: Handle Add Supplier ---
//   const handleAddSupplier = async () => {
//     // Simple validation
//     if (!newSupplier.name || !newSupplier.email) {
//         return toast.error("Name and Email are required");
//     }

//     try {
//         // Call the custom backend API method via dataService
//         await dataService.addSupplier(newSupplier);
        
//         toast.success(`Supplier "${newSupplier.name}" added & invite sent!`);
//         setAddSupplierOpen(false);
//         setNewSupplier({ name: '', email: '', country: '' });
        
//         // Refresh the list to show the new supplier
//         fetchSuppliers(); 
//     } catch (error) {
//         console.error("Add Supplier Error:", error);
//         const errMsg = error.response?.data?.message || error.message || "Failed to add supplier";
//         toast.error(errMsg);
//     }
//   };

//   const filteredSuppliers = suppliers.filter((s) => {
//     const q = search.toLowerCase();
//     return (s.companyName || s.name || '').toLowerCase().includes(q) || (s.country || '').toLowerCase().includes(q);
//   });

//   if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

//   return (
//     <Fade in={true}>
//       <Box>
//         {/* --- HEADER --- */}
//         <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography 
//                 variant="h4" 
//                 fontWeight={800} 
//                 sx={{ 
//                 mb: 1,
//                 background: 'linear-gradient(45deg, #2E3B55 30%, #6a5acd 90%)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 }}
//             >
//                 Browse Suppliers
//             </Typography>
//             <Typography color="text.secondary">
//                 Discover verified suppliers and request compliance data.
//             </Typography>
//           </Box>
//           {/* NEW ADD BUTTON */}
//           <Button 
//             variant="contained" 
//             startIcon={<AddIcon />} 
//             onClick={() => setAddSupplierOpen(true)}
//             sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3 }}
//           >
//             Add Supplier
//           </Button>
//         </Box>

//         {/* --- SEARCH --- */}
//         <Paper 
//           elevation={0} 
//           sx={{ 
//             p: 1, mb: 4, borderRadius: 3, 
//             border: '1px solid', borderColor: 'divider', 
//             display: 'flex', alignItems: 'center' 
//           }}
//         >
//           <InputAdornment position="start" sx={{ pl: 2, color: 'text.secondary' }}>
//             <SearchIcon />
//           </InputAdornment>
//           <TextField
//             fullWidth
//             variant="standard"
//             placeholder="Search by supplier name or country..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             InputProps={{ disableUnderline: true }}
//             sx={{ px: 2 }}
//           />
//         </Paper>

//         {/* --- GRID --- */}
//         {filteredSuppliers.length === 0 ? (
//           <Alert severity="info" sx={{ borderRadius: 2 }}>No suppliers matching your search.</Alert>
//         ) : (
//           <Grid container spacing={3}>
//             {filteredSuppliers.map((supplier) => (
//               <Grid item xs={12} md={6} lg={4} key={supplier._id || supplier.id}>
//                 <SupplierCard supplier={supplier} onSelect={handleViewProducts} />
//               </Grid>
//             ))}
//           </Grid>
//         )}

//         {/* --- ADD SUPPLIER DIALOG --- */}
//         <Dialog 
//             open={addSupplierOpen} 
//             onClose={() => setAddSupplierOpen(false)}
//             maxWidth="sm"
//             fullWidth
//             PaperProps={{ sx: { borderRadius: 3 } }}
//         >
//             <DialogTitle sx={{ fontWeight: 700 }}>Add New Supplier</DialogTitle>
//             <DialogContent dividers>
//                 <Typography variant="body2" color="text.secondary" paragraph>
//                     This will create a new Supplier record and a User account. An email invite will be sent automatically.
//                 </Typography>
//                 <TextField
//                     fullWidth
//                     label="Supplier Name"
//                     value={newSupplier.name}
//                     onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
//                     margin="normal"
//                     required
//                     placeholder="e.g. Green Harvest Co."
//                 />
//                 <TextField
//                     fullWidth
//                     label="Email Address"
//                     type="email"
//                     value={newSupplier.email}
//                     onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
//                     margin="normal"
//                     required
//                     placeholder="contact@greenharvest.com"
//                     helperText="Used for login and notifications"
//                 />
//                 <TextField
//                     fullWidth
//                     label="Country"
//                     value={newSupplier.country}
//                     onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
//                     margin="normal"
//                     placeholder="e.g. Brazil"
//                 />
//             </DialogContent>
//             <DialogActions sx={{ p: 2.5 }}>
//                 <Button onClick={() => setAddSupplierOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
//                 <Button 
//                     variant="contained" 
//                     onClick={handleAddSupplier}
//                     sx={{ borderRadius: 2, px: 3 }}
//                 >
//                     Create & Invite
//                 </Button>
//             </DialogActions>
//         </Dialog>

//         {/* --- PRODUCT DIALOG --- */}
//         <Dialog 
//           open={productDialogOpen} 
//           onClose={() => setProductDialogOpen(false)} 
//           maxWidth="md" 
//           fullWidth
//           PaperProps={{ sx: { borderRadius: 3 } }}
//         >
//           <DialogTitle sx={{ fontWeight: 700 }}>
//             Products: {selectedSupplier?.companyName || selectedSupplier?.name}
//           </DialogTitle>
//           <DialogContent dividers>
//             <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
//               Select products below to request specific EUDR compliance data.
//             </Alert>
//             <List>
//               {supplierProducts.map((product) => {
//                 const isSelected = selectedProducts.some(p => p.id === product.id);
//                 return (
//                   <Paper 
//                     key={product.id} 
//                     elevation={0} 
//                     variant="outlined" 
//                     sx={{ 
//                       mb: 2, borderRadius: 2, overflow: 'hidden',
//                       bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.04) : 'background.paper',
//                       borderColor: isSelected ? 'primary.main' : 'divider'
//                     }}
//                   >
//                     <ListItem disablePadding>
//                       <Box sx={{ width: '100%', p: 2 }}>
//                         <Box display="flex" alignItems="start" justifyContent="space-between">
//                           <Box display="flex" alignItems="center" gap={2}>
//                              <Checkbox 
//                                 checked={isSelected} 
//                                 onChange={() => handleProductSelect(product)}
//                                 color="primary"
//                              />
//                              <Box>
//                                <Typography fontWeight={600}>{product.name}</Typography>
//                                <Typography variant="body2" color="text.secondary">
//                                  {product.category} • Origin: {product.origin}
//                                </Typography>
//                              </Box>
//                           </Box>
//                           <Button 
//                             size="small" 
//                             startIcon={<MapIcon />} 
//                             onClick={() => navigate('/map', { state: { product, supplier: selectedSupplier } })}
//                             sx={{ borderRadius: 2 }}
//                           >
//                             Map
//                           </Button>
//                         </Box>
                        
//                         <Box sx={{ mt: 2, pl: 6 }}>
//                           <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
//                             Associated Plots
//                           </Typography>
//                           <Box display="flex" gap={1} mt={0.5} flexWrap="wrap">
//                             {product.landPlots.map((lp, idx) => (
//                                <Chip key={idx} label={`${lp.name} (${lp.area})`} size="small" variant="outlined" />
//                             ))}
//                           </Box>
//                         </Box>
//                       </Box>
//                     </ListItem>
//                   </Paper>
//                 );
//               })}
//             </List>
//           </DialogContent>
//           <DialogActions sx={{ p: 2.5 }}>
//             <Button onClick={() => setProductDialogOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
//             <Button 
//               variant="contained" 
//               startIcon={<RequestIcon />} 
//               onClick={handleCreateRequest}
//               disabled={selectedProducts.length === 0}
//               sx={{ borderRadius: 2, px: 3 }}
//             >
//               Request Data ({selectedProducts.length})
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* --- REQUEST CONFIRMATION DIALOG --- */}
//         <Dialog 
//           open={requestDialogOpen} 
//           onClose={() => setRequestDialogOpen(false)} 
//           maxWidth="sm" 
//           fullWidth
//           PaperProps={{ sx: { borderRadius: 3 } }}
//         >
//           <DialogTitle sx={{ fontWeight: 700 }}>Finalize Request</DialogTitle>
//           <DialogContent dividers>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Request Type</InputLabel>
//               <Select value={requestType} onChange={(e) => setRequestType(e.target.value)} label="Request Type">
//                 <MenuItem value="land_plot">Land Plot Data</MenuItem>
//                 <MenuItem value="product_data">Product Data (EUDR)</MenuItem>
//                 <MenuItem value="purchase_order">Purchase Order</MenuItem>
//               </Select>
//             </FormControl>

//             <Box sx={{ mt: 3 }}>
//               <Typography variant="subtitle2" gutterBottom>Selected Items:</Typography>
//               <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
//                 {selectedProducts.map(p => (
//                   <Chip key={p.id} label={p.name} size="small" />
//                 ))}
//               </Box>
//             </Box>

//             <TextField
//               fullWidth
//               multiline
//               rows={4}
//               label="Message to Supplier"
//               placeholder="Add any specific requirements..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               margin="normal"
//             />
//           </DialogContent>
//           <DialogActions sx={{ p: 2.5 }}>
//             <Button onClick={() => setRequestDialogOpen(false)} sx={{ color: 'text.secondary' }}>Back</Button>
//             <Button onClick={handleSubmitRequest} variant="contained" sx={{ borderRadius: 2, px: 4 }}>
//               Send Request
//             </Button>
//           </DialogActions>
//         </Dialog>

//       </Box>
//     </Fade>
//   );
// };

// export default BrowseSuppliers;

import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, TextField, InputAdornment, Dialog, 
  DialogTitle, DialogContent, DialogActions, Fade, useTheme, alpha, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon, Add as AddIcon, 
  Block as BlockIcon, CheckCircle as CheckIcon,
  Delete as DeleteIcon // Using Delete icon for "soft delete"/disable visual if preferred
} from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { toast } from 'react-toastify';

const BrowseSuppliers = () => {
  const theme = useTheme();
  
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  
  // New Supplier Form Data
  const [newSupplier, setNewSupplier] = useState({ name: '', email: '', country: '' });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await dataService.getSuppliers();
      setSuppliers(Array.isArray(res?.suppliers) ? res.suppliers : []);
    } catch (error) {
      toast.error('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplier.name || !newSupplier.email) return toast.error("Name and Email required");
    try {
      await dataService.addSupplier(newSupplier);
      toast.success(`Supplier "${newSupplier.name}" added!`);
      setAddSupplierOpen(false);
      setNewSupplier({ name: '', email: '', country: '' });
      fetchSuppliers(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add supplier");
    }
  };

  const handleToggleAccess = async (supplier) => {
    // If user is currently enabled (1), we want to disable (0). And vice versa.
    // Assuming 'enabled' field comes from API. If not, we might need to fetch it or assume enabled.
    // For soft-delete context: usually means disabling.
    
    const currentStatus = supplier.user_enabled; // Ensure your get_suppliers API returns this!
    const newStatus = currentStatus ? 0 : 1;
    const action = newStatus ? "Enable" : "Disable";

    if (!window.confirm(`Are you sure you want to ${action} access for ${supplier.supplier_name}?`)) return;

    try {
      await dataService.toggleSupplierAccess(supplier.name, newStatus);
      toast.success(`Supplier ${action}d successfully`);
      fetchSuppliers(); // Refresh to see new status
    } catch (error) {
      toast.error(`Failed to ${action} supplier`);
    }
  };

  // Filter Logic
  const filteredSuppliers = suppliers.filter((s) => {
    const q = search.toLowerCase();
    return (s.supplier_name || s.name || '').toLowerCase().includes(q) || 
           (s.country || '').toLowerCase().includes(q) ||
           (s.email_id || '').toLowerCase().includes(q);
  });

  if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;

  return (
    <Fade in={true}>
      <Box>
        {/* --- HEADER --- */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 1, background: 'linear-gradient(45deg, #2E3B55 30%, #6a5acd 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Suppliers
            </Typography>
            <Typography color="text.secondary">Manage your supplier directory.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddSupplierOpen(true)} sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}>
            Add Supplier
          </Button>
        </Box>

        {/* --- SEARCH --- */}
        <Paper elevation={0} sx={{ p: 1, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
          <InputAdornment position="start" sx={{ pl: 2, color: 'text.secondary' }}><SearchIcon /></InputAdornment>
          <TextField
            fullWidth variant="standard" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ disableUnderline: true }} sx={{ px: 2 }}
          />
        </Paper>

        {/* --- LIST VIEW (TABLE) --- */}
        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'background.neutral' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, pl: 4 }}>Supplier Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, pr: 4 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>No suppliers found.</TableCell></TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => {
                    // Assuming your API returns 'user_enabled' (0 or 1)
                    const isEnabled = supplier.user_enabled !== 0; 
                    
                    return (
                      <TableRow key={supplier.name} hover>
                        <TableCell sx={{ pl: 4, fontWeight: 500 }}>
                          {supplier.supplier_name || supplier.name}
                        </TableCell>
                        <TableCell>{supplier.country || '—'}</TableCell>
                        <TableCell>{supplier.email_id || '—'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={isEnabled ? "Active" : "Disabled"} 
                            color={isEnabled ? "success" : "default"} 
                            size="small" 
                            variant={isEnabled ? "filled" : "outlined"}
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 4 }}>
                          <Button
                            size="small"
                            color={isEnabled ? "error" : "success"}
                            startIcon={isEnabled ? <BlockIcon /> : <CheckIcon />}
                            onClick={() => handleToggleAccess(supplier)}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                          >
                            {isEnabled ? "Disable" : "Enable"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* --- ADD SUPPLIER DIALOG --- */}
        <Dialog open={addSupplierOpen} onClose={() => setAddSupplierOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>Add New Supplier</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                  <TextField label="Supplier Name" fullWidth value={newSupplier.name} onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })} required />
                  <TextField label="Email Address" type="email" fullWidth value={newSupplier.email} onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })} required />
                  <TextField label="Country" fullWidth value={newSupplier.country} onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })} />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={() => setAddSupplierOpen(false)} color="inherit">Cancel</Button>
                <Button variant="contained" onClick={handleAddSupplier}>Create & Invite</Button>
            </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default BrowseSuppliers;
