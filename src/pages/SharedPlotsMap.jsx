// // import React, { useState, useEffect, useRef } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import {
// //   Box,
// //   Paper,
// //   Typography,
// //   Button,
// //   CircularProgress,
// //   Alert,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Chip
// // } from '@mui/material';
// // import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// // import { requestService } from '../services/requestService';
// // import { toast } from 'react-toastify';

// // const SharedPlotsMap = () => {
// //   const { requestId } = useParams();
// //   const navigate = useNavigate();
// //   const mapContainerRef = useRef(null);
// //   const leafletMapRef = useRef(null);

// //   const [loading, setLoading] = useState(true);
// //   const [sharedPlots, setSharedPlots] = useState([]);
// //   const [requestInfo, setRequestInfo] = useState(null);

// //   useEffect(() => {
// //     fetchSharedPlots();
// //   }, [requestId]);

// //   useEffect(() => {
// //     if (sharedPlots.length > 0) {
// //       initializeMap();
// //     }
// //   }, [sharedPlots]);

// //   const fetchSharedPlots = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await requestService.getSharedPlots(requestId);
// //       setSharedPlots(response.plots || []);
// //       setRequestInfo(response.request || null);
// //     } catch (error) {
// //       console.error('Failed to fetch shared plots:', error);
// //       toast.error('Failed to load shared plots');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const initializeMap = async () => {
// //     if (!window.L) {
// //       // Load Leaflet if not already loaded
// //       await new Promise((resolve) => {
// //         const script = document.createElement('script');
// //         script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
// //         script.onload = resolve;
// //         document.body.appendChild(script);
// //       });

// //       const link = document.createElement('link');
// //       link.rel = 'stylesheet';
// //       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
// //       document.head.appendChild(link);
// //     }

// //     const L = window.L;

// //     if (leafletMapRef.current) {
// //       leafletMapRef.current.remove();
// //     }

// //     if (!mapContainerRef.current) return;

// //     const map = L.map(mapContainerRef.current, {
// //       center: [20, 0],
// //       zoom: 2
// //     });

// //     // Add satellite tile layer
// //     L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
// //       attribution: 'Tiles © Esri',
// //       maxZoom: 18
// //     }).addTo(map);

// //     leafletMapRef.current = map;

// //     // Add shared plots to map
// //     const allBounds = [];
    
// //     sharedPlots.forEach((plot) => {
// //       let coordinates = [];
      
// //       if (plot.coordinates) {
// //         try {
// //           coordinates = typeof plot.coordinates === 'string' 
// //             ? JSON.parse(plot.coordinates) 
// //             : plot.coordinates;
// //         } catch {
// //           coordinates = [];
// //         }
// //       }

// //       if (coordinates.length === 0) return;

// //       const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
// //       const isSinglePoint = latLngs.length === 1;

// //       const popupContent = `
// //         <div>
// //           <strong>${plot.plot_id}</strong><br/>
// //           <strong>${plot.plot_name}</strong><br/>
// //           Country: ${plot.country}<br/>
// //           Area: ${plot.area} hectares<br/>
// //           Products: ${Array.isArray(plot.commodities) ? plot.commodities.join(', ') : plot.commodities || ''}
// //           ${plot.deforestation_percentage ? `<br/>Deforestation: ${plot.deforestation_percentage.toFixed(1)}%` : ''}
// //         </div>
// //       `;

// //       if (isSinglePoint) {
// //         const [lat, lng] = latLngs[0];
// //         L.marker([lat, lng])
// //           .addTo(map)
// //           .bindPopup(popupContent);
// //         allBounds.push([lat, lng]);
// //       } else {
// //         const polygon = L.polygon(latLngs, {
// //           color: '#2E7D32',
// //           fillColor: '#4CAF50',
// //           fillOpacity: 0.5,
// //           weight: 2
// //         }).addTo(map);
        
// //         polygon.bindPopup(popupContent);
// //         allBounds.push(...latLngs);
// //       }
// //     });

// //     // Fit map to show all plots
// //     if (allBounds.length > 0) {
// //       map.fitBounds(allBounds, { padding: [20, 20] });
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <Box display="flex" justifyContent="center" alignItems="center" height="400px">
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   if (!requestInfo) {
// //     return (
// //       <Box p={3}>
// //         <Alert severity="error">Request not found</Alert>
// //         <Button onClick={() => navigate('/requests')} sx={{ mt: 2 }}>
// //           Back to Requests
// //         </Button>
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box>
// //       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
// //         <Button
// //           startIcon={<ArrowBackIcon />}
// //           onClick={() => navigate('/requests')}
// //           sx={{ mr: 2 }}
// //         >
// //           Back to Requests
// //         </Button>
// //         <Typography variant="h4" sx={{ fontWeight: 600 }}>
// //           Shared Land Plots - {requestInfo.id}
// //         </Typography>
// //       </Box>

// //       {sharedPlots.length === 0 ? (
// //         <Alert severity="info">No land plots have been shared for this request</Alert>
// //       ) : (
// //         <>
// //           {/* Map */}
// //           <Paper sx={{ height: 500, mb: 3, position: 'relative' }}>
// //             <div
// //               ref={mapContainerRef}
// //               style={{
// //                 height: '100%',
// //                 width: '100%',
// //                 minHeight: '500px'
// //               }}
// //             />
// //           </Paper>

// //           {/* Plots Table */}
// //           <TableContainer component={Paper}>
// //             <Table>
// //               <TableHead>
// //                 <TableRow>
// //                   <TableCell>Plot ID</TableCell>
// //                   <TableCell>Name</TableCell>
// //                   <TableCell>Country</TableCell>
// //                   <TableCell>Area (ha)</TableCell>
// //                   <TableCell>Products</TableCell>
// //                   <TableCell>Deforestation</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {sharedPlots.map((plot) => (
// //                   <TableRow key={plot.id}>
// //                     <TableCell>{plot.plot_id}</TableCell>
// //                     <TableCell>{plot.plot_name}</TableCell>
// //                     <TableCell>{plot.country}</TableCell>
// //                     <TableCell>{plot.area}</TableCell>
// //                     <TableCell>
// //                       {Array.isArray(plot.commodities) 
// //                         ? plot.commodities.join(', ') 
// //                         : plot.commodities || ''
// //                       }
// //                     </TableCell>
// //                     <TableCell>
// //                       {plot.deforestation_percentage ? (
// //                         <Chip
// //                           label={`${plot.deforestation_percentage.toFixed(1)}%`}
// //                           color={plot.deforestation_percentage > 0 ? 'error' : 'success'}
// //                           size="small"
// //                         />
// //                       ) : (
// //                         <Chip label="0%" color="success" size="small" />
// //                       )}
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //         </>
// //       )}
// //     </Box>
// //   );
// // };

// // export default SharedPlotsMap;

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   CircularProgress,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip
// } from '@mui/material';
// import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import { requestService } from '../services/requestService';
// import { landPlotService } from '../services/landPlotService';
// import { toast } from 'react-toastify';

// /* ---------------- Visual helpers - Same as LandPlots ---------------- */
// const DOT_MIN = 8;
// const DOT_MAX = 18;
// const dotRadiusForZoom = (z) => Math.max(DOT_MIN, Math.min(DOT_MAX, 6 + (z - 3) * 1.3));
// const POINT_RING_METERS = 12;

// const styles = {
//   polygon: { color: '#2E7D32', fillColor: '#4CAF50', fillOpacity: 0.5, weight: 2 },
//   polygonGlow: { color: '#66BB6A', weight: 6, opacity: 0.25 },
//   pointDot: (z) => ({
//     radius: dotRadiusForZoom(z),
//     color: '#1E88E5',
//     weight: 2,
//     fillColor: '#90CAF9',
//     fillOpacity: 1
//   }),
//   pointRing: { color: '#1E88E5', weight: 2, opacity: 0.8, fillOpacity: 0.05 }
// };

// function centroidLatLng(latlngs) {
//   if (!latlngs?.length) return null;
//   let latSum = 0, lngSum = 0;
//   for (const [lat, lng] of latlngs) { latSum += lat; lngSum += lng; }
//   const n = latlngs.length;
//   return [latSum / n, lngSum / n];
// }

// const SharedPlotsMap = () => {
//   const { requestId } = useParams();
//   const navigate = useNavigate();
//   const mapContainerRef = useRef(null);
//   const leafletMapRef = useRef(null);
//   const plotsLayerRef = useRef(null);
//   const dotMarkersRef = useRef([]);
//   const baseLayers = useRef({});
//   const treeCoverLayerRef = useRef(null);
//   const deforestationLayerRef = useRef(null);

//   const [loading, setLoading] = useState(true);
//   const [mapReady, setMapReady] = useState(false);
//   const [sharedPlots, setSharedPlots] = useState([]);
//   const [requestInfo, setRequestInfo] = useState(null);
//   const [globalTileUrls, setGlobalTileUrls] = useState(null);
//   const [layersLoading, setLayersLoading] = useState(false);

//   useEffect(() => {
//     fetchSharedPlots();
//     loadGlobalTileUrls();
//   }, [requestId]);

//   useEffect(() => {
//     if (sharedPlots.length > 0) {
//       initializeMap();
//     }
//   }, [sharedPlots]);

//   // Update layer control when tile URLs are loaded
//   useEffect(() => {
//     if (mapReady && leafletMapRef.current && globalTileUrls) {
//       console.log('Setting up layer control with tile URLs:', globalTileUrls);
//       setupLayerControl(leafletMapRef.current);
//     }
//   }, [mapReady, globalTileUrls]);

//   const fetchSharedPlots = async () => {
//     try {
//       setLoading(true);
//       const response = await requestService.getSharedPlots(requestId);
//       setSharedPlots(response.plots || []);
//       setRequestInfo(response.request || null);
//     } catch (error) {
//       console.error('Failed to fetch shared plots:', error);
//       toast.error('Failed to load shared plots');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadGlobalTileUrls = async () => {
//     try {
//       setLayersLoading(true);
//       console.log('Loading global tile URLs...');
//       const tileUrls = await landPlotService.getGlobalDeforestationTiles();
//       console.log('Tile URLs loaded:', tileUrls);
//       setGlobalTileUrls(tileUrls);
//     } catch (error) {
//       console.error('Failed to load global tile URLs:', error);
//       console.log('Earth Engine tiles not available - continuing without background layers');
//       setGlobalTileUrls(null);
//     } finally {
//       setLayersLoading(false);
//     }
//   };

//   const initializeMap = async () => {
//     try {
//       // Load Leaflet CSS if not already loaded
//       if (!document.getElementById('leaflet-css')) {
//         const leafletCSS = document.createElement('link');
//         leafletCSS.id = 'leaflet-css';
//         leafletCSS.rel = 'stylesheet';
//         leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//         document.head.appendChild(leafletCSS);
//       }

//       // Load Leaflet JS and wait for it to load
//       if (!window.L) {
//         await new Promise((resolve, reject) => {
//           const script = document.createElement('script');
//           script.id = 'leaflet-js';
//           script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//           script.onload = resolve;
//           script.onerror = reject;
//           document.body.appendChild(script);
//         });
//       }

//       const L = window.L;
      
//       if (!L) {
//         throw new Error('Leaflet failed to load');
//       }

//       // Clean up existing map
//       if (leafletMapRef.current) {
//         leafletMapRef.current.remove();
//         leafletMapRef.current = null;
//       }

//       if (!mapContainerRef.current) return;
//       mapContainerRef.current.innerHTML = '';

//       // Define base layers - Same as LandPlots
//       baseLayers.current = {
//         satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//           attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
//           maxZoom: 18
//         }),
//         street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '© OpenStreetMap contributors',
//           maxZoom: 19
//         }),
//         hybrid: L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
//           maxZoom: 20,
//           subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
//           attribution: '© Google'
//         })
//       };

//       // Create map with satellite as default
//       const map = L.map(mapContainerRef.current, {
//         center: [20, 0],
//         zoom: 2,
//         zoomControl: true,
//         dragging: true,
//         scrollWheelZoom: true,
//         layers: [baseLayers.current.satellite]
//       });

//       leafletMapRef.current = map;

//       // Create plots layer
//       plotsLayerRef.current = L.layerGroup().addTo(map);
//       dotMarkersRef.current = [];

//       // Handle zoom events
//       map.on('zoomend', () => {
//         const z = map.getZoom();
//         dotMarkersRef.current.forEach(marker => {
//           if (marker.setStyle) {
//             marker.setStyle({ radius: dotRadiusForZoom(z) });
//           }
//         });
//       });

//       setMapReady(true);

//       setTimeout(() => {
//         map.invalidateSize();
//         drawPlots();
//         setupInitialLayerControl(map);
//       }, 100);

//     } catch (error) {
//       console.error('Error initializing map:', error);
//       toast.error('Failed to initialize map');
//     }
//   };

//   // Setup layer control - Same as LandPlots
//   const setupInitialLayerControl = (map) => {
//     const L = window.L;
    
//     const baseMaps = {
//       "🛰️ Satellite": baseLayers.current.satellite,
//       "🗺️ Street Map": baseLayers.current.street, 
//       "🌍 Hybrid": baseLayers.current.hybrid
//     };

//     const overlayMaps = {
//       "📍 Shared Plots": plotsLayerRef.current
//     };

//     map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
//       position: 'topright',
//       collapsed: false
//     }).addTo(map);

//     console.log('Initial layer control added');
//   };

//   const setupLayerControl = (map) => {
//     const L = window.L;
    
//     if (map.layerControlInstance) {
//       map.removeControl(map.layerControlInstance);
//       map.layerControlInstance = null;
//     }

//     const baseMaps = {
//       "🛰️ Satellite": baseLayers.current.satellite,
//       "🗺️ Street Map": baseLayers.current.street, 
//       "🌍 Hybrid": baseLayers.current.hybrid
//     };

//     const overlayMaps = {
//       "📍 Shared Plots": plotsLayerRef.current
//     };

//     // Add Earth Engine layers if available
//     if (globalTileUrls && globalTileUrls.global_tree_cover_url && globalTileUrls.global_deforestation_url) {
//       try {
//         console.log('Creating Earth Engine layers...');
        
//         if (!treeCoverLayerRef.current) {
//           treeCoverLayerRef.current = L.tileLayer(globalTileUrls.global_tree_cover_url, {
//             attribution: 'Hansen/UMD/Google/USGS/NASA',
//             opacity: 0.7,
//             maxZoom: 18
//           });
//           console.log('Tree cover layer created');
//         }

//         if (!deforestationLayerRef.current) {
//           deforestationLayerRef.current = L.tileLayer(globalTileUrls.global_deforestation_url, {
//             attribution: 'Hansen/UMD/Google/USGS/NASA', 
//             opacity: 0.8,
//             maxZoom: 18
//           });
//           console.log('Deforestation layer created');
//         }

//         overlayMaps["🌳 Forest Cover 2000"] = treeCoverLayerRef.current;
//         overlayMaps["🔥 Forest Loss (2021-2024)"] = deforestationLayerRef.current;
        
//         console.log('Earth Engine layers added to overlay maps');

//       } catch (error) {
//         console.error('Error creating Earth Engine layers:', error);
//       }
//     } else {
//       console.log('Global tile URLs not available or incomplete:', globalTileUrls);
//     }

//     map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
//       position: 'topright',
//       collapsed: false
//     }).addTo(map);

//     console.log('Layer control updated with overlays:', Object.keys(overlayMaps));
//   };

//   // Draw plots with same styling as LandPlots
//   function drawPlots() {
//     const L = window.L;
//     const map = leafletMapRef.current;
//     const layer = plotsLayerRef.current;
    
//     if (!L || !map || !layer || !mapReady) {
//       console.log('Map not ready for plotting');
//       return;
//     }

//     console.log('Drawing shared plots:', sharedPlots.length);

//     layer.clearLayers();
//     dotMarkersRef.current = [];

//     const allBounds = [];

//     sharedPlots.forEach(plot => {
//       let coordinates = [];
      
//       if (plot.coordinates) {
//         try {
//           coordinates = typeof plot.coordinates === 'string' 
//             ? JSON.parse(plot.coordinates) 
//             : plot.coordinates;
//         } catch {
//           coordinates = [];
//         }
//       }

//       if (coordinates.length === 0) return;

//       const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
//       const isSinglePoint = latLngs.length === 1;
// ore
//       const defText = plot.deforestation_percentage
//         ? `<br/>Deforestation: ${plot.deforestation_percentage.toFixed(1)}%`
//         : '';

//       let productsDisplay = '';
//       if (Array.isArray(plot.products)) {
//         productsDisplay = plot.products.join(', ');
//       } else if (Array.isArray(plot.commodities)) {
//         productsDisplay = plot.commodities.join(', ');
//       } else if (typeof plot.commodities === 'string') {
//         productsDisplay = plot.commodities;
//       }

//       const popupHtml = `
//         <div style="font-size:14px">
//           <strong style="color:#2E7D32;font-size:16px">${plot.plot_id || plot.id}</strong><br/>
//           <strong>${plot.plot_name || plot.name || 'Unnamed Plot'}</strong><br/>
//           Country: ${plot.country || 'Unknown'}<br/>
//           Products: ${productsDisplay || 'None'}<br/>
//           Area: ${plot.area || 0} hectares
//           ${plot.deforestation_percentage
//             ? `<br/><span style="color:#D32F2F">Deforestation: ${plot.deforestation_percentage.toFixed(1)}%<br/>Deforested Area: ${plot.deforested_area?.toFixed?.(2) ?? '—'} ha</span>`
//             : ''
//           }
//         </div>
//       `;

//       if (isSinglePoint) {
//         // Single point - show dot and circle
//         const [lat, lng] = latLngs[0];
//         const dot = L.circleMarker([lat, lng], { ...styles.pointDot(map.getZoom()) }).addTo(layer);
//         dotMarkersRef.current.push(dot);
//         L.circle([lat, lng], { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);

//         dot.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
//         dot.bindPopup(popupHtml);

//         allBounds.push([lat, lng]);
//         return;
//       }

//       // Multi-point polygon - show polygon outline with center dot
//       L.polygon(latLngs, { ...styles.polygonGlow, interactive: false }).addTo(layer);
//       const polygon = L.polygon(latLngs, styles.polygon).addTo(layer);

//       polygon.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
//       polygon.bindPopup(popupHtml);

//       polygon.on('click', function () {
//         map.fitBounds(this.getBounds(), { padding: [50, 50] });
//       });

//       // Add center dot for visibility
//       const center = centroidLatLng(latLngs);
//       if (center) {
//         const dot = L.circleMarker(center, styles.pointDot(map.getZoom())).addTo(layer);
//         dotMarkersRef.current.push(dot);
//         L.circle(center, { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);
//       }

//       allBounds.push(...latLngs);
//     });

//     // Fit map to show all plots with proper padding
//     if (allBounds.length > 0) {
//       try { 
//         map.fitBounds(allBounds, { padding: [50, 50] }); 
//       } catch (error) {
//         console.warn('Error fitting bounds:', error);
//       }
//     }
//   }

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!requestInfo) {
//     return (
//       <Box p={3}>
//         <Alert severity="error">Request not found</Alert>
//         <Button onClick={() => navigate('/requests')} sx={{ mt: 2 }}>
//           Back to Requests
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <Button
//           startIcon={<ArrowBackIcon />}
//           onClick={() => navigate('/requests')}
//           sx={{ mr: 2 }}
//         >
//           Back to Requests
//         </Button>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Shared Land Plots - {requestInfo.id}
//         </Typography>
//       </Box>

//       {sharedPlots.length === 0 ? (
//         <Alert severity="info">No land plots have been shared for this request</Alert>
//       ) : (
//         <>
//           {/* Map with layer controls */}
//           <Paper sx={{ height: 500, mb: 3, position: 'relative' }}>
//             <div
//               ref={mapContainerRef}
//               style={{
//                 height: '100%',
//                 width: '100%',
//                 minHeight: '500px',
//                 backgroundColor: '#f5f5f5'
//               }}
//             />
//             {!mapReady && (
//               <Box sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)',
//                 zIndex: 1000
//               }}>
//                 <CircularProgress />
//                 <Typography sx={{ mt: 1 }}>Loading satellite map...</Typography>
//               </Box>
//             )}
//             {layersLoading && (
//               <Box sx={{
//                 position: 'absolute',
//                 top: 10,
//                 left: 10,
//                 zIndex: 1000,
//                 backgroundColor: 'rgba(255,255,255,0.9)',
//                 padding: 1,
//                 borderRadius: 1
//               }}>
//                 <Typography variant="body2">Loading Earth Engine layers...</Typography>
//               </Box>
//             )}
//           </Paper>

//           {/* Plots Table */}
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Plot ID</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Country</TableCell>
//                   <TableCell>Area (ha)</TableCell>
//                   <TableCell>Products</TableCell>
//                   <TableCell>Deforestation</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sharedPlots.map((plot) => (
//                   <TableRow key={plot.id}>
//                     <TableCell>{plot.plot_id}</TableCell>
//                     <TableCell>{plot.plot_name}</TableCell>
//                     <TableCell>{plot.country}</TableCell>
//                     <TableCell>{plot.area}</TableCell>
//                     <TableCell>
//                       {Array.isArray(plot.commodities) 
//                         ? plot.commodities.join(', ') 
//                         : plot.commodities || ''
//                       }
//                     </TableCell>
//                     <TableCell>
//                       {plot.deforestation_percentage ? (
//                         <Chip
//                           label={`${plot.deforestation_percentage.toFixed(1)}%`}
//                           color={plot.deforestation_percentage > 0 ? 'error' : 'success'}
//                           size="small"
//                         />
//                       ) : (
//                         <Chip label="0%" color="success" size="small" />
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       )}
//     </Box>
//   );
// };

// export default SharedPlotsMap;

// --- SAME IMPORTS ---
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   CircularProgress,
//   Alert,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip
// } from '@mui/material';
// import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import { requestService } from '../services/requestService';
// import { landPlotService } from '../services/landPlotService';
// import { toast } from 'react-toastify';

// // ---- SAME CONSTANTS + HELPERS ----

// const DOT_MIN = 8;
// const DOT_MAX = 18;
// const dotRadiusForZoom = (z) => Math.max(DOT_MIN, Math.min(DOT_MAX, 6 + (z - 3) * 1.3));
// const POINT_RING_METERS = 12;

// const styles = {
//   polygon: { color: '#2E7D32', fillColor: '#4CAF50', fillOpacity: 0.5, weight: 2 },
//   polygonGlow: { color: '#66BB6A', weight: 6, opacity: 0.25 },
//   pointDot: (z) => ({
//     radius: dotRadiusForZoom(z),
//     color: '#1E88E5',
//     weight: 2,
//     fillColor: '#90CAF9',
//     fillOpacity: 1
//   }),
//   pointRing: { color: '#1E88E5', weight: 2, opacity: 0.8, fillOpacity: 0.05 }
// };

// function centroidLatLng(latlngs) {
//   if (!latlngs?.length) return null;
//   let latSum = 0, lngSum = 0;
//   for (const [lat, lng] of latlngs) { latSum += lat; lngSum += lng; }
//   return [latSum / latlngs.length, lngSum / latlngs.length];
// }

// const SharedPlotsMap = () => {
//   const { requestId } = useParams();
//   const navigate = useNavigate();
//   const mapContainerRef = useRef(null);
//   const leafletMapRef = useRef(null);
//   const plotsLayerRef = useRef(null);
//   const dotMarkersRef = useRef([]);
//   const baseLayers = useRef({});
//   const treeCoverLayerRef = useRef(null);
//   const deforestationLayerRef = useRef(null);

//   const [loading, setLoading] = useState(true);
//   const [mapReady, setMapReady] = useState(false);
//   const [sharedPlots, setSharedPlots] = useState([]);
//   const [requestInfo, setRequestInfo] = useState(null);
//   const [globalTileUrls, setGlobalTileUrls] = useState(null);
//   const [layersLoading, setLayersLoading] = useState(false);

//   useEffect(() => {
//     fetchSharedPlots();
//     loadGlobalTileUrls();
//   }, [requestId]);

// useEffect(() => {
//   if (sharedPlots.length === 0) return;

//   if (!leafletMapRef.current) {
//     initializeMap();
//   } else if (mapReady) {
//     drawPlots();
//   }
// }, [sharedPlots, mapReady]);

//   useEffect(() => {
//     if (mapReady && leafletMapRef.current && globalTileUrls) {
//       setupLayerControl(leafletMapRef.current);
//     }
//   }, [mapReady, globalTileUrls]);

//   const fetchSharedPlots = async () => {
//     try {
//       setLoading(true);
//       const response = await requestService.getSharedPlots(requestId);
//       setSharedPlots(response.plots || []);
//       setRequestInfo(response.request || null);
//     } catch (error) {
//       toast.error('Failed to load shared plots');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadGlobalTileUrls = async () => {
//     try {
//       setLayersLoading(true);
//       const tileUrls = await landPlotService.getGlobalDeforestationTiles();
//       setGlobalTileUrls(tileUrls);
//     } catch {
//       setGlobalTileUrls(null);
//     } finally {
//       setLayersLoading(false);
//     }
//   };

//   const initializeMap = async () => {
//     try {
//       // Load Leaflet CSS
//       if (!document.getElementById('leaflet-css')) {
//         const leafletCSS = document.createElement('link');
//         leafletCSS.id = 'leaflet-css';
//         leafletCSS.rel = 'stylesheet';
//         leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//         document.head.appendChild(leafletCSS);
//       }

//       // Load Leaflet JS
//       if (!window.L) {
//         await new Promise((resolve, reject) => {
//           const script = document.createElement('script');
//           script.id = 'leaflet-js';
//           script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//           script.onload = resolve;
//           script.onerror = reject;
//           document.body.appendChild(script);
//         });
//       }

//       const L = window.L;

//       if (leafletMapRef.current) {
//         leafletMapRef.current.remove();
//         leafletMapRef.current = null;
//       }

//       if (!mapContainerRef.current) return;
//       mapContainerRef.current.innerHTML = '';

//       baseLayers.current = {
//         satellite: L.tileLayer(
//           'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
//         ),
//         street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
//         hybrid: L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
//           subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
//         })
//       };

//       const map = L.map(mapContainerRef.current, {
//         center: [20, 0],
//         zoom: 2,
//         layers: [baseLayers.current.satellite]
//       });

//       leafletMapRef.current = map;

//       plotsLayerRef.current = L.layerGroup().addTo(map);

//       map.on('zoomend', () => {
//         const z = map.getZoom();
//         dotMarkersRef.current.forEach(marker => {
//           marker.setStyle?.({ radius: dotRadiusForZoom(z) });
//         });
//       });

//       setMapReady(true);

//       setTimeout(() => {
//         map.invalidateSize();
//         drawPlots();
//         setupInitialLayerControl(map);
//       }, 100);

//     } catch {
//       toast.error('Failed to initialize map');
//     }
//   };

//   const setupInitialLayerControl = (map) => {
//     const L = window.L;

//     const baseMaps = {
//       "🛰️ Satellite": baseLayers.current.satellite,
//       "🗺️ Street Map": baseLayers.current.street,
//       "🌍 Hybrid": baseLayers.current.hybrid
//     };

//     const overlayMaps = {
//       "📍 Shared Plots": plotsLayerRef.current
//     };

//     map.layerControlInstance = L.control.layers(baseMaps, overlayMaps).addTo(map);
//   };

//   const setupLayerControl = (map) => {
//     const L = window.L;

//     if (map.layerControlInstance) {
//       map.removeControl(map.layerControlInstance);
//     }

//     const baseMaps = {
//       "🛰️ Satellite": baseLayers.current.satellite,
//       "🗺️ Street Map": baseLayers.current.street,
//       "🌍 Hybrid": baseLayers.current.hybrid
//     };

//     const overlayMaps = {
//       "📍 Shared Plots": plotsLayerRef.current
//     };

//     if (globalTileUrls?.global_tree_cover_url && globalTileUrls?.global_deforestation_url) {
//       treeCoverLayerRef.current ||= L.tileLayer(globalTileUrls.global_tree_cover_url, { opacity: 0.7 });
//       deforestationLayerRef.current ||= L.tileLayer(globalTileUrls.global_deforestation_url, { opacity: 0.8 });

//       overlayMaps["🌳 Forest Cover 2000"] = treeCoverLayerRef.current;
//       overlayMaps["🔥 Forest Loss (2021-2024)"] = deforestationLayerRef.current;
//     }

//     map.layerControlInstance = L.control.layers(baseMaps, overlayMaps).addTo(map);
//   };

//   // ---------------------------- DRAWING PLOTS ----------------------------
//   function drawPlots() {
//     const L = window.L;
//     const map = leafletMapRef.current;
//     const layer = plotsLayerRef.current;

//     if (!map || !layer || !mapReady) return;

//     layer.clearLayers();
//     dotMarkersRef.current = [];
//     const allBounds = [];

//     sharedPlots.forEach(plot => {
//       let coordinates = [];

//       // Prefer explicit coordinates if provided
//       try {
//         if (plot.coordinates) {
//           coordinates = typeof plot.coordinates === 'string'
//             ? JSON.parse(plot.coordinates)
//             : plot.coordinates || [];
//         }
//       } catch {
//         coordinates = [];
//       }

//       // Fall back to GeoJSON payloads
//       if (coordinates.length === 0 && plot.geojson?.coordinates) {
//         if (plot.geojson.type === 'Point') {
//           coordinates = [plot.geojson.coordinates];
//         } else if (Array.isArray(plot.geojson.coordinates[0])) {
//           coordinates = plot.geojson.coordinates[0];
//         }
//       }

//       // Final fallback to simple lat/lng fields
//       if (
//         coordinates.length === 0 &&
//         plot.longitude != null &&
//         plot.latitude != null
//       ) {
//         coordinates = [[plot.longitude, plot.latitude]];
//       }

//       if (coordinates.length === 0) return;

//       const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
//       const isSinglePoint = latLngs.length === 1;

//       // *************** FIXED: correct deforestation check ***************
//       const hasDef = plot.deforestation_percentage != null;

//       const defText = hasDef
//         ? `<br/>Deforestation: ${plot.deforestation_percentage.toFixed(1)}%`
//         : '';

//       const popupHtml = `
//         <div style="font-size:14px">
//           <strong style="color:#2E7D32;font-size:16px">${plot.plot_id || plot.id}</strong><br/>
//           <strong>${plot.plot_name || plot.name || 'Unnamed Plot'}</strong><br/>
//           Country: ${plot.country || 'Unknown'}<br/>
//           Products: ${(plot.products || plot.commodities || []).join?.(', ') || 'None'}<br/>
//           Area: ${plot.area || 0} hectares
//           ${hasDef
//             ? `<br/><span style="color:#D32F2F">
//                 Deforestation: ${plot.deforestation_percentage.toFixed(1)}%<br/>
//                 Deforested Area: ${plot.deforested_area?.toFixed?.(2) ?? '—'} ha
//                </span>`
//             : ''
//           }
//         </div>
//       `;

//       if (isSinglePoint) {
//         const [lat, lng] = latLngs[0];
//         const dot = L.circleMarker([lat, lng], styles.pointDot(map.getZoom())).addTo(layer);

//         dotMarkersRef.current.push(dot);

//         dot.bindTooltip(
//           `<strong>${plot.plot_id}</strong><br/>${plot.plot_name}${defText}`,
//           { sticky: true }
//         );
//         dot.bindPopup(popupHtml);

//         allBounds.push([lat, lng]);
//         return;
//       }

//       const glow = L.polygon(latLngs, { ...styles.polygonGlow, interactive: false }).addTo(layer);
//       const polygon = L.polygon(latLngs, styles.polygon).addTo(layer);

//       polygon.bindTooltip(
//         `<strong>${plot.plot_id}</strong><br/>${plot.plot_name}${defText}`,
//         { sticky: true }
//       );
//       polygon.bindPopup(popupHtml);

//       polygon.on('click', function () {
//         map.fitBounds(this.getBounds(), { padding: [50, 50] });
//       });

//       const center = centroidLatLng(latLngs);
//       if (center) {
//         const dot = L.circleMarker(center, styles.pointDot(map.getZoom())).addTo(layer);
//         dotMarkersRef.current.push(dot);
//       }

//       allBounds.push(...latLngs);
//     });

//     if (allBounds.length > 0) {
//       map.fitBounds(allBounds, { padding: [50, 50] });
//     }
//   }

//   // ---------------------------- RENDER ----------------------------
//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" height="400px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!requestInfo) {
//     return (
//       <Box p={3}>
//         <Alert severity="error">Request not found</Alert>
//         <Button onClick={() => navigate('/requests')} sx={{ mt: 2 }}>
//           Back to Requests
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/requests')} sx={{ mr: 2 }}>
//           Back to Requests
//         </Button>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>
//           Shared Land Plots - {requestInfo.id}
//         </Typography>
//       </Box>

//       {sharedPlots.length === 0 ? (
//         <Alert severity="info">No land plots have been shared for this request</Alert>
//       ) : (
//         <>
//           <Paper sx={{ height: 500, mb: 3, position: 'relative' }}>
//             <div
//               ref={mapContainerRef}
//               style={{
//                 height: '100%',
//                 width: '100%',
//                 minHeight: '500px',
//                 backgroundColor: '#f5f5f5'
//               }}
//             />

//             {!mapReady && (
//               <Box sx={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)'
//               }}>
//                 <CircularProgress />
//               </Box>
//             )}

//             {layersLoading && (
//               <Box sx={{
//                 position: 'absolute',
//                 top: 10,
//                 left: 10,
//                 padding: 1,
//                 backgroundColor: 'rgba(255,255,255,0.9)',
//                 borderRadius: 1
//               }}>
//                 <Typography variant="body2">Loading Earth Engine layers...</Typography>
//               </Box>
//             )}
//           </Paper>

//           {/* TABLE */}
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Plot ID</TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Country</TableCell>
//                   <TableCell>Area (ha)</TableCell>
//                   <TableCell>Products</TableCell>
//                   <TableCell>Deforestation</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sharedPlots.map((plot) => {
//                   const hasDef = plot.deforestation_percentage != null;

//                   return (
//                     <TableRow key={plot.id}>
//                       <TableCell>{plot.plot_id}</TableCell>
//                       <TableCell>{plot.plot_name}</TableCell>
//                       <TableCell>{plot.country}</TableCell>
//                       <TableCell>{plot.area}</TableCell>
//                       <TableCell>
//                         {Array.isArray(plot.commodities)
//                           ? plot.commodities.join(', ')
//                           : plot.commodities || ''}
//                       </TableCell>

//                       <TableCell>
//                         {hasDef ? (
//                           <Chip
//                             label={`${plot.deforestation_percentage.toFixed(1)}%`}
//                             color={plot.deforestation_percentage > 0 ? 'error' : 'success'}
//                             size="small"
//                           />
//                         ) : (
//                           <Chip label="—" size="small" />
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </>
//       )}
//     </Box>
//   );
// };

// export default SharedPlotsMap;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { requestService } from '../services/requestService';
import { landPlotService } from '../services/landPlotService';
import { toast } from 'react-toastify';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZmFpcmNvZGVsYWIiLCJhIjoiY21pMzAzNDh4MHUzNTJrc2ZkNHdvdWowZCJ9.ctPB8FDsIjXa3MgFt4GVyA';

const SharedPlotsMap = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const rotationIntervalRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [sharedPlots, setSharedPlots] = useState([]);
  const [requestInfo, setRequestInfo] = useState(null);
  const [globalTileUrls, setGlobalTileUrls] = useState(null);
  const [layersLoading, setLayersLoading] = useState(false);

  useEffect(() => {
    loadGlobalTileUrls();
    const plotsFromState = locationState?.plots;

    if (Array.isArray(plotsFromState)) {
      setSharedPlots(plotsFromState);
      setRequestInfo({
        id: locationState.requestId || requestId,
        supplier_name: locationState.supplierName,
        supplier_group: locationState.supplierGroup,
        supplier_id: locationState.supplierId
      });
      setLoading(false);
      return;
    }

    fetchSharedPlots();
  }, [requestId, locationState]);

  // Initialize map when plots are loaded
  useEffect(() => {
    if (sharedPlots.length === 0) return;

    let mounted = true;

    const initMap = async () => {
      try {
        console.log('Starting Mapbox map initialization...');

        let attempts = 0;
        const maxAttempts = 20;
        
        while (!mapContainerRef.current && mounted && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!mapContainerRef.current) {
          console.error('Map container not available');
          if (mounted) setMapReady(true);
          return;
        }

        // Load Mapbox GL JS
        if (!window.mapboxgl) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
          document.head.appendChild(link);

          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        if (!mounted || !mapContainerRef.current) return;

        if (mapRef.current) {
          try {
            mapRef.current.remove();
          } catch (e) {
            console.error('Error removing old map:', e);
          }
          mapRef.current = null;
        }

        mapContainerRef.current.innerHTML = '';
        window.mapboxgl.accessToken = MAPBOX_TOKEN;

        const map = new window.mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          projection: 'globe',
          center: [0, 20],
          zoom: 1.5,
          pitch: 0,
          bearing: 0
        });

        if (!mounted) return;

        mapRef.current = map;
        popupRef.current = new window.mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false
        });

        map.on('style.load', () => {
          map.setFog({
            'color': 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
          });
        });

        map.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
        map.addControl(new window.mapboxgl.FullscreenControl(), 'top-right');

        // Globe rotation
        let userInteracting = false;
        let rotationActive = true;
        
        const spinGlobe = () => {
          if (!userInteracting && rotationActive && map.getZoom() < 5) {
            const center = map.getCenter();
            center.lng -= 0.2;
            map.easeTo({ center, duration: 100, easing: (n) => n });
          }
        };
        
        const enableGlobeRotation = () => {
          if (rotationIntervalRef.current) return;
          rotationActive = true;
          rotationIntervalRef.current = setInterval(spinGlobe, 100);
        };

        const disableGlobeRotation = () => {
          rotationActive = false;
          if (rotationIntervalRef.current) {
            clearInterval(rotationIntervalRef.current);
            rotationIntervalRef.current = null;
          }
        };

        map.on('mousedown', () => { 
          userInteracting = true; 
          disableGlobeRotation();
        });
        
        map.on('dragstart', () => { 
          userInteracting = true; 
          disableGlobeRotation();
        });
        
        map.on('moveend', () => { 
          userInteracting = false;
        });

        map.once('load', () => {
          console.log('Map loaded, ready to draw plots');
          if (mounted) {
            setMapReady(true);
            
            enableGlobeRotation();
            setTimeout(() => {
              disableGlobeRotation();
              
              if (map.isStyleLoaded()) {
                drawPlots();
              } else {
                map.once('style.load', () => {
                  drawPlots();
                });
              }
            }, 1500);
          }
        });

        console.log('Mapbox map created successfully');

      } catch (error) {
        console.error('Error initializing Mapbox map:', error);
        if (mounted) setMapReady(true);
      }
    };

    const initTimer = setTimeout(() => {
      if (mounted) {
        initMap();
      }
    }, 200);

    return () => {
      mounted = false;
      if (initTimer) clearTimeout(initTimer);
      
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
        rotationIntervalRef.current = null;
      }
      
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.error('Error removing map:', e);
        }
        mapRef.current = null;
      }
      setMapReady(false);
    };
  }, [sharedPlots]);

  useEffect(() => {
    if (mapReady && mapRef.current && sharedPlots.length > 0) {
      console.log('Shared plots updated, redrawing...', sharedPlots.length);
      
      setTimeout(() => {
        if (mapRef.current && mapReady) {
          const map = mapRef.current;
          if (map.isStyleLoaded()) {
            drawPlots();
            console.log('Plots redrawn successfully');
          } else {
            map.once('style.load', () => {
              drawPlots();
              console.log('Plots redrawn successfully after style load');
            });
          }
        }
      }, 100);
    }
  }, [sharedPlots, mapReady]);

  useEffect(() => {
    if (mapReady && mapRef.current && globalTileUrls) {
      const map = mapRef.current;
      if (map.isStyleLoaded()) {
        addGlobalLayers();
      } else {
        map.once('style.load', () => {
          addGlobalLayers();
        });
      }
    }
  }, [mapReady, globalTileUrls]);

  const fetchSharedPlots = async () => {
    try {
      setLoading(true);
      const response = await requestService.getSharedPlots(requestId);
      console.log('Fetched shared plots:', response.plots);
      setSharedPlots(response.plots || []);
      setRequestInfo(response.request || null);
    } catch (error) {
      console.error('Error fetching shared plots:', error);
      toast.error('Failed to load shared plots');
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalTileUrls = async () => {
    try {
      setLayersLoading(true);
      const tileUrls = await landPlotService.getGlobalDeforestationTiles();
      console.log('Loaded tile URLs:', tileUrls);
      setGlobalTileUrls(tileUrls);
    } catch (error) {
      console.error('Error loading tile URLs:', error);
      setGlobalTileUrls(null);
    } finally {
      setLayersLoading(false);
    }
  };

  const drawPlots = () => {
    const map = mapRef.current;
    if (!map || !mapReady) {
      console.log('Map not ready for drawing');
      return;
    }

    if (!map.isStyleLoaded()) {
      console.log('Style not loaded, waiting...');
      map.once('styledata', drawPlots);
      return;
    }

    console.log('Drawing plots...', sharedPlots.length);
    console.log('All plots data:', JSON.stringify(sharedPlots, null, 2));

    const layersToRemove = ['plots-polygons-fill', 'plots-polygons-outline', 'plots-points', 'plots-labels', 'polygon-center-markers', 'polygon-center-labels'];
    const sourcesToRemove = ['plots-source', 'polygon-centers'];

    // Remove existing layers
    layersToRemove.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });

    // Remove existing sources
    sourcesToRemove.forEach(sourceId => {
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    });

    const features = [];
    const bounds = new window.mapboxgl.LngLatBounds();
    let hasPoints = false;
    let hasPolygons = false;

    sharedPlots.forEach((plot, index) => {
      console.log(`\n=== Processing Plot ${index + 1}: ${plot.plot_id} ===`);
      let coordinates = [];

      // Method 1: Direct coordinates field
      try {
        if (plot.coordinates) {
          const parsed = typeof plot.coordinates === 'string'
            ? JSON.parse(plot.coordinates)
            : plot.coordinates;
          
          console.log('Parsed coordinates:', parsed);
          console.log('Coordinates type:', typeof parsed, 'Is array:', Array.isArray(parsed));
          console.log('Coordinates length:', parsed?.length);
          
          if (Array.isArray(parsed)) {
            // Check if it's a simple array of coordinate pairs [[lng, lat], [lng, lat], ...]
            if (parsed.length > 0 && Array.isArray(parsed[0]) && typeof parsed[0][0] === 'number') {
              coordinates = parsed;
              console.log('Format: Direct array of coordinate pairs');
            }
            // Check if it's triple-nested (GeoJSON Polygon format) [[[lng, lat], ...]]
            else if (parsed.length > 0 && Array.isArray(parsed[0]) && Array.isArray(parsed[0][0])) {
              coordinates = parsed[0];
              console.log('Format: Triple-nested (GeoJSON Polygon)');
            }
          }
        }
      } catch (e) {
        console.error('Error parsing coordinates field:', e);
      }

      // Method 2: GeoJSON field
      if (coordinates.length === 0 && plot.geojson) {
        console.log('Trying geojson field:', plot.geojson);
        console.log('GeoJSON type:', plot.geojson.type);
        console.log('GeoJSON coordinates:', plot.geojson.coordinates);
        
        if (plot.geojson.type === 'Point') {
          coordinates = [plot.geojson.coordinates];
          console.log('Format: GeoJSON Point');
        } 
        else if (plot.geojson.type === 'Polygon') {
          coordinates = plot.geojson.coordinates[0];
          console.log('Format: GeoJSON Polygon, outer ring');
        }
        else if (plot.geojson.type === 'MultiPolygon') {
          coordinates = plot.geojson.coordinates[0][0];
          console.log('Format: GeoJSON MultiPolygon');
        }
        else if (Array.isArray(plot.geojson.coordinates)) {
          if (Array.isArray(plot.geojson.coordinates[0]) && Array.isArray(plot.geojson.coordinates[0][0])) {
            coordinates = plot.geojson.coordinates[0];
            console.log('Format: Generic triple-nested array');
          } else if (Array.isArray(plot.geojson.coordinates[0])) {
            coordinates = plot.geojson.coordinates;
            console.log('Format: Generic double-nested array');
          }
        }
      }

      // Method 3: Individual lat/lng fields
      if (
        coordinates.length === 0 &&
        plot.longitude !== null &&
        plot.longitude !== undefined &&
        plot.latitude !== null &&
        plot.latitude !== undefined
      ) {
        coordinates = [[plot.longitude, plot.latitude]];
        console.log('Format: Individual lat/lng fields');
      }

      console.log('Final coordinates count:', coordinates.length);
      console.log('First few coordinates:', coordinates.slice(0, 3));

      if (coordinates.length === 0) {
        console.warn(`❌ SKIPPING Plot ${plot.plot_id} - No valid coordinates found`);
        console.log('Plot data:', JSON.stringify(plot, null, 2));
        return;
      }

      // Validate coordinates
      const validCoordinates = coordinates.filter(coord => {
        if (!Array.isArray(coord) || coord.length < 2) {
          console.warn('Invalid coordinate format:', coord);
          return false;
        }
        const [lng, lat] = coord;
        if (typeof lng !== 'number' || typeof lat !== 'number') {
          console.warn('Non-numeric coordinates:', coord);
          return false;
        }
        if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
          console.warn('Coordinates out of range:', coord);
          return false;
        }
        return true;
      });

      if (validCoordinates.length === 0) {
        console.warn(`❌ SKIPPING Plot ${plot.plot_id} - No valid coordinates after validation`);
        return;
      }

      if (validCoordinates.length !== coordinates.length) {
        console.warn(`⚠️ Filtered ${coordinates.length - validCoordinates.length} invalid coordinates`);
      }

      coordinates = validCoordinates;

      // KEY FIX: A polygon needs at least 3 points (forming a closed ring requires 4 with the duplicate)
      // A single point is just that - one coordinate
      const isSinglePoint = coordinates.length === 1;
      const hasDef = plot.deforestation_percentage !== null && plot.deforestation_percentage !== undefined;

      const properties = {
        plot_id: plot.plot_id || plot.id,
        plot_name: plot.plot_name || plot.name || 'Unnamed Plot',
        country: plot.country || 'Unknown',
        products: (plot.products || plot.commodities || []).join?.(', ') || (plot.commodities || 'None'),
        area: plot.area || 0,
        has_deforestation: hasDef,
        deforestation_percentage: hasDef ? plot.deforestation_percentage : null,
        deforested_area: hasDef ? plot.deforested_area : null,
        is_point: isSinglePoint
      };

      if (isSinglePoint) {
        hasPoints = true;
        const [lng, lat] = coordinates[0];
        console.log(`✅ Adding POINT for ${plot.plot_id} at [${lng}, ${lat}]`);
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          properties
        });
        bounds.extend([lng, lat]);
      } else {
        // This is a polygon with multiple points
        hasPolygons = true;
        console.log(`✅ Adding POLYGON for ${plot.plot_id} with ${coordinates.length} points`);
        
        // Ensure the polygon is closed (first point = last point)
        const firstCoord = coordinates[0];
        const lastCoord = coordinates[coordinates.length - 1];
        if (firstCoord[0] !== lastCoord[0] || firstCoord[1] !== lastCoord[1]) {
          console.log('Closing polygon ring');
          coordinates.push([...firstCoord]);
        }
        
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coordinates] // Polygon coordinates must be wrapped in an array
          },
          properties
        });
        
        // Add all coordinates to bounds
        coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
      }
    });

    console.log(`\n=== SUMMARY ===`);
    console.log(`Total features created: ${features.length}`);
    console.log(`Has points: ${hasPoints}`);
    console.log(`Has polygons: ${hasPolygons}`);
    console.log('Features:', JSON.stringify(features, null, 2));

    if (features.length === 0) {
      console.error('❌ No valid features to draw!');
      toast.error('No valid plot coordinates found');
      return;
    }

    // Add the GeoJSON source
    map.addSource('plots-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features
      }
    });

    // Add polygon fill layer - LOW OPACITY
    map.addLayer({
      id: 'plots-polygons-fill',
      type: 'fill',
      source: 'plots-source',
      filter: ['!=', ['get', 'is_point'], true],
      paint: {
        'fill-color': '#4A90E2', // Blue color
        'fill-opacity': 0.15 // Very low opacity (15%)
      }
    });

    console.log('✅ Polygon fill layer added');

    // Add polygon outline layer - BLUE BORDER
    map.addLayer({
      id: 'plots-polygons-outline',
      type: 'line',
      source: 'plots-source',
      filter: ['!=', ['get', 'is_point'], true],
      paint: {
        'line-color': '#1E5BA8', // Dark blue border
        'line-width': 4, // Thick border
        'line-opacity': 1.0 // Full opacity
      }
    });

    console.log('✅ Polygon outline layer added');

    // Add points layer - ALL BLUE
    map.addLayer({
      id: 'plots-points',
      type: 'circle',
      source: 'plots-source',
      filter: ['==', ['get', 'is_point'], true],
      paint: {
        'circle-radius': 10,
        'circle-color': '#4A90E2', // Blue color
        'circle-stroke-color': '#1E5BA8', // Darker blue border
        'circle-stroke-width': 3,
        'circle-opacity': 0.9
      }
    });

    console.log('✅ Points layer added');

    // ADD CENTER MARKERS FOR POLYGONS to make them visible when zoomed out
    const polygonCenters = features
      .filter(f => f.geometry.type === 'Polygon')
      .map(f => {
        const coords = f.geometry.coordinates[0];
        const lngs = coords.map(c => c[0]);
        const lats = coords.map(c => c[1]);
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [centerLng, centerLat]
          },
          properties: f.properties
        };
      });

    if (polygonCenters.length > 0) {
      map.addSource('polygon-centers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: polygonCenters
        }
      });

      // Add marker for polygon centers (visible when zoomed out) - ALL BLUE
      map.addLayer({
        id: 'polygon-center-markers',
        type: 'circle',
        source: 'polygon-centers',
        paint: {
          'circle-radius': 12,
          'circle-color': '#4A90E2', // Blue color
          'circle-stroke-color': '#ffffff', // White border
          'circle-stroke-width': 3,
          'circle-opacity': 0.9
        }
      });

      console.log('✅ Polygon center markers added:', polygonCenters.length);
    }

    // Add labels layer for ALL features (both points and polygon centers)
    map.addLayer({
      id: 'plots-labels',
      type: 'symbol',
      source: 'plots-source',
      layout: {
        'text-field': ['get', 'plot_id'], // Use plot_name instead of plot_id
        'text-size': 14,
        'text-offset': [0, -2],
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#ffffff',
        'text-halo-color': '#000000',
        'text-halo-width': 2
      }
    });

    console.log('✅ Labels layer added');

    // Add labels for polygon center markers
    if (polygonCenters.length > 0) {
      map.addLayer({
        id: 'polygon-center-labels',
        type: 'symbol',
        source: 'polygon-centers',
        layout: {
          'text-field': ['get', 'plot_id'], // Use plot_name for polygon centers
          'text-size': 14,
          'text-offset': [0, -2],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 2
        }
      });

      console.log('✅ Polygon center labels added');
    }

    // Add hover (mousemove) handlers to show popup on hover
    ['plots-polygons-fill', 'plots-points', 'polygon-center-markers'].forEach(layerId => {
      map.on('mousemove', layerId, (e) => {
        if (e.features && e.features.length > 0) {
          const props = e.features[0].properties;
          
          let popupContent = `
            <div style="font-size:14px; min-width: 200px;">
              <strong style="color:#2E7D32;font-size:16px">${props.plot_id}</strong><br/>
              <strong>${props.plot_name}</strong><br/>
              Country: ${props.country}<br/>
              Products: ${props.products}<br/>
              Area: ${props.area} hectares
          `;

          if (props.has_deforestation) {
            popupContent += `
              <br/><span style="color:#D32F2F">
                Deforestation: ${Number(props.deforestation_percentage).toFixed(1)}%<br/>
                Deforested Area: ${Number(props.deforested_area).toFixed(2)} ha
              </span>
            `;
          }

          popupContent += '</div>';

          if (popupRef.current) {
            popupRef.current
              .setLngLat(e.lngLat)
              .setHTML(popupContent)
              .addTo(map);
          }
        }
      });

      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) {
          popupRef.current.remove();
        }
      });

      // Add click handler to zoom to the plot
      map.on('click', layerId, (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          
          // Close popup on click
          if (popupRef.current) {
            popupRef.current.remove();
          }

          // Find the original feature to get full geometry
          const plotId = feature.properties.plot_id;
          const originalFeature = features.find(f => f.properties.plot_id === plotId);
          
          if (originalFeature) {
            const geom = originalFeature.geometry;
            
            if (geom.type === 'Point') {
              // For points, zoom to the point
              map.flyTo({
                center: geom.coordinates,
                zoom: 15,
                duration: 1500,
                essential: true
              });
            } else if (geom.type === 'Polygon') {
              // For polygons, fit to the polygon bounds
              const polygonBounds = new window.mapboxgl.LngLatBounds();
              geom.coordinates[0].forEach(coord => {
                polygonBounds.extend(coord);
              });
              
              map.fitBounds(polygonBounds, {
                padding: 100,
                maxZoom: 18,
                duration: 1500,
                essential: true
              });
            }
          }
        }
      });

      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
    });

    // Fit the map to show all plots
    if (!bounds.isEmpty()) {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
        rotationIntervalRef.current = null;
      }

      const fitOptions = {
        padding: {
          top: 100,
          bottom: 100,
          left: 100,
          right: 100
        },
        duration: 2000,
        essential: true
      };

      // Adjust zoom based on content type
      if (hasPoints && !hasPolygons) {
        // Only points - zoom in more
        fitOptions.maxZoom = 10;
      } else if (hasPolygons && !hasPoints) {
        // Only polygons - allow closer zoom
        fitOptions.maxZoom = 16;
      } else {
        // Mixed content - moderate zoom
        fitOptions.maxZoom = 14;
      }

      console.log('Fitting bounds:', bounds, fitOptions);
      map.fitBounds(bounds, fitOptions);
      
      // ZOOM TO FIRST POLYGON after fitting bounds if we have polygons
      if (hasPolygons && features.length > 0) {
        setTimeout(() => {
          const firstPolygon = features.find(f => f.geometry.type === 'Polygon');
          if (firstPolygon) {
            const polygonBounds = new window.mapboxgl.LngLatBounds();
            firstPolygon.geometry.coordinates[0].forEach(coord => {
              polygonBounds.extend(coord);
            });
            console.log('Zooming to first polygon after initial fit');
            // Uncomment below to auto-zoom to the first polygon
            // map.fitBounds(polygonBounds, { padding: 50, maxZoom: 16, duration: 1500 });
          }
        }, 2500);
      }
    }

    console.log('✅ Plots drawn successfully');
  };
  const addGlobalLayers = () => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    console.log('Adding global layers...');

    if (map.getLayer('tree-cover')) map.removeLayer('tree-cover');
    if (map.getLayer('deforestation')) map.removeLayer('deforestation');
    if (map.getSource('tree-cover-source')) map.removeSource('tree-cover-source');
    if (map.getSource('deforestation-source')) map.removeSource('deforestation-source');

    if (globalTileUrls?.global_tree_cover_url) {
      map.addSource('tree-cover-source', {
        type: 'raster',
        tiles: [globalTileUrls.global_tree_cover_url],
        tileSize: 256
      });

      map.addLayer({
        id: 'tree-cover',
        type: 'raster',
        source: 'tree-cover-source',
        paint: {
          'raster-opacity': 0.7
        },
        layout: {
          visibility: 'none'
        }
      }, 'plots-polygons-fill');

      console.log('Tree cover layer added');
    }

    if (globalTileUrls?.global_deforestation_url) {
      map.addSource('deforestation-source', {
        type: 'raster',
        tiles: [globalTileUrls.global_deforestation_url],
        tileSize: 256
      });

      map.addLayer({
        id: 'deforestation',
        type: 'raster',
        source: 'deforestation-source',
        paint: {
          'raster-opacity': 0.8
        },
        layout: {
          visibility: 'none'
        }
      }, 'plots-polygons-fill');

      console.log('Deforestation layer added');
    }

    // Add layer control
    addLayerControl();
    console.log('Global layers added with control');
  };

  const addLayerControl = () => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing control if present
    const existing = document.getElementById('layer-control');
    if (existing) existing.remove();

    // Create custom layer control
    const layerControl = document.createElement('div');
    layerControl.id = 'layer-control';
    layerControl.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    layerControl.style.cssText = `
      background: white;
      padding: 10px;
      font-family: Arial, sans-serif;
      font-size: 13px;
      max-width: 200px;
    `;

    layerControl.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; color: #333;">Map Layers</div>
      <label style="display: flex; align-items: center; margin-bottom: 6px; cursor: pointer;">
        <input type="checkbox" id="tree-cover-toggle" style="margin-right: 8px;">
        <span>🌳 Forest Cover 2000</span>
      </label>
      <label style="display: flex; align-items: center; cursor: pointer;">
        <input type="checkbox" id="deforestation-toggle" style="margin-right: 8px;">
        <span>🔥 Forest Loss (2021-2024)</span>
      </label>
    `;

    // Add toggle functionality
    const treeCoverToggle = layerControl.querySelector('#tree-cover-toggle');
    const deforestationToggle = layerControl.querySelector('#deforestation-toggle');

    treeCoverToggle.addEventListener('change', (e) => {
      const visibility = e.target.checked ? 'visible' : 'none';
      map.setLayoutProperty('tree-cover', 'visibility', visibility);
      console.log('Tree cover visibility:', visibility);
    });

    deforestationToggle.addEventListener('change', (e) => {
      const visibility = e.target.checked ? 'visible' : 'none';
      map.setLayoutProperty('deforestation', 'visibility', visibility);
      console.log('Deforestation visibility:', visibility);
    });

    // Add to map container
    mapContainerRef.current.appendChild(layerControl);

    // Position it
    layerControl.style.position = 'absolute';
    layerControl.style.top = '10px';
    layerControl.style.left = '10px';
    layerControl.style.zIndex = '1';
  };

  useEffect(() => {
    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
        rotationIntervalRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  const backDestination = locationState?.source === 'risk-dashboard' ? '/risk-dashboard' : '/requests';
  const backLabel = locationState?.source === 'risk-dashboard' ? 'Back to Risk Dashboard' : 'Back to Requests';

  if (!requestInfo) {
    return (
      <Box p={3}>
        <Alert severity="error">Request not found</Alert>
        <Button onClick={() => navigate(backDestination)} sx={{ mt: 2 }}>
          {backLabel}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(backDestination)} sx={{ mr: 2 }}>
          {backLabel}
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Shared Land Plots - {requestInfo.supplier_name || requestInfo.id}
        </Typography>
      </Box>

      {sharedPlots.length === 0 ? (
        <Alert severity="info">No land plots have been shared for this request</Alert>
      ) : (
        <>
          <Paper sx={{ height: 600, mb: 3, position: 'relative' }}>
            <div
              ref={mapContainerRef}
              style={{
                height: '100%',
                width: '100%',
                minHeight: '600px',
                backgroundColor: '#000'
              }}
            />

            {!mapReady && (
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000
              }}>
                <CircularProgress sx={{ color: '#fff' }} />
              </Box>
            )}

            {layersLoading && (
              <Box sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                padding: 1.5,
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 1,
                zIndex: 1000
              }}>
                <Typography variant="body2">Loading Earth Engine layers...</Typography>
              </Box>
            )}
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plot ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Area (ha)</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Deforestation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sharedPlots.map((plot) => {
                  const hasDef = plot.deforestation_percentage != null;

                  return (
                    <TableRow key={plot.id}>
                      <TableCell>{plot.plot_id}</TableCell>
                      <TableCell>{plot.plot_name}</TableCell>
                      <TableCell>{plot.country}</TableCell>
                      <TableCell>{plot.area}</TableCell>
                      <TableCell>
                        {Array.isArray(plot.commodities)
                          ? plot.commodities.join(', ')
                          : plot.commodities || ''}
                      </TableCell>
                      <TableCell>
                        {hasDef ? (
                          <Chip
                            label={`${plot.deforestation_percentage.toFixed(1)}%`}
                            color={plot.deforestation_percentage > 0 ? 'error' : 'success'}
                            size="small"
                          />
                        ) : (
                          <Chip label="—" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default SharedPlotsMap;
