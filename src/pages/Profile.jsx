import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Grid, Fade,
  useTheme, alpha, Avatar, Divider, CircularProgress
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const emptyProfile = {
  companyName: '',
  contactPerson: { name: '', phone: '', position: '' },
  address: { street: '', city: '', postalCode: '', state: '' },
};

// Helper for section headers
const SectionHeader = ({ icon, title, theme }) => (
  <Box display="flex" alignItems="center" gap={2} mb={3}>
    <Avatar 
      variant="rounded" 
      sx={{ 
        bgcolor: alpha(theme.palette.primary.main, 0.1), 
        color: 'primary.main',
        borderRadius: 2
      }}
    >
      {icon}
    </Avatar>
    <Typography variant="h6" fontWeight={700}>
      {title}
    </Typography>
  </Box>
);

const Profile = () => {
  const theme = useTheme();
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState(user?.profile || emptyProfile);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // LOAD from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await authService.getAppProfile();
        setFormData(data && Object.keys(data).length ? data : emptyProfile);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // SAVE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      toast.success('Profile updated successfully');
      await refreshUser();
      const fresh = await authService.getAppProfile();
      setFormData(fresh || emptyProfile);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={true}>
      <Box>
        {/* --- HEADER --- */}
        <Box sx={{ mb: 4 }}>
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
            Profile Settings
          </Typography>
          <Typography color="text.secondary">
            Manage your company details and contact information.
          </Typography>
        </Box>

        {/* --- FORM CONTAINER --- */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            border: '1px solid', 
            borderColor: 'divider' 
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              
              {/* SECTION 1: Company Information */}
              <Grid item xs={12}>
                <SectionHeader 
                  icon={<BusinessIcon />} 
                  title="Company Information" 
                  theme={theme} 
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={formData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* SECTION 2: Contact Person */}
              <Grid item xs={12}>
                <SectionHeader 
                  icon={<PersonIcon />} 
                  title="Contact Person" 
                  theme={theme} 
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={formData.contactPerson.name}
                      onChange={(e) => handleChange('contactPerson.name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.contactPerson.phone}
                      onChange={(e) => handleChange('contactPerson.phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Job Title / Position"
                      value={formData.contactPerson.position}
                      onChange={(e) => handleChange('contactPerson.position', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}><Divider /></Grid>

              {/* SECTION 3: Address */}
              <Grid item xs={12}>
                <SectionHeader 
                  icon={<LocationIcon />} 
                  title="Address" 
                  theme={theme} 
                />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={formData.address.street}
                      onChange={(e) => handleChange('address.street', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.address.city}
                      onChange={(e) => handleChange('address.city', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="State / Province"
                      value={formData.address.state}
                      onChange={(e) => handleChange('address.state', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Postal / Zip Code"
                      value={formData.address.postalCode}
                      onChange={(e) => handleChange('address.postalCode', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* SUBMIT ACTION */}
              <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    borderRadius: 2, 
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  {loading ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </Grid>

            </Grid>
          </form>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Profile;
