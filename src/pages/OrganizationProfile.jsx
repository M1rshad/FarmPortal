import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';

const OrganizationProfile = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [generalInfo, setGeneralInfo] = useState({
    organizationName: '',
    companyAddress: '',
    phone: '',
    country: '',
    website: '',
    postalCode: '',
    operatorType: ''
  });
  const [certification, setCertification] = useState({
    certificateFile: null,
    validFrom: '',
    validTo: '',
    evidenceType: ''
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleGeneralInfoChange = (field, value) => {
    setGeneralInfo({ ...generalInfo, [field]: value });
  };

  const handleCertificationChange = (field, value) => {
    setCertification({ ...certification, [field]: value });
  };

  const handleFileUpload = (event) => {
    setCertification({ ...certification, certificateFile: event.target.files[0] });
  };

  const handleSave = () => {
    if (tabIndex === 0) {
      toast.success('General Information saved successfully!');
    } else {
      toast.success('Certification details saved successfully!');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Organization Profile
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="General Information" />
          <Tab label="Certification" />
        </Tabs>

        {tabIndex === 0 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  value={generalInfo.organizationName}
                  onChange={(e) => handleGeneralInfoChange('organizationName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Address"
                  value={generalInfo.companyAddress}
                  onChange={(e) => handleGeneralInfoChange('companyAddress', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={generalInfo.phone}
                  onChange={(e) => handleGeneralInfoChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={generalInfo.country}
                  onChange={(e) => handleGeneralInfoChange('country', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={generalInfo.website}
                  onChange={(e) => handleGeneralInfoChange('website', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={generalInfo.postalCode}
                  onChange={(e) => handleGeneralInfoChange('postalCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Operator Type"
                  value={generalInfo.operatorType}
                  onChange={(e) => handleGeneralInfoChange('operatorType', e.target.value)}
                >
                  <MenuItem value="EU Operator">EU Operator</MenuItem>
                  <MenuItem value="Non-EU Operator">Non-EU Operator</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{ mt: 2 }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Certificate Name"
                  value={certification.certificateName || ''}
                  onChange={(e) => handleCertificationChange('certificateName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Type of Evidence"
                  value={certification.evidenceType}
                  onChange={(e) => handleCertificationChange('evidenceType', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valid From"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={certification.validFrom}
                  onChange={(e) => handleCertificationChange('validFrom', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Valid To"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={certification.validTo}
                  onChange={(e) => handleCertificationChange('validTo', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ mb: 2 }}
                >
                  Upload Certificate
                  <input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{ mt: 2 }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default OrganizationProfile;