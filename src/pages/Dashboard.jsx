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

import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Button, Paper,
  LinearProgress, Chip, List, ListItem, ListItemText
} from '@mui/material';
import {
  TrendingUp, Assignment, CheckCircle, Warning, Landscape, Inventory
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/requestService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isSupplier, isCustomer, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    landPlots: 0,
    products: 0,
    complianceRate: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility: normalize any shape the service/backend might return
  const normalizeStatsPayload = (raw) => {
    // Support:
    // 1) service-unwrapped: { stats, recent, role }
    // 2) frappe/raw axios: { data: { message: { stats, recent, role } } } or { data: { stats, recent } }
    const root =
      (raw && (raw.stats || raw.recent || raw.role) && raw) ||
      raw?.data?.message ||
      raw?.data ||
      {};

    return {
      stats: root.stats || null,
      recent: Array.isArray(root.recent) ? root.recent : [],
      role: root.role ?? null,
    };
  };

  const computeStats = (requests) => {
    const norm = (s) => (s || '').toLowerCase();
    const total = requests.length;
    const pending = requests.filter(r => norm(r.status) === 'pending').length;
    const completed = requests.filter(r => ['completed', 'accepted'].includes(norm(r.status))).length;
    const complianceRate = total ? Math.round((completed / total) * 100) : 0;
    return { totalRequests: total, pendingRequests: pending, completedRequests: completed, complianceRate };
  };

  useEffect(() => {
    if (!authLoading) {
      fetchDashboardData('mount/useEffect');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isSupplier, isCustomer]);

  const fetchDashboardData = async (reason = 'manual') => {
    console.groupCollapsed('%c[Dashboard] fetchDashboardData', 'color:#6a5acd');
    console.log('Reason:', reason);
    console.log('Auth state →', { authLoading, isSupplier, isCustomer, user });
    setLoading(true);

    try {
      // Prefer compact stats endpoint
      const raw = await requestService.getDashboardStats();
      console.log('getDashboardStats() raw →', raw);

      const { stats: apiStats, recent: apiRecent, role } = normalizeStatsPayload(raw);
      console.log('Normalized →', { apiStats, apiRecent, role });

      if (apiStats) {
        setStats(prev => ({ ...prev, ...apiStats }));
        setRecent(apiRecent);
        console.log('State set from stats API →', { stats: { ...stats, ...apiStats }, recent: apiRecent });
        return;
      }

      console.warn('Stats API returned no stats; falling back to list endpoints');

      // Fallback to list endpoints
      if (isSupplier) {
        const resp = await requestService.getSupplierRequests();
        console.log('getSupplierRequests() →', resp);
        const requests = Array.isArray(resp?.requests) ? resp.requests : [];
        const computed = computeStats(requests);
        setStats(prev => ({ ...prev, ...computed }));
        setRecent(requests.slice(0, 5));
        console.log('Computed (supplier) →', { computed, recentPreview: requests.slice(0, 5) });
      } else {
        const resp = await requestService.getCustomerRequests();
        console.log('getCustomerRequests() →', resp);
        const requests = Array.isArray(resp?.requests) ? resp.requests : [];
        const computed = computeStats(requests);
        setStats(prev => ({ ...prev, ...computed }));
        setRecent(requests.slice(0, 5));
        console.log('Computed (customer) →', { computed, recentPreview: requests.slice(0, 5) });
      }
    } catch (err) {
      console.error('[Dashboard] fetchDashboardData error →', err);
      setStats(prev => ({
        ...prev,
        totalRequests: 0,
        pendingRequests: 0,
        completedRequests: 0,
        complianceRate: 0,
      }));
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const displayName = user?.full_name || user?.employee?.employee_name || user?.email || 'User';

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (authLoading || loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Welcome back, {displayName}!
        </Typography>
        <Button variant="outlined" onClick={() => fetchDashboardData('Refresh button')}>
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            icon={<Assignment sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={<Warning sx={{ color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Requests"
            value={stats.completedRequests}
            icon={<CheckCircle sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        {isSupplier && (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Compliance Rate"
              value={`${Number.isFinite(stats.complianceRate) ? stats.complianceRate : 0}%`}
              icon={<TrendingUp sx={{ color: 'info.main' }} />}
              color="info"
            />
          </Grid>
        )}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {isCustomer && (
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Assignment />}
                    onClick={() => navigate('/requests')}
                  >
                    Create New Request
                  </Button>
                </Grid>
              )}
              {isSupplier && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Assignment />}
                      onClick={() => navigate('/requests')}
                    >
                      View Pending Requests
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Landscape />}
                      onClick={() => navigate('/land-plots')}
                    >
                      Manage Land Plots
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Inventory />}
                      onClick={() => navigate('/products')}
                    >
                      Manage Products
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Account Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Account Type
              </Typography>
              <Chip label={isSupplier ? 'Supplier' : 'Customer'} color="primary" size="small" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Country
              </Typography>
              <Typography>{user?.country || '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Verification Status
              </Typography>
              <Chip
                label={user?.verificationStatus || 'Pending'}
                color={user?.verificationStatus === 'verified' ? 'success' : 'warning'}
                size="small"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Requests
            </Typography>
            <List dense>
              {recent.length === 0 && (
                <ListItem>
                  <ListItemText primary="No recent requests" />
                </ListItem>
              )}
              {recent.map((r) => (
                <ListItem key={r.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={`${r.request_type || 'Request'} • ${r.status}`}
                    secondary={new Date(r.creation).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
