// import React, { useState, useMemo } from 'react';
// import {
//   Box, Drawer, AppBar, Toolbar, Typography, IconButton, List,
//   ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Divider,
//   useTheme, useMediaQuery, Chip, ListItemButton
// } from '@mui/material';
// import {
//   Menu as MenuIcon,
//   Business as BusinessIcon,
//   Dashboard as DashboardIcon,
//   Assignment as AssignmentIcon,
//   Landscape as LandscapeIcon,
//   Inventory as InventoryIcon,
//   Person as PersonIcon,
//   Logout as LogoutIcon,
//   Storefront as StorefrontIcon,
//   Quiz as QuizIcon,
//   Assessment as AssessmentIcon,
// } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const drawerWidth = 260;

// const Layout = ({ children }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, isSupplier, isCustomer, logout } = useAuth();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
//   const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
//   const handleProfileMenuClose = () => setAnchorEl(null);
//   const handleLogout = () => { logout(); navigate('/login'); };

//   const displayName =
//     user?.full_name ||
//     user?.employee?.employee_name ||
//     user?.customer?.customer_name ||
//     user?.email ||
//     'User';

//   const accountLabel = isSupplier ? 'Supplier' : 'Customer';
  
//   // Build menu items using two-type priority: Supplier > Customer
// const menuItems = useMemo(() => {
//   const base = [
//     { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
//     { text: 'Requests', icon: <AssignmentIcon />, path: '/requests' },
//   ];

//   if (isSupplier) {
//     const supplier = [
//       { text: 'Questionnaires', icon: <QuizIcon />, path: '/questionnaires' },
//       { text: 'Land Plots', icon: <LandscapeIcon />, path: '/land-plots' },
//       { text: 'Products', icon: <InventoryIcon />, path: '/products' },
//     ];
//     return [...base, ...supplier];
//   }

//   // Otherwise treat as Customer (covers Customer-only, Employee-only, or both)
//   const customer = [
//     { text: 'Browse Suppliers', icon: <StorefrontIcon />, path: '/browse-suppliers' },
//     { text: 'Questionnaires', icon: <QuizIcon />, path: '/questionnaires' },
//     { text: 'Products', icon: <InventoryIcon />, path: '/products' },
//     { text: 'Risk Dashboard', icon: <AssessmentIcon />, path: '/risk-dashboard' },
//   ];
//   return [...base, ...customer];
// }, [isSupplier]); // supplier drives the branch; customer is the fallback


//   const isActive = (path) =>
//     location.pathname === path || location.pathname.startsWith(path + '/');

//   const drawer = (
//     <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//       <Toolbar sx={{ px: 2, py: 3 }}>
//         <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
//           FarmPortal
//         </Typography>
//       </Toolbar>
//       <Divider />
//       <Box sx={{ px: 2, py: 2 }}>
//         <Chip label={accountLabel} color="primary" size="small" sx={{ mb: 2 }} />
//       </Box>

//       <List sx={{ px: 2, flex: 1 }}>
//         {menuItems.map((item) => (
//           <ListItemButton
//             key={item.text}
//             onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
//             selected={isActive(item.path)}
//             sx={{
//               mb: 1,
//               borderRadius: 2,
//               '&.Mui-selected': {
//                 backgroundColor: 'primary.main',
//                 color: 'white',
//                 '& .MuiListItemIcon-root': { color: 'white' },
//                 '&:hover': { backgroundColor: 'primary.dark' },
//               },
//               '&:hover': { backgroundColor: 'action.hover' },
//             }}
//           >
//             <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.text} />
//           </ListItemButton>
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
//             <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
//               <MenuIcon />
//             </IconButton>
//             {/* <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
//               {displayName}
//             </Typography> */}
//           </Box>

//           <Box>
//             <IconButton onClick={handleProfileMenuOpen}>
//               <Avatar sx={{ bgcolor: 'primary.main' }}>
//                 {(displayName?.[0] || 'U').toUpperCase()}
//               </Avatar>
//             </IconButton>
//             <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
//               <MenuItem disabled>
//                 <Box>
//                   <Typography variant="subtitle2">{displayName}</Typography>
//                   <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
//                 </Box>
//               </MenuItem>
//               <Divider />
//               <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
//                 <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
//                 Profile
//               </MenuItem>
//               <MenuItem onClick={() => { navigate('/organization-profile'); handleProfileMenuClose(); }}>
//                 <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
//                 Organization Profile
//               </MenuItem>
//               <MenuItem onClick={handleLogout}>
//                 <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
//                 Logout
//               </MenuItem>
//             </Menu>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
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
  useTheme, useMediaQuery, Chip, ListItemButton, alpha
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

const drawerWidth = 280; 

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isSupplier, logout } = useAuth();

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

  // Label logic: Importer for customer
  const accountLabel = isSupplier ? 'Supplier' : 'Importer';

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

    const customer = [
      { text: 'Browse Suppliers', icon: <StorefrontIcon />, path: '/browse-suppliers' },
      { text: 'Questionnaires', icon: <QuizIcon />, path: '/questionnaires' },
      { text: 'Products', icon: <InventoryIcon />, path: '/products' },
      { text: 'Risk Dashboard', icon: <AssessmentIcon />, path: '/risk-dashboard' },
    ];
    return [...base, ...customer];
  }, [isSupplier]);

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Sidebar Header / Logo */}
      <Toolbar sx={{ px: 3, py: 2, minHeight: 80 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 800, 
            letterSpacing: -0.5,
            // UPDATED: Green color for FarmPortal
            color: 'success.main', // You can also use a specific hex like '#2e7d32'
          }}
        >
          FarmPortal
        </Typography>
      </Toolbar>
      
      {/* Role Badge */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Chip 
          label={accountLabel.toUpperCase()} 
          color="primary" 
          size="small"
          variant="filled"
          sx={{ 
            fontWeight: 700, 
            borderRadius: 1,
            height: 24,
            fontSize: '0.7rem',
            letterSpacing: 0.5
          }}
        />
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.text}
              onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
              selected={active}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                px: 2,
                py: 1.25,
                transition: 'all 0.2s ease-in-out',
                color: active ? 'primary.main' : 'text.secondary',
                bgcolor: active ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                '&:hover': {
                  bgcolor: active ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.action.hover, 0.08),
                },
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: active ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.2s'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.95rem',
                  fontWeight: active ? 600 : 500 
                }} 
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, mb: 2 }} />
      <Box sx={{ px: 3, pb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
         <Avatar 
            sx={{ 
                width: 40, height: 40, 
                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '1rem'
            }}
         >
            {(displayName?.[0] || 'U').toUpperCase()}
         </Avatar>
         <Box sx={{ overflow: 'hidden' }}>
             <Typography variant="subtitle2" noWrap fontWeight={600}>
                {displayName}
             </Typography>
             <Typography variant="caption" color="text.secondary" noWrap display="block">
                {user?.email}
             </Typography>
         </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Box>
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5, border: '1px solid', borderColor: 'divider' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.9rem' }}>
                {(displayName?.[0] || 'U').toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                elevation: 2,
                sx: { 
                    mt: 1.5, 
                    borderRadius: 3, 
                    minWidth: 200,
                    border: '1px solid',
                    borderColor: 'divider'
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={600}>{displayName}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }} sx={{ py: 1.5 }}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/organization-profile'); handleProfileMenuClose(); }} sx={{ py: 1.5 }}>
                <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
                Organization
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
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
              borderRight: '1px solid',
              borderColor: 'divider',
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
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar /> 
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
