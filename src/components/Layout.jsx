// import React, { useState } from 'react';
// import { 
//   Box, 
//   Drawer, 
//   AppBar, 
//   Toolbar, 
//   Typography, 
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Avatar,
//   Menu,
//   MenuItem,
//   Divider,
//   useTheme,
//   useMediaQuery,
//   Chip
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   Assignment as AssignmentIcon,
//   Landscape as LandscapeIcon,
//   Inventory as InventoryIcon,
//   Person as PersonIcon,
//   Logout as LogoutIcon,
//   Storefront as StorefrontIcon, // <-- Add this line
//   Quiz as QuizIcon
// } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const drawerWidth = 260;

// const Layout = ({ children }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, logout } = useAuth();
  
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleProfileMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//     const menuItems = [
//     { text: 'Dashboard', icon: <DashboardIcon />, path: '/', roles: ['supplier', 'customer'] },
//     { text: 'Browse Suppliers', icon: <StorefrontIcon />, path: '/browse-suppliers', roles: ['customer'] },
//     { text: 'Requests', icon: <AssignmentIcon />, path: '/requests', roles: ['supplier', 'customer'] },
//     { text: 'Questionnaires', icon: <QuizIcon />, path: '/questionnaires', roles: ['supplier'] },
//     { text: 'Land Plots', icon: <LandscapeIcon />, path: '/land-plots', roles: ['supplier'] },
//     { text: 'Products', icon: <InventoryIcon />, path: '/products', roles: ['supplier'] },
//   ].filter(item => item.roles.includes(user?.role));

//   const drawer = (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <Toolbar sx={{ px: 2, py: 3 }}>
//         <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
//           FarmPortal
//         </Typography>
//       </Toolbar>
//       <Divider />
      
//       <Box sx={{ px: 2, py: 2 }}>
//         <Chip 
//           label={user?.role === 'supplier' ? 'Supplier' : 'Customer'} 
//           color="primary" 
//           size="small"
//           sx={{ mb: 2 }}
//         />
//       </Box>
      
//       <List sx={{ px: 2, flex: 1 }}>
//         {menuItems.map((item) => (
//           <ListItem
//             button
//             key={item.text}
//             onClick={() => {
//               navigate(item.path);
//               if (isMobile) setMobileOpen(false);
//             }}
//             selected={location.pathname === item.path}
//             sx={{
//               mb: 1,
//               borderRadius: 2,
//               '&.Mui-selected': {
//                 backgroundColor: 'primary.main',
//                 color: 'white',
//                 '& .MuiListItemIcon-root': {
//                   color: 'white',
//                 },
//                 '&:hover': {
//                   backgroundColor: 'primary.dark',
//                 },
//               },
//               '&:hover': {
//                 backgroundColor: 'action.hover',
//               },
//             }}
//           >
//             <ListItemIcon sx={{ minWidth: 40 }}>
//               {item.icon}
//             </ListItemIcon>
//             <ListItemText primary={item.text} />
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { md: `calc(100% - ${drawerWidth}px)` },
//           ml: { md: `${drawerWidth}px` },
//           backgroundColor: 'background.paper',
//           color: 'text.primary',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//         }}
//       >
//         <Toolbar sx={{ justifyContent: 'space-between' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <IconButton
//               edge="start"
//               onClick={handleDrawerToggle}
//               sx={{ mr: 2, display: { md: 'none' } }}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Typography variant="h6" noWrap>
//               {user?.companyName}
//             </Typography>
//           </Box>
          
//           <Box>
//             <IconButton onClick={handleProfileMenuOpen}>
//               <Avatar sx={{ bgcolor: 'primary.main' }}>
//                 {user?.companyName?.charAt(0).toUpperCase()}
//               </Avatar>
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleProfileMenuClose}
//             >
//               <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
//                 <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
//                 Profile
//               </MenuItem>
//               <Divider />
//               <MenuItem onClick={handleLogout}>
//                 <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
//                 Logout
//               </MenuItem>
//             </Menu>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Box
//         component="nav"
//         sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
//       >
//         <Drawer
//           variant={isMobile ? 'temporary' : 'permanent'}
//           open={isMobile ? mobileOpen : true}
//           onClose={handleDrawerToggle}
//           ModalProps={{ keepMounted: true }}
//           sx={{
//             '& .MuiDrawer-paper': {
//               boxSizing: 'border-box',
//               width: drawerWidth,
//               backgroundColor: 'background.paper',
//               borderRight: '1px solid rgba(0, 0, 0, 0.08)',
//             },
//           }}
//         >
//           {drawer}
//         </Drawer>
//       </Box>

//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { md: `calc(100% - ${drawerWidth}px)` },
//           mt: 8,
//           minHeight: 'calc(100vh - 64px)',
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default Layout;

import React, { useState, useMemo } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List,
  ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Divider,
  useTheme, useMediaQuery, Chip, ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Landscape as LandscapeIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Storefront as StorefrontIcon,
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isSupplier, isCustomer, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { logout(); navigate('/login'); };

  const displayName =
    user?.full_name ||
    user?.employee?.employee_name ||
    user?.customer?.customer_name ||
    user?.email ||
    'User';

  const accountLabel = isSupplier ? 'Supplier' : 'Customer';
  
  // Build menu items using two-type priority: Supplier > Customer
const menuItems = useMemo(() => {
  const base = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Requests', icon: <AssignmentIcon />, path: '/requests' },
  ];

  if (isSupplier) {
    const supplier = [
      { text: 'Questionnaires', icon: <QuizIcon />, path: '/questionnaires' },
      { text: 'Land Plots', icon: <LandscapeIcon />, path: '/land-plots' },
      { text: 'Products', icon: <InventoryIcon />, path: '/products' },
    ];
    return [...base, ...supplier];
  }

  // Otherwise treat as Customer (covers Customer-only, Employee-only, or both)
  const customer = [
    { text: 'Browse Suppliers', icon: <StorefrontIcon />, path: '/browse-suppliers' },
    { text: 'Questionnaires', icon: <QuizIcon />, path: '/questionnaires' },
    { text: 'Land Plots', icon: <LandscapeIcon />, path: '/land-plots' },
    { text: 'Products', icon: <InventoryIcon />, path: '/products' },
    { text: 'Risk Dashboard', icon: <AssessmentIcon />, path: '/risk-dashboard' },
  ];
  return [...base, ...customer];
}, [isSupplier]); // supplier drives the branch; customer is the fallback


  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2, py: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
          FarmPortal
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 2, py: 2 }}>
        <Chip label={accountLabel} color="primary" size="small" sx={{ mb: 2 }} />
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
            selected={isActive(item.path)}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': { color: 'white' },
                '&:hover': { backgroundColor: 'primary.dark' },
              },
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
              {displayName}
            </Typography>
          </Box>

          <Box>
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {(displayName?.[0] || 'U').toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
              <MenuItem disabled>
                <Box>
                  <Typography variant="subtitle2">{displayName}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/organization-profile'); handleProfileMenuClose(); }}>
                <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
                Organization Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'background.paper',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
