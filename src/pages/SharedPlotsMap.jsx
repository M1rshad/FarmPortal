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
// import { toast } from 'react-toastify';

// const SharedPlotsMap = () => {
//   const { requestId } = useParams();
//   const navigate = useNavigate();
//   const mapContainerRef = useRef(null);
//   const leafletMapRef = useRef(null);

//   const [loading, setLoading] = useState(true);
//   const [sharedPlots, setSharedPlots] = useState([]);
//   const [requestInfo, setRequestInfo] = useState(null);

//   useEffect(() => {
//     fetchSharedPlots();
//   }, [requestId]);

//   useEffect(() => {
//     if (sharedPlots.length > 0) {
//       initializeMap();
//     }
//   }, [sharedPlots]);

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

//   const initializeMap = async () => {
//     if (!window.L) {
//       // Load Leaflet if not already loaded
//       await new Promise((resolve) => {
//         const script = document.createElement('script');
//         script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//         script.onload = resolve;
//         document.body.appendChild(script);
//       });

//       const link = document.createElement('link');
//       link.rel = 'stylesheet';
//       link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//       document.head.appendChild(link);
//     }

//     const L = window.L;

//     if (leafletMapRef.current) {
//       leafletMapRef.current.remove();
//     }

//     if (!mapContainerRef.current) return;

//     const map = L.map(mapContainerRef.current, {
//       center: [20, 0],
//       zoom: 2
//     });

//     // Add satellite tile layer
//     L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//       attribution: 'Tiles © Esri',
//       maxZoom: 18
//     }).addTo(map);

//     leafletMapRef.current = map;

//     // Add shared plots to map
//     const allBounds = [];
    
//     sharedPlots.forEach((plot) => {
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

//       const popupContent = `
//         <div>
//           <strong>${plot.plot_id}</strong><br/>
//           <strong>${plot.plot_name}</strong><br/>
//           Country: ${plot.country}<br/>
//           Area: ${plot.area} hectares<br/>
//           Products: ${Array.isArray(plot.commodities) ? plot.commodities.join(', ') : plot.commodities || ''}
//           ${plot.deforestation_percentage ? `<br/>Deforestation: ${plot.deforestation_percentage.toFixed(1)}%` : ''}
//         </div>
//       `;

//       if (isSinglePoint) {
//         const [lat, lng] = latLngs[0];
//         L.marker([lat, lng])
//           .addTo(map)
//           .bindPopup(popupContent);
//         allBounds.push([lat, lng]);
//       } else {
//         const polygon = L.polygon(latLngs, {
//           color: '#2E7D32',
//           fillColor: '#4CAF50',
//           fillOpacity: 0.5,
//           weight: 2
//         }).addTo(map);
        
//         polygon.bindPopup(popupContent);
//         allBounds.push(...latLngs);
//       }
//     });

//     // Fit map to show all plots
//     if (allBounds.length > 0) {
//       map.fitBounds(allBounds, { padding: [20, 20] });
//     }
//   };

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
//           {/* Map */}
//           <Paper sx={{ height: 500, mb: 3, position: 'relative' }}>
//             <div
//               ref={mapContainerRef}
//               style={{
//                 height: '100%',
//                 width: '100%',
//                 minHeight: '500px'
//               }}
//             />
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

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

/* ---------------- Visual helpers - Same as LandPlots ---------------- */
const DOT_MIN = 8;
const DOT_MAX = 18;
const dotRadiusForZoom = (z) => Math.max(DOT_MIN, Math.min(DOT_MAX, 6 + (z - 3) * 1.3));
const POINT_RING_METERS = 12;

const styles = {
  polygon: { color: '#2E7D32', fillColor: '#4CAF50', fillOpacity: 0.5, weight: 2 },
  polygonGlow: { color: '#66BB6A', weight: 6, opacity: 0.25 },
  pointDot: (z) => ({
    radius: dotRadiusForZoom(z),
    color: '#1E88E5',
    weight: 2,
    fillColor: '#90CAF9',
    fillOpacity: 1
  }),
  pointRing: { color: '#1E88E5', weight: 2, opacity: 0.8, fillOpacity: 0.05 }
};

function centroidLatLng(latlngs) {
  if (!latlngs?.length) return null;
  let latSum = 0, lngSum = 0;
  for (const [lat, lng] of latlngs) { latSum += lat; lngSum += lng; }
  const n = latlngs.length;
  return [latSum / n, lngSum / n];
}

const SharedPlotsMap = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const plotsLayerRef = useRef(null);
  const dotMarkersRef = useRef([]);
  const baseLayers = useRef({});
  const treeCoverLayerRef = useRef(null);
  const deforestationLayerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [sharedPlots, setSharedPlots] = useState([]);
  const [requestInfo, setRequestInfo] = useState(null);
  const [globalTileUrls, setGlobalTileUrls] = useState(null);
  const [layersLoading, setLayersLoading] = useState(false);

  useEffect(() => {
    fetchSharedPlots();
    loadGlobalTileUrls();
  }, [requestId]);

  useEffect(() => {
    if (sharedPlots.length > 0) {
      initializeMap();
    }
  }, [sharedPlots]);

  // Update layer control when tile URLs are loaded
  useEffect(() => {
    if (mapReady && leafletMapRef.current && globalTileUrls) {
      console.log('Setting up layer control with tile URLs:', globalTileUrls);
      setupLayerControl(leafletMapRef.current);
    }
  }, [mapReady, globalTileUrls]);

  const fetchSharedPlots = async () => {
    try {
      setLoading(true);
      const response = await requestService.getSharedPlots(requestId);
      setSharedPlots(response.plots || []);
      setRequestInfo(response.request || null);
    } catch (error) {
      console.error('Failed to fetch shared plots:', error);
      toast.error('Failed to load shared plots');
    } finally {
      setLoading(false);
    }
  };

  const loadGlobalTileUrls = async () => {
    try {
      setLayersLoading(true);
      console.log('Loading global tile URLs...');
      const tileUrls = await landPlotService.getGlobalDeforestationTiles();
      console.log('Tile URLs loaded:', tileUrls);
      setGlobalTileUrls(tileUrls);
    } catch (error) {
      console.error('Failed to load global tile URLs:', error);
      console.log('Earth Engine tiles not available - continuing without background layers');
      setGlobalTileUrls(null);
    } finally {
      setLayersLoading(false);
    }
  };

  const initializeMap = async () => {
    try {
      // Load Leaflet CSS if not already loaded
      if (!document.getElementById('leaflet-css')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.id = 'leaflet-css';
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
      }

      // Load Leaflet JS and wait for it to load
      if (!window.L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.id = 'leaflet-js';
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      const L = window.L;
      
      if (!L) {
        throw new Error('Leaflet failed to load');
      }

      // Clean up existing map
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      if (!mapContainerRef.current) return;
      mapContainerRef.current.innerHTML = '';

      // Define base layers - Same as LandPlots
      baseLayers.current = {
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18
        }),
        street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }),
        hybrid: L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '© Google'
        })
      };

      // Create map with satellite as default
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true,
        layers: [baseLayers.current.satellite]
      });

      leafletMapRef.current = map;

      // Create plots layer
      plotsLayerRef.current = L.layerGroup().addTo(map);
      dotMarkersRef.current = [];

      // Handle zoom events
      map.on('zoomend', () => {
        const z = map.getZoom();
        dotMarkersRef.current.forEach(marker => {
          if (marker.setStyle) {
            marker.setStyle({ radius: dotRadiusForZoom(z) });
          }
        });
      });

      setMapReady(true);

      setTimeout(() => {
        map.invalidateSize();
        drawPlots();
        setupInitialLayerControl(map);
      }, 100);

    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Failed to initialize map');
    }
  };

  // Setup layer control - Same as LandPlots
  const setupInitialLayerControl = (map) => {
    const L = window.L;
    
    const baseMaps = {
      "🛰️ Satellite": baseLayers.current.satellite,
      "🗺️ Street Map": baseLayers.current.street, 
      "🌍 Hybrid": baseLayers.current.hybrid
    };

    const overlayMaps = {
      "📍 Shared Plots": plotsLayerRef.current
    };

    map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
      position: 'topright',
      collapsed: false
    }).addTo(map);

    console.log('Initial layer control added');
  };

  const setupLayerControl = (map) => {
    const L = window.L;
    
    if (map.layerControlInstance) {
      map.removeControl(map.layerControlInstance);
      map.layerControlInstance = null;
    }

    const baseMaps = {
      "🛰️ Satellite": baseLayers.current.satellite,
      "🗺️ Street Map": baseLayers.current.street, 
      "🌍 Hybrid": baseLayers.current.hybrid
    };

    const overlayMaps = {
      "📍 Shared Plots": plotsLayerRef.current
    };

    // Add Earth Engine layers if available
    if (globalTileUrls && globalTileUrls.global_tree_cover_url && globalTileUrls.global_deforestation_url) {
      try {
        console.log('Creating Earth Engine layers...');
        
        if (!treeCoverLayerRef.current) {
          treeCoverLayerRef.current = L.tileLayer(globalTileUrls.global_tree_cover_url, {
            attribution: 'Hansen/UMD/Google/USGS/NASA',
            opacity: 0.7,
            maxZoom: 18
          });
          console.log('Tree cover layer created');
        }

        if (!deforestationLayerRef.current) {
          deforestationLayerRef.current = L.tileLayer(globalTileUrls.global_deforestation_url, {
            attribution: 'Hansen/UMD/Google/USGS/NASA', 
            opacity: 0.8,
            maxZoom: 18
          });
          console.log('Deforestation layer created');
        }

        overlayMaps["🌳 Forest Cover 2000"] = treeCoverLayerRef.current;
        overlayMaps["🔥 Forest Loss (2021-2024)"] = deforestationLayerRef.current;
        
        console.log('Earth Engine layers added to overlay maps');

      } catch (error) {
        console.error('Error creating Earth Engine layers:', error);
      }
    } else {
      console.log('Global tile URLs not available or incomplete:', globalTileUrls);
    }

    map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
      position: 'topright',
      collapsed: false
    }).addTo(map);

    console.log('Layer control updated with overlays:', Object.keys(overlayMaps));
  };

  // Draw plots with same styling as LandPlots
  function drawPlots() {
    const L = window.L;
    const map = leafletMapRef.current;
    const layer = plotsLayerRef.current;
    
    if (!L || !map || !layer || !mapReady) {
      console.log('Map not ready for plotting');
      return;
    }

    console.log('Drawing shared plots:', sharedPlots.length);

    layer.clearLayers();
    dotMarkersRef.current = [];

    const allBounds = [];

    sharedPlots.forEach(plot => {
      let coordinates = [];
      
      if (plot.coordinates) {
        try {
          coordinates = typeof plot.coordinates === 'string' 
            ? JSON.parse(plot.coordinates) 
            : plot.coordinates;
        } catch {
          coordinates = [];
        }
      }

      if (coordinates.length === 0) return;

      const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
      const isSinglePoint = latLngs.length === 1;

      const defText = plot.deforestation_percentage
        ? `<br/>Deforestation: ${plot.deforestation_percentage.toFixed(1)}%`
        : '';

      let productsDisplay = '';
      if (Array.isArray(plot.products)) {
        productsDisplay = plot.products.join(', ');
      } else if (Array.isArray(plot.commodities)) {
        productsDisplay = plot.commodities.join(', ');
      } else if (typeof plot.commodities === 'string') {
        productsDisplay = plot.commodities;
      }

      const popupHtml = `
        <div style="font-size:14px">
          <strong style="color:#2E7D32;font-size:16px">${plot.plot_id || plot.id}</strong><br/>
          <strong>${plot.plot_name || plot.name || 'Unnamed Plot'}</strong><br/>
          Country: ${plot.country || 'Unknown'}<br/>
          Products: ${productsDisplay || 'None'}<br/>
          Area: ${plot.area || 0} hectares
          ${plot.deforestation_percentage
            ? `<br/><span style="color:#D32F2F">Deforestation: ${plot.deforestation_percentage.toFixed(1)}%<br/>Deforested Area: ${plot.deforested_area?.toFixed?.(2) ?? '—'} ha</span>`
            : ''
          }
        </div>
      `;

      if (isSinglePoint) {
        // Single point - show dot and circle
        const [lat, lng] = latLngs[0];
        const dot = L.circleMarker([lat, lng], { ...styles.pointDot(map.getZoom()) }).addTo(layer);
        dotMarkersRef.current.push(dot);
        L.circle([lat, lng], { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);

        dot.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
        dot.bindPopup(popupHtml);

        allBounds.push([lat, lng]);
        return;
      }

      // Multi-point polygon - show polygon outline with center dot
      L.polygon(latLngs, { ...styles.polygonGlow, interactive: false }).addTo(layer);
      const polygon = L.polygon(latLngs, styles.polygon).addTo(layer);

      polygon.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
      polygon.bindPopup(popupHtml);

      polygon.on('click', function () {
        map.fitBounds(this.getBounds(), { padding: [50, 50] });
      });

      // Add center dot for visibility
      const center = centroidLatLng(latLngs);
      if (center) {
        const dot = L.circleMarker(center, styles.pointDot(map.getZoom())).addTo(layer);
        dotMarkersRef.current.push(dot);
        L.circle(center, { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);
      }

      allBounds.push(...latLngs);
    });

    // Fit map to show all plots with proper padding
    if (allBounds.length > 0) {
      try { 
        map.fitBounds(allBounds, { padding: [50, 50] }); 
      } catch (error) {
        console.warn('Error fitting bounds:', error);
      }
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!requestInfo) {
    return (
      <Box p={3}>
        <Alert severity="error">Request not found</Alert>
        <Button onClick={() => navigate('/requests')} sx={{ mt: 2 }}>
          Back to Requests
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/requests')}
          sx={{ mr: 2 }}
        >
          Back to Requests
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Shared Land Plots - {requestInfo.id}
        </Typography>
      </Box>

      {sharedPlots.length === 0 ? (
        <Alert severity="info">No land plots have been shared for this request</Alert>
      ) : (
        <>
          {/* Map with layer controls */}
          <Paper sx={{ height: 500, mb: 3, position: 'relative' }}>
            <div
              ref={mapContainerRef}
              style={{
                height: '100%',
                width: '100%',
                minHeight: '500px',
                backgroundColor: '#f5f5f5'
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
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>Loading satellite map...</Typography>
              </Box>
            )}
            {layersLoading && (
              <Box sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 1000,
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: 1,
                borderRadius: 1
              }}>
                <Typography variant="body2">Loading Earth Engine layers...</Typography>
              </Box>
            )}
          </Paper>

          {/* Plots Table */}
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
                {sharedPlots.map((plot) => (
                  <TableRow key={plot.id}>
                    <TableCell>{plot.plot_id}</TableCell>
                    <TableCell>{plot.plot_name}</TableCell>
                    <TableCell>{plot.country}</TableCell>
                    <TableCell>{plot.area}</TableCell>
                    <TableCell>
                      {Array.isArray(plot.commodities) 
                        ? plot.commodities.join(', ') 
                        : plot.commodities || ''
                      }
                    </TableCell>
                    <TableCell>
                      {plot.deforestation_percentage ? (
                        <Chip
                          label={`${plot.deforestation_percentage.toFixed(1)}%`}
                          color={plot.deforestation_percentage > 0 ? 'error' : 'success'}
                          size="small"
                        />
                      ) : (
                        <Chip label="0%" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default SharedPlotsMap;
