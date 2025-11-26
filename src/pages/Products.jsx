// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Alert
// } from '@mui/material';
// import { Sync as SyncIcon } from '@mui/icons-material';
// import { dataService } from '../services/dataService';
// import { toast } from 'react-toastify';

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [syncing, setSyncing] = useState(false);

//   const handleSync = async () => {
//   try {
//     setSyncing(true);
//     const { data: items, message, meta } = await dataService.syncProducts();
//     setProducts(items || []);
//     // if you need paging later: meta?.next_start
//   } catch (error) {
//     toast.error(error?.response?.data?.message || 'Failed to sync products from ERPNext');
//   } finally {
//     setSyncing(false);
//   }
// };


//   useEffect(() => {
//     // load once on mount
//     handleSync();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Products
//         </Typography>

//         {/* <Button
//           variant="contained"
//           startIcon={<SyncIcon />}
//           onClick={handleSync}
//           disabled={syncing}
//         >
//           {syncing ? 'Syncing...' : 'Sync from ERPNext'}
//         </Button> */}
//       </Box>

//       {products.length === 0 && (
//         <Alert severity="info" sx={{ mb: 3 }}>
//           No products found. Click "Sync from ERPNext" to import your product data from Item doctype.
//         </Alert>
//       )}

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Product Code</TableCell>
//               <TableCell>Product Name</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Unit</TableCell>
//               <TableCell>Batches</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {products.map((product) => (
//               <TableRow key={product.item_code || product.name}>
//                 <TableCell>{product.item_code}</TableCell>
//                 <TableCell>{product.item_name}</TableCell>
//                 <TableCell>
//                   <Chip label={product.item_group} size="small" color="primary" />
//                 </TableCell>
//                 <TableCell>{product.stock_uom}</TableCell>
//                 <TableCell>{product.batches?.length || 0}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default Products;
import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Alert, Fade, CircularProgress,
  useTheme, alpha
} from '@mui/material';
import { Sync as SyncIcon, Inventory as ProductIcon } from '@mui/icons-material';
import { dataService } from '../services/dataService';
import { toast } from 'react-toastify';

const Products = () => {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [syncing, setSyncing] = useState(true); // Start true for initial load

  const handleSync = async () => {
    try {
      setSyncing(true);
      // Assuming response structure: { data: [...], message, meta }
      const { data: items } = await dataService.syncProducts();
      setProducts(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync products');
      setProducts([]);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    handleSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              Products
            </Typography>
            <Typography color="text.secondary">Manage your product catalog and batches.</Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={syncing ? <CircularProgress size={20} /> : <SyncIcon />}
            onClick={handleSync}
            disabled={syncing}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            {syncing ? 'Syncing...' : 'Refresh Data'}
          </Button>
        </Box>

        {/* --- TABLE --- */}
        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'background.neutral' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, pl: 4 }}>Product Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, pr: 4 }}>Batches</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.item_code || product.name} hover>
                    <TableCell sx={{ pl: 4, fontWeight: 500 }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <ProductIcon fontSize="small" color="action" />
                        {product.item_code}
                      </Box>
                    </TableCell>
                    <TableCell>{product.item_name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={product.item_group} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha(theme.palette.primary.main, 0.1), 
                          color: 'primary.main', 
                          fontWeight: 600, 
                          borderRadius: 1 
                        }} 
                      />
                    </TableCell>
                    <TableCell>{product.stock_uom}</TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <Chip 
                        label={product.batches?.length || 0} 
                        size="small" 
                        variant="outlined" 
                        sx={{ minWidth: 40, fontWeight: 600 }} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
                
                {!syncing && products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Typography variant="subtitle1" fontWeight={600} color="text.secondary" gutterBottom>
                        No products found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click "Refresh Data" to import from ERPNext.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Products;
