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
  Box, Paper, Typography, Button, CircularProgress, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Fade, useTheme, Checkbox
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Layers as LayersIcon } from '@mui/icons-material';
import { requestService } from '../services/requestService';
import { landPlotService } from '../services/landPlotService';
import { toast } from 'react-toastify';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZmFpcmNvZGVsYWIiLCJhIjoiY21pMzAzNDh4MHUzNTJrc2ZkNHdvdWowZCJ9.ctPB8FDsIjXa3MgFt4GVyA';

const SharedPlotsMap = () => {
  const theme = useTheme();
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
  
  // Layer Toggles
  const [showTreeCover, setShowTreeCover] = useState(false);
  const [showDeforestation, setShowDeforestation] = useState(false);

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
    // eslint-disable-next-line
  }, [requestId, locationState]);

  // Map Init
  useEffect(() => {
    if (sharedPlots.length === 0) return;
    let mounted = true;

    const initMap = async () => {
      try {
        // Wait for container
        let attempts = 0;
        while (!mapContainerRef.current && mounted && attempts < 20) {
          await new Promise(r => setTimeout(r, 100));
          attempts++;
        }
        if (!mapContainerRef.current) {
            if (mounted) setMapReady(true);
            return;
        }

        // Load Mapbox
        if (!window.mapboxgl) {
          try {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
            document.head.appendChild(link);
            await new Promise((resolve) => {
                const s = document.createElement('script');
                s.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
                s.onload = resolve;
                document.body.appendChild(s);
            });
          } catch (e) { console.error(e); }
        }

        if (!mounted || !mapContainerRef.current) return;
        if (mapRef.current) mapRef.current.remove();

        mapContainerRef.current.innerHTML = '';
        window.mapboxgl.accessToken = MAPBOX_TOKEN;

        const map = new window.mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/satellite-streets-v12',
          projection: 'globe',
          center: [0, 20],
          zoom: 1.5,
          attributionControl: false
        });

        if (!mounted) return;
        mapRef.current = map;
        popupRef.current = new window.mapboxgl.Popup({ closeButton: true, closeOnClick: false });

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

        // Globe Rotation
        const spinGlobe = () => {
            if (map.getZoom() < 5) {
                const center = map.getCenter();
                center.lng -= 0.2;
                map.easeTo({ center, duration: 100, easing: n => n });
            }
        };
        
        const enableGlobeRotation = () => {
            if (rotationIntervalRef.current) return;
            rotationIntervalRef.current = setInterval(spinGlobe, 100);
        };

        const stopSpin = () => {
            if (rotationIntervalRef.current) {
                clearInterval(rotationIntervalRef.current);
                rotationIntervalRef.current = null;
            }
        };

        ['mousedown', 'dragstart'].forEach(ev => map.on(ev, stopSpin));

        map.once('load', () => {
          if (mounted) {
            setMapReady(true);
            enableGlobeRotation();
            setTimeout(() => {
                stopSpin();
                if (map.isStyleLoaded()) drawPlots();
                else map.once('style.load', drawPlots);
            }, 1500);
          }
        });

      } catch (error) {
        console.error('Map init error:', error);
        if (mounted) setMapReady(true);
      }
    };

    const timer = setTimeout(() => { if (mounted) initMap(); }, 200);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      setMapReady(false);
    };
    // eslint-disable-next-line
  }, [sharedPlots]);

  // Redraw trigger
  useEffect(() => {
    if (mapReady && mapRef.current && sharedPlots.length > 0) {
      const map = mapRef.current;
      if (map.isStyleLoaded()) drawPlots();
      else map.once('style.load', drawPlots);
    }
    // eslint-disable-next-line
  }, [sharedPlots, mapReady]);

  // Global Layers
  useEffect(() => {
    if (mapReady && mapRef.current && globalTileUrls) {
        const map = mapRef.current;
        if (map.isStyleLoaded()) updateGlobalLayers();
        else map.once('style.load', updateGlobalLayers);
    }
    // eslint-disable-next-line
  }, [mapReady, globalTileUrls, showTreeCover, showDeforestation]);

  const fetchSharedPlots = async () => {
    try {
      setLoading(true);
      const response = await requestService.getSharedPlots(requestId);
      setSharedPlots(response.plots || []);
      setRequestInfo(response.request || null);
    } catch (error) {
      toast.error('Failed to load shared plots');
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalTileUrls = async () => {
    try {
      setLayersLoading(true);
      const tileUrls = await landPlotService.getGlobalDeforestationTiles();
      setGlobalTileUrls(tileUrls);
    } catch (error) {
      setGlobalTileUrls(null);
    } finally {
      setLayersLoading(false);
    }
  };

  const drawPlots = () => {
    const map = mapRef.current;
    if (!map || !mapReady || !map.isStyleLoaded()) return;

    // Cleanup
    ['plots-polygons-fill', 'plots-polygons-outline', 'plots-points', 'plots-labels', 'polygon-center-markers', 'polygon-center-labels'].forEach(id => { if (map.getLayer(id)) map.removeLayer(id); });
    ['plots-source', 'polygon-centers'].forEach(id => { if (map.getSource(id)) map.removeSource(id); });

    const features = [];
    const bounds = new window.mapboxgl.LngLatBounds();
    
    sharedPlots.forEach(plot => {
      let coordinates = [];
      try {
        const raw = plot.coordinates || plot.geojson?.coordinates;
        if (typeof raw === 'string') coordinates = JSON.parse(raw);
        else coordinates = raw;
        
        // Normalize coordinate structure
        if (Array.isArray(coordinates)) {
            // Handle different nesting levels
            if (coordinates.length > 0 && typeof coordinates[0][0] === 'number') { /* Point or Line */ }
            else if (coordinates.length > 0 && Array.isArray(coordinates[0]) && typeof coordinates[0][0][0] === 'number') coordinates = coordinates[0]; // Polygon outer ring
        }
      } catch (e) { return; }

      if (!coordinates || coordinates.length === 0) return;

      const isSinglePoint = coordinates.length === 1 || (typeof coordinates[0] === 'number'); // Simple heuristic
      const props = {
        plot_id: plot.plot_id,
        plot_name: plot.plot_name || 'Unnamed',
        country: plot.country,
        area: plot.area,
        is_point: isSinglePoint,
        has_deforestation: plot.deforestation_percentage != null,
        def_pct: plot.deforestation_percentage,
        products: Array.isArray(plot.commodities) ? plot.commodities.join(', ') : (plot.commodities || '')
      };

      if (isSinglePoint) {
        const [lng, lat] = (typeof coordinates[0] === 'number') ? coordinates : coordinates[0];
        
        // Add Point Feature
        features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] }, properties: props });
        bounds.extend([lng, lat]);
      } else {
        // Ensure closed loop for Polygon
        if (coordinates[0][0] !== coordinates[coordinates.length-1][0]) coordinates.push(coordinates[0]);
        
        // Add Polygon Feature
        features.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [coordinates] }, properties: props });
        coordinates.forEach(c => bounds.extend(c));

        // RESTORED LOGIC: Calculate Centroid and Add Point Feature
        // This ensures every polygon has a visible, clickable point marker
        let lngSum = 0, latSum = 0;
        coordinates.forEach(([l, t]) => { lngSum += l; latSum += t; });
        const centerLng = lngSum / coordinates.length;
        const centerLat = latSum / coordinates.length;

        features.push({ 
            type: 'Feature', 
            geometry: { type: 'Point', coordinates: [centerLng, centerLat] }, 
            properties: { ...props, is_center: true } // Mark as center if needed for specific styling
        });
      }
    });

    if (features.length === 0) return;

    map.addSource('plots-source', { type: 'geojson', data: { type: 'FeatureCollection', features } });

    // Polygons Layer
    map.addLayer({
        id: 'plots-polygons-fill', type: 'fill', source: 'plots-source',
        filter: ['==', '$type', 'Polygon'], // Only Polygons
        paint: { 'fill-color': '#4A90E2', 'fill-opacity': 0.15 }
    });
    map.addLayer({
        id: 'plots-polygons-outline', type: 'line', source: 'plots-source',
        filter: ['==', '$type', 'Polygon'], // Only Polygons
        paint: { 'line-color': '#1E5BA8', 'line-width': 3, 'line-opacity': 1 }
    });

    // Points Layer (catches single points AND polygon centers)
    map.addLayer({
        id: 'plots-points', type: 'circle', source: 'plots-source',
        filter: ['==', '$type', 'Point'], // Only Points
        paint: { 
            'circle-radius': 8, 
            'circle-color': '#4A90E2', 
            'circle-stroke-color': '#1E5BA8', 
            'circle-stroke-width': 2 
        }
    });

    // Labels Layer
    map.addLayer({
        id: 'plots-labels', type: 'symbol', source: 'plots-source',
        filter: ['==', '$type', 'Point'], // Attach labels to points
        layout: { 
            'text-field': ['get', 'plot_id'], 
            'text-size': 12, 
            'text-offset': [0, -1.5], 
            'text-anchor': 'top' 
        },
        paint: { 
            'text-color': '#ffffff', 
            'text-halo-color': '#000000', 
            'text-halo-width': 1 
        }
    });

    // Interactions
    ['plots-polygons-fill', 'plots-points'].forEach(layer => {
        map.on('mouseenter', layer, () => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave', layer, () => {
            map.getCanvas().style.cursor = '';
            popupRef.current?.remove();
        });
        map.on('mousemove', layer, (e) => {
            if(!e.features.length) return;
            const p = e.features[0].properties;
            const html = `
                <div style="font-family:sans-serif; font-size:13px; color:#333">
                    <strong style="color:#1E5BA8">${p.plot_name}</strong><br/>
                    ID: ${p.plot_id}<br/>
                    ${p.area} ha • ${p.country}<br/>
                    ${p.has_deforestation ? `<strong style="color:#d32f2f">Deforestation: ${Number(p.def_pct).toFixed(1)}%</strong>` : ''}
                </div>
            `;
            popupRef.current.setLngLat(e.lngLat).setHTML(html).addTo(map);
        });
        
        // Updated: Zoom Logic on Click
        map.on('click', layer, (e) => {
            if (!e.features.length) return;
            const geom = e.features[0].geometry;
            
            if (geom.type === 'Point') {
                // If point, fly to it directly
                map.flyTo({ center: geom.coordinates, zoom: 15, duration: 1500 });
            } else {
                // If polygon, fit bounds
                const b = new window.mapboxgl.LngLatBounds();
                geom.coordinates[0].forEach(c => b.extend(c));
                map.fitBounds(b, { padding: 100, maxZoom: 16 });
            }
        });
    });

    if (!bounds.isEmpty()) {
        if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
        map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 2000 });
    }
  };

  const updateGlobalLayers = () => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing
    if (map.getLayer('tree-cover')) map.removeLayer('tree-cover');
    if (map.getSource('tree-cover-src')) map.removeSource('tree-cover-src');
    if (map.getLayer('deforestation')) map.removeLayer('deforestation');
    if (map.getSource('deforestation-src')) map.removeSource('deforestation-src');

    if (showTreeCover && globalTileUrls?.global_tree_cover_url) {
        map.addSource('tree-cover-src', { type: 'raster', tiles: [globalTileUrls.global_tree_cover_url], tileSize: 256 });
        map.addLayer({ id: 'tree-cover', type: 'raster', source: 'tree-cover-src', paint: { 'raster-opacity': 0.6 } }, 'plots-polygons-fill');
    }

    if (showDeforestation && globalTileUrls?.global_deforestation_url) {
        map.addSource('deforestation-src', { type: 'raster', tiles: [globalTileUrls.global_deforestation_url], tileSize: 256 });
        map.addLayer({ id: 'deforestation', type: 'raster', source: 'deforestation-src', paint: { 'raster-opacity': 0.8 } }, 'plots-polygons-fill');
    }
  };

  if (loading || !requestInfo) return <Box display="flex" justifyContent="center" p={10}><CircularProgress /></Box>;

  const backDestination = locationState?.source === 'risk-dashboard' ? '/risk-dashboard' : '/requests';
  const backLabel = locationState?.source === 'risk-dashboard' ? 'Back to Risk Dashboard' : 'Back to Requests';

  return (
    <Fade in={true}>
      <Box>
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate(backDestination)} 
                    sx={{ mb: 1, color: 'text.secondary', textTransform: 'none' }}
                >
                    {backLabel}
                </Button>
                <Typography 
                    variant="h4" fontWeight={800} 
                    sx={{ background: 'linear-gradient(45deg, #2E3B55 30%, #6a5acd 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                    Shared Plots: {requestInfo.supplier_name || requestInfo.id}
                </Typography>
            </Box>
        </Box>

        {sharedPlots.length === 0 ? (
            <Alert severity="info">No land plots shared.</Alert>
        ) : (
            <>
                {/* MAP */}
                <Paper elevation={0} sx={{ height: 600, mb: 3, position: 'relative', borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'rgb(11, 11, 25)' }}>
                    <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
                    
                    {/* Loading Overlay */}
                    {(!mapReady) && (
                        <Box position="absolute" top={0} left={0} width="100%" height="100%" display="flex" alignItems="center" justifyContent="center" sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', zIndex: 10 }}>
                            <CircularProgress color="inherit" />
                        </Box>
                    )}

                    {/* Layer Control */}
                    <Paper sx={{ position: 'absolute', top: 16, left: 16, p: 2, zIndex: 5, borderRadius: 3, maxWidth: 220 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <LayersIcon fontSize="small" color="primary" />
                            <Typography variant="subtitle2" fontWeight={700}>Layers</Typography>
                        </Box>
                        {layersLoading ? <Typography variant="caption">Loading layers...</Typography> : (
                            <Box display="flex" flexDirection="column">
                                <Box display="flex" alignItems="center" mb={0.5}>
                                    <Checkbox size="small" checked={showTreeCover} onChange={e => setShowTreeCover(e.target.checked)} />
                                    <Typography variant="body2">🌳 Forest Cover</Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Checkbox size="small" checked={showDeforestation} onChange={e => setShowDeforestation(e.target.checked)} />
                                    <Typography variant="body2">🔥 Deforestation</Typography>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Paper>

                {/* TABLE */}
                <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: 'background.neutral' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, pl: 4 }}>Plot ID</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Area (ha)</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Products</TableCell>
                                    <TableCell sx={{ fontWeight: 600, pr: 4 }}>Deforestation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sharedPlots.map(plot => {
                                    const hasDef = plot.deforestation_percentage != null;
                                    return (
                                        <TableRow key={plot.id || Math.random()} hover>
                                            <TableCell sx={{ pl: 4, fontWeight: 500 }}>{plot.plot_id}</TableCell>
                                            <TableCell>{plot.plot_name}</TableCell>
                                            <TableCell>{plot.country}</TableCell>
                                            <TableCell>{plot.area}</TableCell>
                                            <TableCell>
                                                {(Array.isArray(plot.commodities) ? plot.commodities : (plot.commodities || '').split(','))
                                                    .filter(Boolean).map((c, i) => <Chip key={i} label={c} size="small" sx={{ mr: 0.5 }} />)
                                                }
                                            </TableCell>
                                            <TableCell sx={{ pr: 4 }}>
                                                {hasDef ? (
                                                    <Chip 
                                                        label={`${plot.deforestation_percentage.toFixed(1)}%`} 
                                                        color={plot.deforestation_percentage > 0 ? 'error' : 'success'} 
                                                        size="small" sx={{ fontWeight: 600 }} 
                                                    />
                                                ) : <Typography variant="caption" color="text.secondary">N/A</Typography>}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </>
        )}
      </Box>
    </Fade>
  );
};

export default SharedPlotsMap;
