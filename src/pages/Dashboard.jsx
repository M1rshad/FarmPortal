// import React, { useState, useEffect } from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Button,
//   Paper,
//   LinearProgress,
//   Chip
// } from '@mui/material';
// import {
//   TrendingUp,
//   Assignment,
//   CheckCircle,
//   Warning,
//   Landscape,
//   Inventory
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { requestService } from '../services/requestService';

// // const Dashboard = () => {
// //   const navigate = useNavigate();
// //   const { user, isSupplier, isCustomer } = useAuth();
// //   const [stats, setStats] = useState({
// //     totalRequests: 0,
// //     pendingRequests: 0,
// //     completedRequests: 0,
// //     landPlots: 0,
// //     products: 0
// //   });
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchDashboardData();
// //   }, []);

// //   const fetchDashboardData = async () => {
// //     try {
// //       if (isSupplier) {
// //         const response = await requestService.getSupplierRequests();
// //         const requests = response.data.requests;
// //         setStats({
// //           totalRequests: requests.length,
// //           pendingRequests: requests.filter(r => r.status === 'pending').length,
// //           completedRequests: requests.filter(r => r.status === 'completed').length,
// //           landPlots: 0,
// //           products: 0
// //         });
// //       } else {
// //         const response = await requestService.getCustomerRequests();
// //         const requests = response.data.requests;
// //         setStats({
// //           totalRequests: requests.length,
// //           pendingRequests: requests.filter(r => r.status === 'pending').length,
// //           completedRequests: requests.filter(r => r.status === 'completed').length,
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Failed to fetch dashboard data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { user, isSupplier, isCustomer, loading: authLoading } = useAuth();

//   const [stats, setStats] = useState({
//     totalRequests: 0,
//     pendingRequests: 0,
//     completedRequests: 0,
//     landPlots: 0,
//     products: 0
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Wait until auth finishes so isSupplier/isCustomer are stable
//     if (!authLoading) {
//       fetchDashboardData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [authLoading, isSupplier, isCustomer]);

//   const extractItems = (res) => {
//     // Support both {message:{items:[]}} and {items:[]}
//     return res?.data?.message?.items ?? res?.data?.items ?? [];
//   };

//   const computeStats = (requests) => {
//     const total = requests.length;
//     const pending = requests.filter(r => (r.status || '').toLowerCase() === 'pending').length;
//     const completed = requests.filter(r => (r.status || '').toLowerCase() === 'completed').length;
//     return { totalRequests: total, pendingRequests: pending, completedRequests: completed };
//   };

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       let items = [];
//       if (isSupplier) {
//         const resp = await requestService.getSupplierRequests();
//         items = extractItems(resp);
//         setStats(s => ({
//           ...s,
//           ...computeStats(items),
//           // you can populate these from real doctypes later
//           landPlots: s.landPlots ?? 0,
//           products: s.products ?? 0,
//         }));
//       } else {
//         const resp = await requestService.getCustomerRequests();
//         items = extractItems(resp);
//         setStats(s => ({
//           ...s,
//           ...computeStats(items),
//         }));
//       }
//     } catch (error) {
//       console.error('Failed to fetch dashboard data:', error);
//       setStats(s => ({ ...s, totalRequests: 0, pendingRequests: 0, completedRequests: 0 }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const displayName =
//     user?.full_name ||
//     user?.employee?.employee_name ||
//     user?.email ||
//     'User';

//   if (authLoading || loading) {
//     return <LinearProgress />;
//   }

//   const StatCard = ({ title, value, icon, color }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
//           <Box>
//             <Typography color="text.secondary" gutterBottom>
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div">
//               {value}
//             </Typography>
//           </Box>
//           <Box sx={{ 
//             backgroundColor: `${color}.light`, 
//             borderRadius: 2, 
//             p: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   if (loading) {
//     return <LinearProgress />;
//   }

//   return (
//     <Box>
//       <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
//         Welcome back, {displayName}!
//       </Typography>

//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             title="Total Requests"
//             value={stats.totalRequests}
//             icon={<Assignment sx={{ color: 'primary.main' }} />}
//             color="primary"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             title="Pending Requests"
//             value={stats.pendingRequests}
//             icon={<Warning sx={{ color: 'warning.main' }} />}
//             color="warning"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             title="Completed Requests"
//             value={stats.completedRequests}
//             icon={<CheckCircle sx={{ color: 'success.main' }} />}
//             color="success"
//           />
//         </Grid>
//         {isSupplier && (
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               title="Compliance Rate"
//               value="95%"
//               icon={<TrendingUp sx={{ color: 'info.main' }} />}
//               color="info"
//             />
//           </Grid>
//         )}
//       </Grid>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={8}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Quick Actions
//             </Typography>
//             <Grid container spacing={2}>
//               {isCustomer && (
//                 <Grid item xs={12} sm={6}>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     startIcon={<Assignment />}
//                     onClick={() => navigate('/requests')}
//                   >
//                     Create New Request
//                   </Button>
//                 </Grid>
//               )}
//               {isSupplier && (
//                 <>
//                   <Grid item xs={12} sm={6}>
//                     <Button
//                       fullWidth
//                       variant="contained"
//                       startIcon={<Assignment />}
//                       onClick={() => navigate('/requests')}
//                     >
//                       View Pending Requests
//                     </Button>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Button
//                       fullWidth
//                       variant="outlined"
//                       startIcon={<Landscape />}
//                       onClick={() => navigate('/land-plots')}
//                     >
//                       Manage Land Plots
//                     </Button>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Button
//                       fullWidth
//                       variant="outlined"
//                       startIcon={<Inventory />}
//                       onClick={() => navigate('/products')}
//                     >
//                       Manage Products
//                     </Button>
//                   </Grid>
//                 </>
//               )}
//             </Grid>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>
//               Account Status
//             </Typography>
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Account Type
//               </Typography>
//               <Chip 
//                 label={isSupplier ? 'Supplier' : 'Customer'} 
//                 color="primary" 
//                 size="small" 
//               />
//             </Box>
//             <Box sx={{ mb: 2 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Country
//               </Typography>
//               <Typography>{user?.country}</Typography>
//             </Box>
//             <Box>
//               <Typography variant="body2" color="text.secondary">
//                 Verification Status
//               </Typography>
//               <Chip 
//                 label={user?.verificationStatus || 'Pending'} 
//                 color={user?.verificationStatus === 'verified' ? 'success' : 'warning'} 
//                 size="small" 
//               />
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useCallback, useRef } from 'react';
// 1. CORRECT IMPORTS: Components from @mui/material
import {
  Grid, Card, CardContent, Typography, Box, Button, Paper,
  Chip, List, ListItem, ListItemText, ListItemIcon,
  Avatar, Skeleton, Fade, useTheme, Divider
} from '@mui/material';

// 2. CORRECT IMPORTS: Icons from @mui/icons-material
import {
  Assignment, CheckCircle, Warning, Landscape, Inventory,
  ArrowForward, Refresh as RefreshIcon, Person
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';

// --- STYLED COMPONENTS ---

const HoverCard = ({ children, sx }) => (
  <Card
    elevation={0}
    sx={{
      height: '100%',
      position: 'relative',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 4,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)',
        borderColor: 'transparent'
      },
      ...sx
    }}
  >
    {children}
  </Card>
);

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  const mainColor = theme.palette[color]?.main || color;
  
  return (
    <HoverCard>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
             <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ letterSpacing: 0.5, textTransform: 'uppercase', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary' }}>
              {value}
            </Typography>
          </Box>
          
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? `${color}.dark` : `${color}.light`, 
              backgroundColor: theme.palette[color] ? `${theme.palette[color].main}20` : 'action.hover',
              color: mainColor,
              width: 64, 
              height: 64, 
              borderRadius: 3,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 32 } })}
          </Avatar>
        </Box>
        
        {/* Decorative bottom bar */}
        <Box 
          sx={{ 
            height: 4, 
            width: '40px', 
            borderRadius: 2, 
            bgcolor: mainColor, 
            opacity: 0.6 
          }} 
        />
      </CardContent>
    </HoverCard>
  );
};

const DashboardSkeleton = () => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
      <Box>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={300} height={20} />
      </Box>
      <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
    </Box>
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 4 }} />
        </Grid>
      ))}
    </Grid>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, mb: 3 }} />
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4 }} />
      </Grid>
    </Grid>
  </Box>
);

// --- MAIN COMPONENT ---

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isSupplier, isCustomer, loading: authLoading } = useAuth();
  const isMounted = useRef(true);

  const [stats, setStats] = useState({
    totalRequests: 0, pendingRequests: 0, completedRequests: 0,
    landPlots: 0, products: 0, complianceRate: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- DATA LOGIC ---
  const normalizeStatsPayload = (raw) => {
    const root = (raw && (raw.stats || raw.recent) && raw) || raw?.data?.message || raw?.data || {};
    return {
      stats: root.stats || null,
      recent: Array.isArray(root.recent) ? root.recent : [],
      role: root.role || null
    };
  };

  const fetchDashboardData = useCallback(async (forceLoadingState = true) => {
    if (authLoading || !user) return;
    if (forceLoadingState && isMounted.current) setLoading(true);

    try {
      const raw = await requestService.getDashboardStats();
      
      if (!isMounted.current) return;

      const { stats: apiStats, recent: apiRecent } = normalizeStatsPayload(raw);

      if (apiStats) {
        setStats(prev => ({ ...prev, ...apiStats }));
        setRecent(apiRecent);
      } else {
        setStats({ totalRequests: 0, pendingRequests: 0, completedRequests: 0, landPlots: 0, products: 0, complianceRate: 0 });
        setRecent([]);
      }

    } catch (err) {
      console.error('[Dashboard] Fetch Error:', err);
      if (isMounted.current) {
        setStats(prev => ({ ...prev, totalRequests: 0 }));
        setRecent([]);
      }
    } finally {
      if (isMounted.current && forceLoadingState) setLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    isMounted.current = true;
    if (!authLoading && user) fetchDashboardData();
    return () => { isMounted.current = false; };
  }, [fetchDashboardData, authLoading, user]);

  // --- HELPERS ---
  const getStatusChip = (status) => {
    const s = (status || '').toLowerCase();
    const props = { size: 'small', variant: 'filled', sx: { borderRadius: 1, fontWeight: 600, px: 1 } };
    
    if (['completed', 'accepted', 'verified'].includes(s)) return <Chip label={status} color="success" {...props} />;
    if (['pending', 'review'].includes(s)) return <Chip label={status} color="warning" {...props} />;
    if (['rejected', 'cancelled'].includes(s)) return <Chip label={status} color="error" {...props} />;
    return <Chip label={status || 'Unknown'} color="default" {...props} />;
  };

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User';
  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening';
  };

  if (authLoading || loading) return <DashboardSkeleton />;

  return (
    <Fade in={true} timeout={500}>
      <Box>
        {/* --- HEADER --- */}
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {/* GRADIENT HEADER */}
            <Typography 
              variant="h4" 
              fontWeight={800} 
              sx={{ 
                mb: 0.5,
                background: 'linear-gradient(45deg, #2E3B55 30%, #6a5acd 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent'
              }}
            >
              {getGreeting()}, {displayName}
            </Typography>
            <Typography color="text.secondary" variant="body1">
              Here's your daily operational overview.
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            onClick={() => fetchDashboardData(true)} 
            startIcon={<RefreshIcon />} 
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Refresh Data
          </Button>
        </Box>

        {/* --- STATS ROW --- */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Requests" value={stats.totalRequests} icon={<Assignment />} color="primary" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Pending Actions" value={stats.pendingRequests} icon={<Warning />} color="warning" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Completed" value={stats.completedRequests} icon={<CheckCircle />} color="success" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              // UPDATED: Shows "Shared Plots" for Importers (Customers), "Land Plots" for Suppliers
              title={isSupplier ? "Land Plots" : "Shared Plots"} 
              value={stats.landPlots || 0} 
              icon={<Landscape />} 
              color="info" 
            />
          </Grid>
        </Grid>

        {/* --- MAIN LAYOUT --- */}
        <Grid container spacing={4}>
          
          {/* LEFT: Activity Feed (READ ONLY) */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 0, borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }} elevation={0}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="h6" fontWeight={700}>Recent Activity</Typography>
                <Button endIcon={<ArrowForward />} onClick={() => navigate('/requests')} color="inherit" sx={{ fontWeight: 600 }}>
                    View All
                </Button>
              </Box>
              
              <List disablePadding>
                {recent.length === 0 ? (
                  <Box sx={{ p: 6, textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="body1">No recent activity found.</Typography>
                  </Box>
                ) : (
                  recent.map((r, index) => (
                    <React.Fragment key={r.id || index}>
                      <ListItem 
                        sx={{ py: 2.5, px: 3 }}
                      >
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'primary.main', color: 'white', width: 42, height: 42 }}>
                            <Assignment fontSize="small"/>
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography fontWeight={600} variant="subtitle1" sx={{ mb: 0.5 }}>
                                {r.request_type || 'Request'}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              ID: {r.id} • {new Date(r.creation).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} 
                            </Typography>
                          }
                        />
                        {getStatusChip(r.status)}
                      </ListItem>
                      {index < recent.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          </Grid>

          {/* RIGHT: Actions & Status */}
          <Grid item xs={12} md={4}>
            
            {/* Quick Actions */}
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }} elevation={0}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                {isCustomer && (
                  <Grid item xs={12}>
                    <Button 
                      fullWidth variant="contained" size="large" 
                      startIcon={<Assignment />} onClick={() => navigate('/requests/new')}
                      sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, boxShadow: 'none' }}
                    >
                      Create New Request
                    </Button>
                  </Grid>
                )}
                {isSupplier && (
                  <>
                    <Grid item xs={12}>
                      <Button 
                        fullWidth variant="contained" size="large"
                        startIcon={<Assignment />} onClick={() => navigate('/requests')}
                        sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, boxShadow: 'none' }}
                      >
                        Review Requests
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        fullWidth variant="outlined" 
                        startIcon={<Landscape />} onClick={() => navigate('/land-plots')}
                        sx={{ py: 1, borderRadius: 2, borderWidth: '2px', fontWeight: 600, '&:hover': { borderWidth: '2px' } }}
                      >
                        Plots
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        fullWidth variant="outlined" 
                        startIcon={<Inventory />} onClick={() => navigate('/products')}
                        sx={{ py: 1, borderRadius: 2, borderWidth: '2px', fontWeight: 600, '&:hover': { borderWidth: '2px' } }}
                      >
                        Products
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>

            {/* Account Status */}
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }} elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={700}>Account Status</Typography>
              </Box>
              <List dense disablePadding>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText primary="Role" primaryTypographyProps={{ fontWeight: 500, color: 'text.secondary' }} />
                  {/* UPDATED: Shows "Importer" if user is a customer */}
                  <Chip 
                    label={isSupplier ? 'Supplier' : 'Importer'} 
                    size="small" 
                    variant="outlined" 
                    sx={{ fontWeight: 600 }} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText primary="Verification" primaryTypographyProps={{ fontWeight: 500, color: 'text.secondary' }} />
                  <Chip 
                    label={user?.verificationStatus || 'Pending'} 
                    size="small" 
                    color={user?.verificationStatus === 'verified' ? 'success' : 'warning'} 
                    sx={{ fontWeight: 600 }}
                  />
                </ListItem>
              </List>
            </Paper>

          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Dashboard;
