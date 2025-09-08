import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const emptyProfile = {
  companyName: '',
  contactPerson: { name: '', phone: '', position: '' },
  address: { street: '', city: '', postalCode: '', state: '' },
};

const Profile = () => {
  // get both user and refreshUser in one call
  const { user, refreshUser } = useAuth();

  // seed from user.profile if present
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
        const data = await authService.getAppProfile(); // <-- renamed
        setFormData(data && Object.keys(data).length ? data : emptyProfile);
      } catch (e) {
        console.error(e);
        // optional: toast.error('Failed to load profile');
      }
    })();
  }, []);

  // SAVE then refresh context and reload local form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      toast.success('Profile updated successfully');

      // refresh global me (so user.profile stays in sync)
      await refreshUser();

      // re-fetch the profile object for this page
      const fresh = await authService.getAppProfile(); // <-- renamed
      setFormData(fresh || emptyProfile);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Profile Settings
      </Typography>

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Company Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </Grid>

            {/* Contact Person */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Contact Person
              </Typography>
            </Grid>
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
                label="Phone"
                value={formData.contactPerson.phone}
                onChange={(e) => handleChange('contactPerson.phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Position"
                value={formData.contactPerson.position}
                onChange={(e) => handleChange('contactPerson.position', e.target.value)}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Address
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street"
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
                label="State"
                value={formData.address.state}
                onChange={(e) => handleChange('address.state', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Postal Code"
                value={formData.address.postalCode}
                onChange={(e) => handleChange('address.postalCode', e.target.value)}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile;
