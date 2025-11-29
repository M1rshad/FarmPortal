import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, Alert, CircularProgress, 
  InputAdornment, IconButton, Avatar 
} from '@mui/material';
import { 
  Email as EmailIcon, // Changed from Lock to Email
  Lock as LockIcon, 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      sx={{ bgcolor: '#F5F5F5' }}
    >
      <Paper elevation={0} sx={{ p: 5, width: 380, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
        <Box textAlign="center" mb={4}>
          <Avatar sx={{ bgcolor: '#2E7D32', width: 56, height: 56, mx: 'auto', mb: 2 }}>
            <AdminIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#1B5E20' }}>
            Super Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            System Configuration Access
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          {/* EMAIL FIELD */}
          <TextField
            fullWidth
            label="Admin Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
            }}
          />
          
          {/* PASSWORD FIELD */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button 
            fullWidth 
            variant="contained" 
            type="submit" 
            disabled={loading}
            sx={{ 
              mt: 4, py: 1.5, fontWeight: 700, borderRadius: 2,
              bgcolor: '#2E7D32',
              '&:hover': { bgcolor: '#1B5E20' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Authenticate'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
