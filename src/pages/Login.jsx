// import React, { useState } from 'react';
// import { 
//   Container, 
//   Paper, 
//   TextField, 
//   Button, 
//   Typography, 
//   Box, 
//   Link,
//   Alert,
//   InputAdornment,
//   IconButton
// } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { useNavigate, Link as RouterLink } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError('');
//   try {
//     console.log('[login] submitting…');
//     const result = await login(formData.email, formData.password);
//     console.log('[login] result:', result);

//     if (result.success) {
//       navigate('/');
//     } else {
//       setError(result.error || 'Login failed');
//     }
//   } catch (err) {
//     console.error('[login] unexpected error:', err);
//     setError('Network error during login');
//   } finally {
//     setLoading(false); // <- always runs, even if API rejects / times out
//   }
// };


//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//         }}
//       >
//         <Typography variant="h3" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
//           FarmPortal
//         </Typography>
//         <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
//           EUDR Compliance Platform
//         </Typography>
        
//         <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
//           <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
//             Sign in
//           </Typography>
          
//           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
//           <Box component="form" onSubmit={handleSubmit}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               autoComplete="current-password"
//               value={formData.password}
//               onChange={handleChange}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowPassword(!showPassword)}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={loading}
//             >
//               {loading ? 'Signing in...' : 'Sign In'}
//             </Button>
//             <Box sx={{ textAlign: 'center' }}>
//               <Link component={RouterLink} to="/register" variant="body2">
//                 Don't have an account? Sign Up
//               </Link>
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, InputAdornment, 
  CircularProgress, Alert, Fade, alpha, Avatar, IconButton
} from '@mui/material';
import { 
  Business as BusinessIcon, 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Handshake as TradeIcon,
  ArrowForward as ArrowForwardIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ companyCode: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (prop) => (event) => setFormData({ ...formData, [prop]: event.target.value });
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.companyCode, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
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
      sx={{ bgcolor: '#F9FAFB', px: 2 }}
    >
      <Fade in={true} timeout={800}>
        <Box width="100%" maxWidth={420}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 5, 
              borderRadius: 4,
              bgcolor: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
              // Stronger, deeper shadow
              boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18), 0 4px 20px -5px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            {/* BRANDING */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
              <Avatar 
                sx={{ 
                  bgcolor: '#2E7D32', width: 60, height: 60, mb: 2,
                  boxShadow: '0 8px 24px rgba(46, 125, 50, 0.25)'
                }}
              >
                <TradeIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight={800} sx={{ color: '#1B5E20', letterSpacing: '-0.5px' }}>
                FarmPortal
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5} fontWeight={500}>
                Global Trade & Compliance
              </Typography>
            </Box>

            {/* ERROR */}
            {error && (
              <Fade in={true}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              {/* 1. EMAIL */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                margin="normal"
                required
                placeholder="name@company.com"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />

              {/* 2. PASSWORD */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange('password')}
                margin="normal"
                required
                placeholder="••••••••"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 3 }}
              />

              {/* 3. COMPANY CODE */}
              <TextField
                fullWidth
                label="Company Code"
                value={formData.companyCode}
                onChange={handleChange('companyCode')}
                margin="normal"
                required
                placeholder="e.g. ALPHA"
                helperText="Enter your organization's unique code"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><BusinessIcon color="action" /></InputAdornment>,
                }}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': { backgroundColor: alpha('#2E7D32', 0.04) },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2E7D32' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#2E7D32' },
                  '& .MuiFormHelperText-root': { textAlign: 'center', mt: 1 }
                }}
              />

              {/* SUBMIT */}
              <Button 
                fullWidth 
                variant="contained" 
                size="large" 
                type="submit" 
                disabled={loading}
                endIcon={!loading && <ArrowForwardIcon />}
                sx={{ 
                  py: 1.8, fontWeight: 700, borderRadius: 3, fontSize: '1rem', textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(46, 125, 50, 0.3)',
                  bgcolor: '#2E7D32',
                  '&:hover': { bgcolor: '#1B5E20', boxShadow: '0 12px 24px rgba(46, 125, 50, 0.4)' }
                }}
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : 'Sign In'}
              </Button>
            </form>
          </Paper>
          
          {/* FOOTER */}
          <Box mt={4} textAlign="center">
            <Typography variant="caption" sx={{ color: '#37474F', fontWeight: 600, opacity: 0.7 }}>
              © 2025 FarmPortal Ecosystems. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Login;
