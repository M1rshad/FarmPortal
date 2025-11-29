import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField, Fade, 
  CircularProgress, useTheme, alpha
} from '@mui/material';
import { 
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, 
  Refresh as RefreshIcon, Cloud as CloudIcon, Logout as LogoutIcon
} from '@mui/icons-material';
import { db, auth } from '../config/firebase'; // Import auth
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; // Import signOut
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', code: '', url: '' });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "tenants"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTenants(list);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      toast.error("Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code || !formData.url) return toast.warning("All fields required");

    try {
      const payload = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        url: formData.url
      };

      if (editingTenant) {
        await updateDoc(doc(db, "tenants", editingTenant.id), payload);
        toast.success("Updated successfully");
      } else {
        await addDoc(collection(db, "tenants"), payload);
        toast.success("Added successfully");
      }
      
      setDialogOpen(false);
      resetForm();
      fetchTenants();
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tenant?")) return;
    try {
      await deleteDoc(doc(db, "tenants", id));
      toast.success("Deleted");
      fetchTenants();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const openEdit = (tenant) => {
    setEditingTenant(tenant);
    setFormData({ name: tenant.name, code: tenant.code, url: tenant.url });
    setDialogOpen(true);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTenant(null);
    setFormData({ name: '', code: '', url: '' });
  };

  return (
    <Fade in={true}>
      <Box 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: '#f8f9fa', 
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* CONTAINER to constrain width */}
        <Box width="100%" maxWidth="lg">
          
          {/* HEADER */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, mb: 3, borderRadius: 3, 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: '1px solid', borderColor: 'divider'
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#1565C0' }}>
                Tenant Manager
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage SaaS Workspaces
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Button startIcon={<RefreshIcon />} onClick={fetchTenants} size="small">Refresh</Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={openAdd} 
                sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
              >
                Add Tenant
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<LogoutIcon />} 
                onClick={handleLogout}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Logout
              </Button>
            </Box>
          </Paper>

          {/* TABLE */}
          <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <TableContainer>
              <Table size="small"> {/* Compact Table */}
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, py: 2, pl: 3 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700, py: 2 }}>Backend URL</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, py: 2, pr: 3 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6 }}><CircularProgress size={30} /></TableCell></TableRow>
                  ) : tenants.length === 0 ? (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>No tenants found.</TableCell></TableRow>
                  ) : (
                    tenants.map((tenant) => (
                      <TableRow key={tenant.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ pl: 3, fontWeight: 500 }}>{tenant.name}</TableCell>
                        <TableCell>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              bgcolor: 'primary.main', color: 'white', 
                              px: 1, py: 0.5, borderRadius: 1, fontWeight: 700 
                            }}
                          >
                            {tenant.code}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
                          {tenant.url}
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 2 }}>
                          <IconButton size="small" onClick={() => openEdit(tenant)} color="primary"><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(tenant.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* DIALOG */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            {editingTenant ? 'Edit Tenant' : 'New Tenant'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2.5} mt={1}>
              <TextField 
                label="Company Name" size="small" fullWidth 
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <TextField 
                label="Company Code" size="small" fullWidth 
                value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                helperText="Uppercase login code (e.g. ACME)"
              />
              <TextField 
                label="Backend URL" size="small" fullWidth 
                value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})}
                InputProps={{ startAdornment: <CloudIcon color="action" sx={{ mr: 1, fontSize: 20 }} /> }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
            <Button variant="contained" onClick={handleSave} disableElevation>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default AdminDashboard;
