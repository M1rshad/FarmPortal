// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Tab,
//   Tabs,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   Alert,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Visibility as ViewIcon,
//   CheckCircle as ApproveIcon,
//   Cancel as RejectIcon,
//   Check as CheckIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { requestService } from '../services/requestService';
// import { dataService } from '../services/dataService';
// import { toast } from 'react-toastify';
// import RespondToRequestModal from '../components/RespondToRequestModal';

// const Requests = () => {
//   const navigate = useNavigate();
//   const { isSupplier, isCustomer } = useAuth();
//   const [tabValue, setTabValue] = useState(0);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [suppliers, setSuppliers] = useState([]);
//   const [newRequest, setNewRequest] = useState({
//     supplierId: '',
//     requestType: '',
//     message: '',
//     requestedProducts: []
//   });
//   const [shareDialog, setShareDialog] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [selectedPlots, setSelectedPlots] = useState([]);
//   const [availablePlots, setAvailablePlots] = useState([
//     // Mock data - will come from ERPNext
//     { id: 'PLOT001', name: 'Coffee Farm Plot A', country: 'Brazil', commodities: ['Coffee'] },
//     { id: 'PLOT002', name: 'Cocoa Farm Plot B', country: 'Ghana', commodities: ['Cocoa'] }
//   ]);

//   useEffect(() => {
//     fetchRequests();
//     if (isCustomer) {
//       fetchSuppliers();
//     }
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       let response;
//       if (isSupplier) {
//         response = await requestService.getSupplierRequests();
//       } else {
//         response = await requestService.getCustomerRequests();
//       }
//       setRequests(response.data.requests);
//     } catch (error) {
//       console.error('Failed to fetch requests:', error);
//       toast.error('Failed to fetch requests');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSuppliers = async () => {
//     try {
//       const response = await dataService.getSuppliers();
//       setSuppliers(response.data.suppliers);
//     } catch (error) {
//       console.error('Failed to fetch suppliers:', error);
//     }
//   };

//   const handleCreateRequest = async () => {
//     try {
//       await requestService.createRequest(newRequest);
//       toast.success('Request created successfully');
//       setCreateDialogOpen(false);
//       fetchRequests();
//       setNewRequest({
//         supplierId: '',
//         requestType: '',
//         message: '',
//         requestedProducts: []
//       });
//     } catch (error) {
//       toast.error('Failed to create request');
//     }
//   };

//   const handleRespondToRequest = async (requestId, action) => {
//     try {
//       await requestService.respondToRequest(requestId, { action });
//       toast.success(`Request ${action}ed successfully`);
//       fetchRequests();
//     } catch (error) {
//       toast.error(`Failed to ${action} request`);
//     }
//   };

//   const handleRespond = async ({ message, status }) => {
//     try {
//       await requestService.respondToRequest(selectedRequest._id, { message, status });
//       setModalOpen(false);
//       setSelectedRequest(null);
//       // Refresh requests or update UI
//       fetchRequests();
//     } catch (error) {
//       console.error('Failed to respond to request:', error);
//     }
//   };

//   const handleSharePlots = (request) => {
//     setSelectedRequest(request);
//     setShareDialog(true);
//     setSelectedPlots([]);
//   };

//   const confirmSharePlots = async () => {
//     try {
//       // In real app, this would call API to share plots
//       await requestService.respondToRequest(selectedRequest._id, {
//         action: 'accept',
//         sharedPlots: selectedPlots
//       });
      
//       toast.success(`Shared ${selectedPlots.length} plot(s) with customer`);
//       setShareDialog(false);
//       fetchRequests();
//     } catch (error) {
//       toast.error('Failed to share plots');
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'warning';
//       case 'completed': return 'success';
//       case 'rejected': return 'error';
//       default: return 'default';
//     }
//   };

//   const filteredRequests = requests.filter(request => {
//     if (tabValue === 0) return request.status === 'pending';
//     if (tabValue === 1) return request.status === 'completed';
//     return true;
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
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Requests
//         </Typography>
//         {isCustomer && (
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setCreateDialogOpen(true)}
//           >
//             Create New Request
//           </Button>
//         )}
//       </Box>

//       <Paper sx={{ width: '100%', mb: 2 }}>
//         <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
//           <Tab label="Pending" />
//           <Tab label="Completed" />
//           <Tab label="All" />
//         </Tabs>
//       </Paper>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Request ID</TableCell>
//               <TableCell>{isSupplier ? 'Customer' : 'Supplier'}</TableCell>
//               <TableCell>Type</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredRequests.map((request) => (
//               <TableRow key={request._id}>
//                 <TableCell>{request._id.slice(-8)}</TableCell>
//                 <TableCell>
//                   {isSupplier ? request.customer?.companyName : request.supplier?.companyName}
//                 </TableCell>
//                 <TableCell>{request.requestType.replace('_', ' ').toUpperCase()}</TableCell>
//                 <TableCell>
//                   <Chip
//                     label={request.status}
//                     color={getStatusColor(request.status)}
//                     size="small"
//                   />
//                 </TableCell>
//                 <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
//                 <TableCell>
//                   <IconButton
//                     size="small"
//                     onClick={() => navigate(`/requests/${request._id}`)}
//                   >
//                     <ViewIcon />
//                   </IconButton>
//                   {isSupplier && request.status === 'pending' && (
//                     <Button
//                       size="small"
//                       variant="contained"
//                       color="primary"
//                       onClick={() => {
//                         setSelectedRequest(request);
//                         setModalOpen(true);
//                       }}
//                     >
//                       Respond
//                     </Button>
//                   )}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Create Request Dialog */}
//       <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Create New Request</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Supplier</InputLabel>
//             <Select
//               value={newRequest.supplierId}
//               onChange={(e) => setNewRequest({ ...newRequest, supplierId: e.target.value })}
//             >
//               {suppliers.map((supplier) => (
//                 <MenuItem key={supplier._id} value={supplier._id}>
//                   {supplier.companyName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Request Type</InputLabel>
//             <Select
//               value={newRequest.requestType}
//               onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}
//             >
//               <MenuItem value="land_plot">Land Plot Data</MenuItem>
//               <MenuItem value="product_data">Product Data</MenuItem>
//               <MenuItem value="purchase_order">Purchase Order</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Message"
//             value={newRequest.message}
//             onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleCreateRequest} variant="contained">Create</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Share Plots Dialog */}
//       <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Share Land Plot Data</DialogTitle>
//         <DialogContent>
//           <Alert severity="info" sx={{ mb: 2 }}>
//             Select land plots to share with {selectedRequest?.customer?.companyName}
//           </Alert>
//           <List>
//             {availablePlots.map((plot) => (
//               <ListItem key={plot.id}>
//                 <Checkbox
//                   checked={selectedPlots.includes(plot.id)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setSelectedPlots([...selectedPlots, plot.id]);
//                     } else {
//                       setSelectedPlots(selectedPlots.filter(id => id !== plot.id));
//                     }
//                   }}
//                 />
//                 <ListItemText
//                   primary={plot.name}
//                   secondary={`${plot.country} - ${plot.commodities.join(', ')}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShareDialog(false)}>Cancel</Button>
//           <Button 
//             variant="contained" 
//             onClick={confirmSharePlots}
//             disabled={selectedPlots.length === 0}
//           >
//             Share {selectedPlots.length} Plot(s)
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Respond To Request Modal */}
//       <RespondToRequestModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleRespond}
//       />
//     </Box>
//   );
// };

// export default Requests;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Tab,
//   Tabs,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   Alert,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Visibility as ViewIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { requestService } from '../services/requestService';
// import { dataService } from '../services/dataService';
// import { toast } from 'react-toastify';
// import RespondToRequestModal from '../components/RespondToRequestModal';

// const Requests = () => {
//   const navigate = useNavigate();
//   const { isSupplier, isCustomer } = useAuth();

//   // Two-type rule: Supplier > Customer; anyone not Supplier is Customer mode
//   const customerMode = !isSupplier;

//   const [tabValue, setTabValue] = useState(0);
//   const [requests, setRequests] = useState([]);        // always keep an array
//   const [loading, setLoading] = useState(true);

//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [suppliers, setSuppliers] = useState([]);

//   const [newRequest, setNewRequest] = useState({
//     supplierId: '',
//     requestType: '',
//     message: '',
//     requestedProducts: []
//   });

//   const [shareDialog, setShareDialog] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);

//   const [selectedPlots, setSelectedPlots] = useState([]);
//   const [availablePlots] = useState([
//     // Mock data - replace with ERPNext data when ready
//     { id: 'PLOT001', name: 'Coffee Farm Plot A', country: 'Brazil', commodities: ['Coffee'] },
//     { id: 'PLOT002', name: 'Cocoa Farm Plot B', country: 'Ghana', commodities: ['Cocoa'] }
//   ]);

//   // --- Helpers ---------------------------------------------------------------

//   const normalize = (list) => (Array.isArray(list) ? list : []).map((r) => ({
//     // id variants
//     _id: r._id || r.id || r.name || '',
//     // parties (adjust these if your API returns different fields)
//     customer: r.customer || r.customer_info || r.customer_details || null,
//     supplier: r.supplier || r.supplier_info || r.supplier_details || null,
//     // type + status
//     requestType: r.requestType || r.request_type || '',
//     status: r.status || 'pending',
//     // timestamp variants
//     createdAt: r.createdAt || r.creation || r.modified || null,
//   }));

//   const getStatusColor = (status) => {
//     switch ((status || '').toLowerCase()) {
//       case 'pending': return 'warning';
//       case 'completed': return 'success';
//       case 'rejected': return 'error';
//       default: return 'default';
//     }
//   };

//   const idOf = (req) => (req?._id || req?.id || req?.name || '').toString();
//   const displayDate = (d) => {
//     try { return d ? new Date(d).toLocaleDateString() : '—'; }
//     catch { return '—'; }
//   };

//   // --- Data fetching ---------------------------------------------------------

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       let resp;
//       if (isSupplier) {
//         resp = await requestService.getSupplierRequests();
//       } else {
//         resp = await requestService.getCustomerRequests();
//       }

//       // try multiple shapes safely
//       const raw =
//         resp?.data?.requests ??
//         resp?.requests ??
//         resp?.data ??
//         [];
//         console.log(raw);

//       setRequests(normalize(raw));
//     } catch (error) {
//       console.error('Failed to fetch requests:', error);
//       toast.error('Failed to fetch requests');
//       setRequests([]); // keep array to avoid UI crash
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSuppliers = async () => {
//     try {
//       const response = await dataService.getSuppliers();
//       const raw = response?.data?.suppliers ?? response?.suppliers ?? [];
//         console.log(raw);
//       setSuppliers(Array.isArray(raw) ? raw : []);
//     } catch (error) {
//       console.error('Failed to fetch suppliers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//     if (customerMode) fetchSuppliers(); // anyone not Supplier is considered Customer side
//     // Refetch if supplier status toggles after auth resolves
//   }, [isSupplier]); // customerMode is implied by isSupplier

//   // --- Actions ---------------------------------------------------------------

//   const handleCreateRequest = async () => {
//     // basic validation
//     if (!newRequest.supplierId || !newRequest.requestType) {
//       toast.error('Please select a Supplier and Request Type');
//       return;
//     }
//     try {
//       await requestService.createRequest(newRequest);
//       toast.success('Request created successfully');
//       setCreateDialogOpen(false);
//       setNewRequest({ supplierId: '', requestType: '', message: '', requestedProducts: [] });
//       fetchRequests();
//     } catch (error) {
//       console.error(error);
//       toast.error(error?.response?.data?.message || 'Failed to create request');
//     }
//   };

//   const handleRespondToRequest = async (requestId, action) => {
//     try {
//       await requestService.respondToRequest(requestId, { action });
//       toast.success(`Request ${action}ed successfully`);
//       fetchRequests();
//     } catch (error) {
//       console.error(error);
//       toast.error(`Failed to ${action} request`);
//     }
//   };

//   const handleRespond = async ({ message, status }) => {
//     try {
//       const rid = idOf(selectedRequest);
//       await requestService.respondToRequest(rid, { message, status });
//       setModalOpen(false);
//       setSelectedRequest(null);
//       fetchRequests();
//     } catch (error) {
//       console.error('Failed to respond to request:', error);
//     }
//   };

//   const handleSharePlots = (request) => {
//     setSelectedRequest(request);
//     setShareDialog(true);
//     setSelectedPlots([]);
//   };

//   const confirmSharePlots = async () => {
//     try {
//       const rid = idOf(selectedRequest);
//       await requestService.respondToRequest(rid, {
//         action: 'accept',
//         sharedPlots: selectedPlots
//       });
//       toast.success(`Shared ${selectedPlots.length} plot(s) with customer`);
//       setShareDialog(false);
//       fetchRequests();
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to share plots');
//     }
//   };

//   // --- Derived ---------------------------------------------------------------

//   const filteredRequests = (requests ?? []).filter((request) => {
//     if (tabValue === 0) return (request.status || '').toLowerCase() === 'pending';
//     if (tabValue === 1) return (request.status || '').toLowerCase() === 'completed';
//     return true;
//   });

//   // --- Render ----------------------------------------------------------------

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Requests
//         </Typography>
//         {customerMode && (
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setCreateDialogOpen(true)}
//           >
//             Create New Request
//           </Button>
//         )}
//       </Box>

//       <Paper sx={{ width: '100%', mb: 2 }}>
//         <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
//           <Tab label="Pending" />
//           <Tab label="Completed" />
//           <Tab label="All" />
//         </Tabs>
//       </Paper>

//       <Paper>
//         {filteredRequests.length === 0 ? (
//           <Box p={3}>
//             <Alert severity="info">No requests found.</Alert>
//           </Box>
//         ) : (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Request ID</TableCell>
//                   <TableCell>{isSupplier ? 'Customer' : 'Supplier'}</TableCell>
//                   <TableCell>Type</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Date</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredRequests.map((request) => {
//                   const rid = idOf(request);
//                   const partyName = isSupplier
//                     ? (request.customer?.companyName || request.customer?.name || '—')
//                     : (request.supplier?.companyName || request.supplier?.name || '—');

//                   const reqTypeLabel = (request.requestType ?? '')
//                     .toString()
//                     .replace(/_/g, ' ')
//                     .toUpperCase();

//                   return (
//                     <TableRow key={rid || Math.random()}>
//                       <TableCell>{(rid || '').slice(-8)}</TableCell>
//                       <TableCell>{partyName}</TableCell>
//                       <TableCell>{reqTypeLabel || '—'}</TableCell>
//                       <TableCell>
//                         <Chip
//                           label={request.status || '—'}
//                           color={getStatusColor(request.status)}
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell>{displayDate(request.createdAt)}</TableCell>
//                       <TableCell>
//                         <IconButton
//                           size="small"
//                           onClick={() => navigate(`/requests/${rid}`)}
//                         >
//                           <ViewIcon />
//                         </IconButton>
//                         {isSupplier && (request.status || '').toLowerCase() === 'pending' && (
//                           <Button
//                             size="small"
//                             variant="contained"
//                             sx={{ ml: 1 }}
//                             onClick={() => {
//                               setSelectedRequest(request);
//                               setModalOpen(true);
//                             }}
//                           >
//                             Respond
//                           </Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       {/* Create Request Dialog (Customer side only) */}
//       <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Create New Request</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Supplier</InputLabel>
//             <Select
//               label="Supplier"
//               value={newRequest.supplierId}
//               onChange={(e) => setNewRequest({ ...newRequest, supplierId: e.target.value })}
//             >
//               {suppliers.map((supplier) => (
//                 <MenuItem
//                   key={supplier._id || supplier.name || supplier.id}
//                   value={supplier._id || supplier.name || supplier.id}
//                 >
//                   {supplier.companyName || supplier.supplier_name || supplier.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Request Type</InputLabel>
//             <Select
//               label="Request Type"
//               value={newRequest.requestType}
//               onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}
//             >
//               <MenuItem value="land_plot">Land Plot Data</MenuItem>
//               <MenuItem value="product_data">Product Data</MenuItem>
//               <MenuItem value="purchase_order">Purchase Order</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Message"
//             value={newRequest.message}
//             onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleCreateRequest} variant="contained">Create</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Share Plots Dialog */}
//       <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Share Land Plot Data</DialogTitle>
//         <DialogContent>
//           <Alert severity="info" sx={{ mb: 2 }}>
//             Select land plots to share with {selectedRequest?.customer?.companyName || selectedRequest?.customer?.name || 'customer'}
//           </Alert>
//           <List>
//             {availablePlots.map((plot) => (
//               <ListItem key={plot.id}>
//                 <Checkbox
//                   checked={selectedPlots.includes(plot.id)}
//                   onChange={(e) => {
//                     setSelectedPlots((prev) =>
//                       e.target.checked ? [...prev, plot.id] : prev.filter((id) => id !== plot.id)
//                     );
//                   }}
//                 />
//                 <ListItemText
//                   primary={plot.name}
//                   secondary={`${plot.country} - ${plot.commodities.join(', ')}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShareDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={confirmSharePlots}
//             disabled={selectedPlots.length === 0}
//           >
//             Share {selectedPlots.length} Plot(s)
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Respond To Request Modal */}
//       <RespondToRequestModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleRespond}
//       />
//     </Box>
//   );
// };

// export default Requests;
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Tab,
//   Tabs,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   Alert,
//   List,
//   ListItem,
//   ListItemText,
//   Checkbox
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Visibility as ViewIcon
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { requestService } from '../services/requestService';
// import { dataService } from '../services/dataService';
// import { toast } from 'react-toastify';
// import RespondToRequestModal from '../components/RespondToRequestModal';

// const Requests = () => {
//   const navigate = useNavigate();
//   const { isSupplier, isCustomer } = useAuth();

//   // Two-type rule: Supplier > Customer; anyone not Supplier is Customer mode
//   const customerMode = !isSupplier;

//   const [tabValue, setTabValue] = useState(0);
//   const [requests, setRequests] = useState([]);        // always keep an array
//   const [loading, setLoading] = useState(true);

//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [suppliers, setSuppliers] = useState([]);

//   const [newRequest, setNewRequest] = useState({
//     supplierId: '',
//     requestType: '',
//     message: '',
//     requestedProducts: []
//   });

//   const [shareDialog, setShareDialog] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedRequest, setSelectedRequest] = useState(null);

//   const [selectedPlots, setSelectedPlots] = useState([]);
//   const [availablePlots] = useState([
//     // Mock data - replace with ERPNext data when ready
//     { id: 'PLOT001', name: 'Coffee Farm Plot A', country: 'Brazil', commodities: ['Coffee'] },
//     { id: 'PLOT002', name: 'Cocoa Farm Plot B', country: 'Ghana', commodities: ['Cocoa'] }
//   ]);

//   // --- Helpers ---------------------------------------------------------------

//   const normalizeParty = (p) => {
//     if (!p) return null;
//     if (typeof p === 'string') return { name: p };
//     if (typeof p === 'object') return p;
//     return null;
//   };

//   // const normalize = (list) => (Array.isArray(list) ? list : []).map((r) => ({
//   //   // id variants (your backend uses `id: 'REQ-00003'`)
//   //   _id: r._id || r.id || r.name || '',
//   //   // parties: accept string or object
//   //   customer: normalizeParty(r.customer || r.customer_info || r.customer_details),
//   //   supplier: normalizeParty(r.supplier || r.supplier_info || r.supplier_details),
//   //   // type + status
//   //   requestType: r.requestType || r.request_type || '',
//   //   status: r.status || 'pending',
//   //   // timestamps
//   //   createdAt: r.createdAt || r.creation || r.modified || null,
//   // }));
// const normalize = (list) => (Array.isArray(list) ? list : []).map((r) => ({
//   _id: r._id || r.id || r.name || '',
//   customer: normalizeParty(r.customer || r.customer_info || r.customer_details),
//   supplier: normalizeParty(r.supplier || r.supplier_info || r.supplier_details),
//   requestType: r.requestType || r.request_type || '',
//   status: r.status || 'pending',
//   createdAt: r.createdAt || r.creation || r.modified || null,
//   responseMessage: r.responseMessage || r.response_message || null,  // <-- NEW
// }));

//   const getStatusColor = (status) => {
//     switch ((status || '').toLowerCase()) {
//       case 'pending': return 'warning';
//       case 'completed': return 'success';
//       case 'rejected': return 'error';
//       default: return 'default';
//     }
//   };

//   const idOf = (req) => (req?._id || req?.id || req?.name || '').toString();
//   const displayDate = (d) => {
//     try { return d ? new Date(d).toLocaleDateString() : '—'; }
//     catch { return '—'; }
//   };

//   // --- Data fetching ---------------------------------------------------------

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       let resp;
//       if (isSupplier) {
//         resp = await requestService.getSupplierRequests();
//       } else {
//         resp = await requestService.getCustomerRequests();
//       }

//       // try multiple shapes safely
//       const raw =
//         resp?.data?.requests ??
//         resp?.requests ??
//         resp?.data ??
//         [];
//       // console.log('[requests raw]', raw);

//       setRequests(normalize(raw));
//     } catch (error) {
//       console.error('Failed to fetch requests:', error);
//       toast.error('Failed to fetch requests');
//       setRequests([]); // keep array to avoid UI crash
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSuppliers = async () => {
//     try {
//       const response = await dataService.getSuppliers();
//       const raw = response?.data?.suppliers ?? response?.suppliers ?? [];
//       setSuppliers(Array.isArray(raw) ? raw : []);
//     } catch (error) {
//       console.error('Failed to fetch suppliers:', error);
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//     if (customerMode) fetchSuppliers(); // anyone not Supplier is considered Customer side
//     // Refetch if supplier status toggles after auth resolves
//   }, [isSupplier]); // customerMode is implied by isSupplier

//   // --- Actions ---------------------------------------------------------------

//   const handleCreateRequest = async () => {
//     // basic validation
//     if (!newRequest.supplierId || !newRequest.requestType) {
//       toast.error('Please select a Supplier and Request Type');
//       return;
//     }
//     try {
//       await requestService.createRequest(newRequest);
//       toast.success('Request created successfully');
//       setCreateDialogOpen(false);
//       setNewRequest({ supplierId: '', requestType: '', message: '', requestedProducts: [] });
//       fetchRequests();
//     } catch (error) {
//       console.error(error);
//       toast.error(error?.response?.data?.message || 'Failed to create request');
//     }
//   };

//   const handleRespondToRequest = async (requestId, action) => {
//     try {
//       await requestService.respondToRequest(requestId, { action });
//       toast.success(`Request ${action}ed successfully`);
//       fetchRequests();
//     } catch (error) {
//       console.error(error);
//       toast.error(`Failed to ${action} request`);
//     }
//   };

//   const handleRespond = async ({ message, status }) => {
//   try {
//     const rid = idOf(selectedRequest);
//     const s = (status || '').toLowerCase();

//     const payload = { message };

//     // Prefer action (accept/reject). The backend now handles many variants,
//     // but this keeps things explicit.
//     if (s === 'accept' || s === 'approved' || s === 'approve') {
//       payload.action = 'accept';
//     } else if (s === 'reject' || s === 'decline' || s === 'declined') {
//       payload.action = 'reject';
//     } else if (s === 'completed' || s === 'rejected') {
//       payload.status = s; // already a final status
//     }

//     const res = await requestService.respondToRequest(rid, payload);

//     // Optimistically update the selected request in-place
//     setRequests((prev) =>
//       prev.map((r) =>
//         idOf(r) === rid
//           ? {
//               ...r,
//               status: res?.status || r.status,
//               responseMessage: res?.response_message ?? res?.responseMessage ?? message ?? r.responseMessage,
//             }
//           : r
//       )
//     );

//     setModalOpen(false);
//     setSelectedRequest(null);
//     // or call fetchRequests() if you prefer refetch over optimistic update
//     // await fetchRequests();
//   } catch (error) {
//     console.error('Failed to respond to request:', error);
//     toast.error(
//       error?.response?.data?._server_messages ||
//       error?.response?.data?.exception ||
//       'Failed to update request'
//     );
//   }
// };


//   const handleSharePlots = (request) => {
//     setSelectedRequest(request);
//     setShareDialog(true);
//     setSelectedPlots([]);
//   };

//   const confirmSharePlots = async () => {
//     try {
//       const rid = idOf(selectedRequest);
//       await requestService.respondToRequest(rid, {
//         action: 'accept',
//         sharedPlots: selectedPlots
//       });
//       toast.success(`Shared ${selectedPlots.length} plot(s) with customer`);
//       setShareDialog(false);
//       fetchRequests();
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to share plots');
//     }
//   };

//   // --- Derived ---------------------------------------------------------------

//   const filteredRequests = (requests ?? []).filter((request) => {
//     if (tabValue === 0) return (request.status || '').toLowerCase() === 'pending';
//     if (tabValue === 1) return (request.status || '').toLowerCase() === 'completed';
//     return true;
//   });

//   // --- Render ----------------------------------------------------------------

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Requests
//         </Typography>
//         {customerMode && (
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => setCreateDialogOpen(true)}
//           >
//             Create New Request
//           </Button>
//         )}
//       </Box>

//       <Paper sx={{ width: '100%', mb: 2 }}>
//         <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
//           <Tab label="Pending" />
//           <Tab label="Completed" />
//           <Tab label="All" />
//         </Tabs>
//       </Paper>

//       <Paper>
//         {filteredRequests.length === 0 ? (
//           <Box p={3}>
//             <Alert severity="info">No requests found.</Alert>
//           </Box>
//         ) : (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Request ID</TableCell>
//                   <TableCell>{isSupplier ? 'Customer' : 'Supplier'}</TableCell>
//                   <TableCell>Type</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Date</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredRequests.map((request) => {
//                   const rid = idOf(request); // show full ID like "REQ-00003"
//                   // Party name now handles string OR object
//                   const customerName =
//                     request.customer?.companyName ||
//                     request.customer?.name ||
//                     (typeof request.customer === 'string' ? request.customer : null);
//                   const supplierName =
//                     request.supplier?.companyName ||
//                     request.supplier?.name ||
//                     (typeof request.supplier === 'string' ? request.supplier : null);

//                   const partyName = isSupplier
//                     ? (customerName || '—')
//                     : (supplierName || '—');

//                   const reqTypeLabel = (request.requestType ?? '')
//                     .toString()
//                     .replace(/_/g, ' ')
//                     .toUpperCase();

//                   return (
//                     <TableRow key={rid || Math.random()}>
//                       {/* ID: don't slice; show exactly as backend returns */}
//                       <TableCell>{rid || '—'}</TableCell>
//                       <TableCell>{partyName}</TableCell>
//                       <TableCell>{reqTypeLabel || '—'}</TableCell>
//                       <TableCell>
//                         <Chip
//                           label={request.status || '—'}
//                           color={getStatusColor(request.status)}
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell>{displayDate(request.createdAt)}</TableCell>
//                       <TableCell>
//                         <IconButton
//                           size="small"
//                           onClick={() => navigate(`/requests/${rid}`)}
//                         >
//                           <ViewIcon />
//                         </IconButton>
//                         {isSupplier && (request.status || '').toLowerCase() === 'pending' && (
//                           <Button
//                             size="small"
//                             variant="contained"
//                             sx={{ ml: 1 }}
//                             onClick={() => {
//                               setSelectedRequest(request);
//                               setModalOpen(true);
//                             }}
//                           >
//                             Respond
//                           </Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       {/* Create Request Dialog (Customer side only) */}
//       <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Create New Request</DialogTitle>
//         <DialogContent>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Supplier</InputLabel>
//             <Select
//               label="Supplier"
//               value={newRequest.supplierId}
//               onChange={(e) => setNewRequest({ ...newRequest, supplierId: e.target.value })}
//             >
//               {suppliers.map((supplier) => (
//                 <MenuItem
//                   key={supplier._id || supplier.name || supplier.id}
//                   value={supplier._id || supplier.name || supplier.id}
//                 >
//                   {supplier.companyName || supplier.supplier_name || supplier.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Request Type</InputLabel>
//             <Select
//               label="Request Type"
//               value={newRequest.requestType}
//               onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}
//             >
//               <MenuItem value="land_plot">Land Plot Data</MenuItem>
//               <MenuItem value="product_data">Product Data</MenuItem>
//               <MenuItem value="purchase_order">Purchase Order</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Message"
//             value={newRequest.message}
//             onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
//             margin="normal"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleCreateRequest} variant="contained">Create</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Share Plots Dialog */}
//       <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Share Land Plot Data</DialogTitle>
//         <DialogContent>
//           <Alert severity="info" sx={{ mb: 2 }}>
//             Select land plots to share with {selectedRequest?.customer?.companyName || selectedRequest?.customer?.name || (typeof selectedRequest?.customer === 'string' ? selectedRequest.customer : 'customer')}
//           </Alert>
//           <List>
//             {availablePlots.map((plot) => (
//               <ListItem key={plot.id}>
//                 <Checkbox
//                   checked={selectedPlots.includes(plot.id)}
//                   onChange={(e) => {
//                     setSelectedPlots((prev) =>
//                       e.target.checked ? [...prev, plot.id] : prev.filter((id) => id !== plot.id)
//                     );
//                   }}
//                 />
//                 <ListItemText
//                   primary={plot.name}
//                   secondary={`${plot.country} - ${plot.commodities.join(', ')}`}
//                 />
//               </ListItem>
//             ))}
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShareDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={confirmSharePlots}
//             disabled={selectedPlots.length === 0}
//           >
//             Share {selectedPlots.length} Plot(s)
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Respond To Request Modal */}
//       <RespondToRequestModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={handleRespond}
//       />
//     </Box>
//   );
// };

// export default Requests;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';
import { dataService } from '../services/dataService';
import { toast } from 'react-toastify';
import RespondToRequestModal from '../components/RespondToRequestModal';

const Requests = () => {
  const navigate = useNavigate();
  const { isSupplier, isCustomer } = useAuth();

  // Two-type rule: Supplier > Customer; anyone not Supplier is Customer mode
  const customerMode = !isSupplier;

  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState([]); // always keep an array
  const [loading, setLoading] = useState(true);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  const [newRequest, setNewRequest] = useState({
    supplierId: '',
    requestType: '',
    message: '',
    requestedProducts: []
  });

  const [shareDialog, setShareDialog] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [selectedPlots, setSelectedPlots] = useState([]);
  const [availablePlots] = useState([
    // Mock data - replace with ERPNext data when ready
    { id: 'PLOT001', name: 'Coffee Farm Plot A', country: 'Brazil', commodities: ['Coffee'] },
    { id: 'PLOT002', name: 'Cocoa Farm Plot B', country: 'Ghana', commodities: ['Cocoa'] }
  ]);

  // ---------- Helpers ----------

  const debug = (...args) => {
    if (import.meta?.env?.DEV) {
      console.log('%c[Requests]', 'color:#7c3aed;font-weight:600', ...args);
    } else {
      console.log('[Requests]', ...args);
    }
  };

  const normalizeParty = (p) => {
    if (!p) return null;
    if (typeof p === 'string') return { name: p };
    if (typeof p === 'object') return p;
    return null;
  };

  const normalize = (list) => (Array.isArray(list) ? list : []).map((r) => ({
    _id: r._id || r.id || r.name || '',
    customer: normalizeParty(r.customer || r.customer_info || r.customer_details),
    supplier: normalizeParty(r.supplier || r.supplier_info || r.supplier_details),
    requestType: r.requestType || r.request_type || '',
    status: r.status || 'Pending',
    createdAt:
      r.createdAt ||
      r.creation ||
      r.created_on ||
      r.created_at ||
      r.posting_date ||
      r.modified ||
      null,
    responseMessage: r.responseMessage || r.response_message || null,
  }));

  const asKey = (s) => (s || '').toLowerCase();

  const isCompletedStatus = (s) => {
    const k = asKey(s);
    return k === 'completed' || k === 'accepted' || k === 'approved' || k === 'done';
  };

  const getStatusColor = (status) => {
    const k = asKey(status);
    if (k === 'pending') return 'warning';
    if (k === 'rejected' || k === 'declined') return 'error';
    if (isCompletedStatus(k)) return 'success';
    return 'default';
  };

  const idOf = (req) => (req?._id || req?.id || req?.name || '').toString();

  const displayDate = (d) => {
    try { return d ? new Date(d).toLocaleDateString() : '—'; }
    catch { return '—'; }
  };

  // ---------- Data fetching ----------

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let resp;
      if (isSupplier) {
        resp = await requestService.getSupplierRequests();
      } else {
        resp = await requestService.getCustomerRequests();
      }

      const raw =
        resp?.data?.requests ??
        resp?.requests ??
        resp?.data ??
        [];

      const norm = normalize(raw);
      setRequests(norm);

      // Console summary
      const counts = norm.reduce((a, r) => {
        const k = asKey(r.status);
        a[k] = (a[k] || 0) + 1;
        return a;
      }, {});
      console.table(norm.map(r => ({ id: idOf(r), status: r.status, type: r.requestType })));
      debug('Fetched requests', { total: norm.length, counts });
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to fetch requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await dataService.getSuppliers();
      const raw = response?.data?.suppliers ?? response?.suppliers ?? [];
      setSuppliers(Array.isArray(raw) ? raw : []);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
    if (customerMode) fetchSuppliers(); // anyone not Supplier is considered Customer side
  }, [isSupplier]); // customerMode is implied by isSupplier

  // ---------- Actions ----------

  const handleCreateRequest = async () => {
    if (!newRequest.supplierId || !newRequest.requestType) {
      toast.error('Please select a Supplier and Request Type');
      return;
    }
    try {
      await requestService.createRequest(newRequest);
      toast.success('Request created successfully');
      setCreateDialogOpen(false);
      setNewRequest({ supplierId: '', requestType: '', message: '', requestedProducts: [] });
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to create request');
    }
  };

  const handleRespondToRequest = async (requestId, action) => {
    try {
      await requestService.respondToRequest(requestId, { action });
      toast.success(`Request ${action}ed successfully`);
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${action} request`);
    }
  };

  const handleRespond = async ({ message, status }) => {
    try {
      const rid = idOf(selectedRequest);
      const k = asKey(status);
      const payload = { message };

      // Accept / Reject synonyms
      const ACCEPT = new Set(['accept', 'accepted', 'approve', 'approved', 'ok', 'yes', 'y', 'complete', 'completed', 'done']);
      const REJECT = new Set(['reject', 'rejected', 'decline', 'declined', 'no', 'n']);

      if (ACCEPT.has(k)) {
        // keep explicit action; backend maps to Completed
        payload.action = 'accept';
      } else if (REJECT.has(k)) {
        payload.action = 'reject';
      } else if (k) {
        // fallback: pass raw status (e.g., 'pending')
        payload.status = k;
      }

      debug('Respond: start', { id: rid, from: selectedRequest.status, inputStatus: status, payload });

      const res = await requestService.respondToRequest(rid, payload);
      debug('Respond: server result', res);

      const newStatus =
        res?.status ||
        (payload.action === 'accept'
          ? 'Completed'
          : payload.action === 'reject'
          ? 'Rejected'
          : (payload.status || selectedRequest.status));

      const newMsg =
        res?.response_message ??
        res?.responseMessage ??
        message ??
        selectedRequest.responseMessage;

      console.log(`Request ${rid}: ${selectedRequest.status} -> ${newStatus}`);
      if (newMsg) console.log(`Request ${rid}: response message =`, newMsg);

      // Optimistic update
      setRequests((prev) =>
        prev.map((r) => (idOf(r) === rid ? { ...r, status: newStatus, responseMessage: newMsg } : r))
      );

      setModalOpen(false);
      setSelectedRequest(null);
      // If you prefer server truth over optimistic:
      // await fetchRequests();
    } catch (error) {
      console.error('Respond: error', error);
      toast.error(
        error?.response?.data?._server_messages ||
        error?.response?.data?.exception ||
        'Failed to update request'
      );
    }
  };

  const handleSharePlots = (request) => {
    setSelectedRequest(request);
    setShareDialog(true);
    setSelectedPlots([]);
  };

  const confirmSharePlots = async () => {
    try {
      const rid = idOf(selectedRequest);
      debug('Share plots: start', { id: rid, plots: selectedPlots });
      await requestService.respondToRequest(rid, {
        action: 'accept',
        sharedPlots: selectedPlots
      });
      debug('Share plots: done', { id: rid, count: selectedPlots.length });
      toast.success(`Shared ${selectedPlots.length} plot(s) with customer`);
      setShareDialog(false);
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error('Failed to share plots');
    }
  };

  // ---------- Derived ----------

  const filteredRequests = (requests ?? []).filter((r) => {
    const k = asKey(r.status);
    if (tabValue === 0) return k === 'pending';
    if (tabValue === 1) return isCompletedStatus(k);
    return true;
  });

  // ---------- Render ----------

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Requests
        </Typography>
        {customerMode && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create New Request
          </Button>
        )}
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Pending" />
          <Tab label="Completed" />
          <Tab label="All" />
        </Tabs>
      </Paper>

      <Paper>
        {filteredRequests.length === 0 ? (
          <Box p={3}>
            <Alert severity="info">No requests found.</Alert>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>{isSupplier ? 'Customer' : 'Supplier'}</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => {
                  const rid = idOf(request); // show full ID like "REQ-00003"
                  const customerName =
                    request.customer?.companyName ||
                    request.customer?.name ||
                    (typeof request.customer === 'string' ? request.customer : null);
                  const supplierName =
                    request.supplier?.companyName ||
                    request.supplier?.name ||
                    (typeof request.supplier === 'string' ? request.supplier : null);

                  const partyName = isSupplier ? (customerName || '—') : (supplierName || '—');

                  const reqTypeLabel = (request.requestType ?? '')
                    .toString()
                    .replace(/_/g, ' ')
                    .toUpperCase();

                  return (
                    <TableRow key={rid || Math.random()}>
                      <TableCell>{rid || '—'}</TableCell>
                      <TableCell>{partyName}</TableCell>
                      <TableCell>{reqTypeLabel || '—'}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.status || '—'}
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{displayDate(request.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/requests/${rid}`)}
                        >
                          <ViewIcon />
                        </IconButton>
                        {isSupplier && asKey(request.status) === 'pending' && (
                          <Button
                            size="small"
                            variant="contained"
                            sx={{ ml: 1 }}
                            onClick={() => {
                              debug('Open Respond modal', { id: rid, currentStatus: request.status });
                              setSelectedRequest(request);
                              setModalOpen(true);
                            }}
                          >
                            Respond
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create Request Dialog (Customer side only) */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Request</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Supplier</InputLabel>
            <Select
              label="Supplier"
              value={newRequest.supplierId}
              onChange={(e) => setNewRequest({ ...newRequest, supplierId: e.target.value })}
            >
              {suppliers.map((supplier) => (
                <MenuItem
                  key={supplier._id || supplier.name || supplier.id}
                  value={supplier._id || supplier.name || supplier.id}
                >
                  {supplier.companyName || supplier.supplier_name || supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Request Type</InputLabel>
            <Select
              label="Request Type"
              value={newRequest.requestType}
              onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}
            >
              <MenuItem value="land_plot">Land Plot Data</MenuItem>
              <MenuItem value="product_data">Product Data</MenuItem>
              <MenuItem value="purchase_order">Purchase Order</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={newRequest.message}
            onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateRequest} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Share Plots Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Share Land Plot Data</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Select land plots to share with {selectedRequest?.customer?.companyName || selectedRequest?.customer?.name || (typeof selectedRequest?.customer === 'string' ? selectedRequest.customer : 'customer')}
          </Alert>
          <List>
            {availablePlots.map((plot) => (
              <ListItem key={plot.id}>
                <Checkbox
                  checked={selectedPlots.includes(plot.id)}
                  onChange={(e) => {
                    setSelectedPlots((prev) =>
                      e.target.checked ? [...prev, plot.id] : prev.filter((id) => id !== plot.id)
                    );
                  }}
                />
                <ListItemText
                  primary={plot.name}
                  secondary={`${plot.country} - ${plot.commodities.join(', ')}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={confirmSharePlots}
            disabled={selectedPlots.length === 0}
          >
            Share {selectedPlots.length} Plot(s)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Respond To Request Modal */}
      <RespondToRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRespond}
      />
    </Box>
  );
};

export default Requests;
