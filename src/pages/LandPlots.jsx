// import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
// import { supplierService } from '../services/supplierService';
// import { landPlotService } from '../services/landPlotService';
// import { useAuth } from '../context/AuthContext';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Alert,
//   Tabs,
//   Tab,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   Menu,
//   Stepper,
//   Step,
//   StepLabel,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Divider,
//   Checkbox,
//   CircularProgress,
//   FormControlLabel
// } from '@mui/material';
// import {
//   Map as MapIcon,
//   TableChart as TableIcon,
//   Upload as UploadIcon,
//   Download as DownloadIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Draw as DrawIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material';
// import { toast } from 'react-toastify';
// import CoordinateTable from '../components/CoordinateTable';
// import GpsFixedIcon from '@mui/icons-material/GpsFixed';

// /* ---------------- Visual helpers for POINT VISIBILITY ---------------- */
// const DOT_MIN = 8;
// const DOT_MAX = 18;
// const dotRadiusForZoom = (z) => Math.max(DOT_MIN, Math.min(DOT_MAX, 6 + (z - 3) * 1.3));
// const POINT_RING_METERS = 12;

// const styles = {
//   polygon: { color: '#0035f5ff', fillColor: '#0035f5ff', fillOpacity: 0.1, weight: 2 },
//   polygonGlow: { color: '#6fc3faff', weight: 6, opacity: 0.1 },
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

// /* ---------------- Context with API Integration ---------------- */
// const DataContext = createContext();

// export const DataProvider = ({ children }) => {
//   const { isAuthenticated, loading: authLoading } = useAuth(); // Add this line
  
//   const [landPlots, setLandPlots] = useState([]);
//   const [loading, setLoading] = useState(false); // Change from true to false

//   // Fetch land plots from backend
//   const fetchLandPlots = async () => {
//     // ✅ Add authentication check at the start
//     if (!isAuthenticated) {
//       console.log('[DataProvider] Not authenticated, skipping fetch');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await landPlotService.getLandPlots();
//       setLandPlots(response?.data || []);
//     } catch (error) {
//       console.error('Failed to fetch land plots:', error);
      
//       // Don't show toast for auth errors (401/403)
//       if (error.response?.status !== 401 && error.response?.status !== 403) {
//         toast.error('Failed to load land plots');
//       }
      
//       setLandPlots([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create new land plot
//   const createLandPlot = async (plotData, calculateDeforestation = true) => {
//     try {
//       await landPlotService.createLandPlot(plotData, calculateDeforestation);
//       await fetchLandPlots();
//       toast.success('Land plot created successfully');
//     } catch (error) {
//       console.error('Failed to create land plot:', error);
//       toast.error('Failed to create land plot');
//       throw error;
//     }
//   };

//   // Update land plot
//   const updateLandPlot = async (name, plotData, recalculateDeforestation = false) => {
//     try {
//       await landPlotService.updateLandPlot(name, plotData, recalculateDeforestation);
//       await fetchLandPlots();
//       toast.success('Land plot updated successfully');
//     } catch (error) {
//       console.error('Failed to update land plot:', error);
//       toast.error('Failed to update land plot');
//       throw error;
//     }
//   };

//   // Delete land plot
//   const deleteLandPlot = async (name) => {
//     try {
//       await landPlotService.deleteLandPlot(name);
//       await fetchLandPlots();
//       toast.success('Land plot deleted successfully');
//     } catch (error) {
//       console.error('Failed to delete land plot:', error);
//       toast.error('Failed to delete land plot');
//       throw error;
//     }
//   };

//   // Bulk create land plots
//   const bulkCreateLandPlots = async (plotsData, calculateDeforestation = true) => {
//     try {
//       console.log('Importing plots with deforestation calculation:', calculateDeforestation);
//       const result = await landPlotService.bulkCreateLandPlots(plotsData, calculateDeforestation);
//       await fetchLandPlots();
      
//       if (result.failed && result.failed > 0) {
//         toast.warning(`${result.created} plots created successfully, ${result.failed} failed`);
//         console.log('Failed plots:', result.failed_plots);
//         return result;
//       } else {
//         toast.success(`${result.created || plotsData.length} plots imported successfully`);
//         return result;
//       }
//     } catch (error) {
//       console.error('Failed to bulk create land plots:', error);
//       toast.error('Failed to import plots. Check console for details.');
//       throw error;
//     }
//   };

//   // useEffect(() => {
//   //   fetchLandPlots();
//   // }, []);
//   useEffect(() => {
//     if (!authLoading && isAuthenticated) {
//       // Auth is loaded and user is authenticated - fetch data
//       fetchLandPlots();
//     } else if (!authLoading && !isAuthenticated) {
//       // Not authenticated - clear data and stop loading
//       setLandPlots([]);
//       setLoading(false);
//     }
//   }, [authLoading, isAuthenticated]);

//   return (
//     <DataContext.Provider value={{ 
//       landPlots, 
//       loading,
//       fetchLandPlots,
//       createLandPlot,
//       updateLandPlot,
//       deleteLandPlot,
//       bulkCreateLandPlots
//     }}>
//       {children}
//     </DataContext.Provider>
//   );
// };

// export const useDataContext = () => useContext(DataContext);

// /* ---------------- Main Component ---------------- */
// const LandPlots = () => {
//   const { 
//     landPlots, 
//     loading,
//     fetchLandPlots,
//     createLandPlot,
//     updateLandPlot,
//     deleteLandPlot,
//     bulkCreateLandPlots
//   } = useDataContext();

//   // UI state
//   const [viewMode, setViewMode] = useState('map');
//   const [templateMenu, setTemplateMenu] = useState(null);

//   // Upload flow
//   const [uploadDialog, setUploadDialog] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadStep, setUploadStep] = useState(0);
//   const [validPlots, setValidPlots] = useState([]);
//   const [invalidPlots, setInvalidPlots] = useState([]);

//   // ERP upload status
//   const [erpStatus, setErpStatus] = useState('idle');
//   const [erpImportName, setErpImportName] = useState(null);
//   const [erpFileUrl, setErpFileUrl] = useState(null);
//   const [erpLog, setErpLog] = useState('');

//   // Draw/edit
//   const [drawDialog, setDrawDialog] = useState(false);
//   const [selectedPlot, setSelectedPlot] = useState(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [drawnCoordinates, setDrawnCoordinates] = useState([]);
//   const [editDialog, setEditDialog] = useState(false);

//   // Coordinates viewer
//   const [coordDialogOpen, setCoordDialogOpen] = useState(false);
//   const [coordData, setCoordData] = useState([]);

//   // Products and deforestation calculation
//   const [products, setProducts] = useState([]);
//   const [calculateDeforestation, setCalculateDeforestation] = useState(true);

//   // Map state - simplified
//   const [mapReady, setMapReady] = useState(false);
//   const [globalTileUrls, setGlobalTileUrls] = useState(null);
//   const [layersLoading, setLayersLoading] = useState(false);

//   /* ---------------- Map refs ---------------- */
//   const mapContainerRef = useRef(null);
//   const leafletMapRef = useRef(null);
//   const plotsLayerRef = useRef(null);
//   const dotMarkersRef = useRef([]);
//   const baseLayers = useRef({});
//   const treeCoverLayerRef = useRef(null);
//   const deforestationLayerRef = useRef(null);

//   /* ---------------- Effects ---------------- */
//   useEffect(() => { fetchProducts(); }, []);

//   // Load global tile URLs
//   useEffect(() => {
//     loadGlobalTileUrls();
//   }, []);

//   // Update layer control when tile URLs are loaded
//   useEffect(() => {
//     if (mapReady && leafletMapRef.current && globalTileUrls) {
//       console.log('Setting up layer control with tile URLs:', globalTileUrls);
//       setupLayerControl(leafletMapRef.current);
//     }
//   }, [mapReady, globalTileUrls]);

//   // Map initialization
//   useEffect(() => {
//     if (viewMode !== 'map') return;

//     const initMap = async () => {
//       try {
//         // Load CSS first
//         if (!document.getElementById('leaflet-css')) {
//           const leafletCSS = document.createElement('link');
//           leafletCSS.id = 'leaflet-css';
//           leafletCSS.rel = 'stylesheet';
//           leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//           document.head.appendChild(leafletCSS);
//         }

//         if (!document.getElementById('leaflet-draw-css')) {
//           const drawCSS = document.createElement('link');
//           drawCSS.id = 'leaflet-draw-css';
//           drawCSS.rel = 'stylesheet';
//           drawCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
//           document.head.appendChild(drawCSS);
//         }

//         // Load Leaflet JS and WAIT for it to load
//         if (!window.L) {
//           await new Promise((resolve, reject) => {
//             const script = document.createElement('script');
//             script.id = 'leaflet-js';
//             script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//             script.onload = resolve;
//             script.onerror = reject;
//             document.body.appendChild(script);
//           });
//         }

//         // Load Leaflet Draw and WAIT for it to load
//         if (!window.L?.Draw) {
//           await new Promise((resolve, reject) => {
//             const script = document.createElement('script');
//             script.id = 'leaflet-draw-js';
//             script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
//             script.onload = resolve;
//             script.onerror = reject;
//             document.body.appendChild(script);
//           });
//         }

//         const L = window.L;
        
//         if (!L) {
//           throw new Error('Leaflet failed to load');
//         }

//         // Clean up existing map
//         if (leafletMapRef.current) {
//           leafletMapRef.current.remove();
//           leafletMapRef.current = null;
//         }

//         if (!mapContainerRef.current) return;
//         mapContainerRef.current.innerHTML = '';

//         // Define base layers
//         baseLayers.current = {
//           satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//             attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
//             maxZoom: 18
//           }),
//           street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '© OpenStreetMap contributors',
//             maxZoom: 19
//           }),
//           hybrid: L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
//             maxZoom: 20,
//             subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
//             attribution: '© Google'
//           })
//         };

//         // Create map with satellite as default
//         const map = L.map(mapContainerRef.current, {
//           center: [20, 0],
//           zoom: 2,
//           zoomControl: true,
//           dragging: true,
//           scrollWheelZoom: true,
//           layers: [baseLayers.current.satellite] // Start with satellite
//         });

//         leafletMapRef.current = map;

//         // Create plots layer
//         plotsLayerRef.current = L.layerGroup().addTo(map);
//         dotMarkersRef.current = [];

//         // Handle zoom events
//         map.on('zoomend', () => {
//           const z = map.getZoom();
//           dotMarkersRef.current.forEach(marker => {
//             if (marker.setStyle) {
//               marker.setStyle({ radius: dotRadiusForZoom(z) });
//             }
//           });
//         });

//         setMapReady(true);

//         setTimeout(() => {
//           map.invalidateSize();
//           drawPlots();
//           // Setup initial layer control (will be updated when tiles load)
//           setupInitialLayerControl(map);
//         }, 100);

//       } catch (error) {
//         console.error('Error initializing map:', error);
//         toast.error('Failed to initialize map');
//       }
//     };

//     initMap();

//     // Cleanup
//     return () => {
//       if (leafletMapRef.current) {
//         leafletMapRef.current.remove();
//         leafletMapRef.current = null;
//       }
//       plotsLayerRef.current = null;
//       dotMarkersRef.current = [];
//       treeCoverLayerRef.current = null;
//       deforestationLayerRef.current = null;
//       setMapReady(false);
//     };
//   }, [viewMode]);

//   // Redraw plots when data changes
//   useEffect(() => {
//     if (mapReady && leafletMapRef.current) {
//       drawPlots();
//     }
//   }, [landPlots, mapReady]);

//   // Reset upload dialog state
//   useEffect(() => {
//     if (uploadDialog) {
//       setUploadStep(0);
//       setErpStatus('idle');
//       setErpImportName(null);
//       setErpFileUrl(null);
//       setErpLog('');
//       setValidPlots([]);
//       setInvalidPlots([]);
//       setUploadedFile(null);
//     }
//   }, [uploadDialog]);

//   /* ---------------- Data fetch ---------------- */
//   const fetchProducts = async () => {
//     try {
//       const staticProducts = [
//         { _id: '1', name: 'Coffee Arabica', item_name: 'Coffee Arabica' },
//         { _id: '2', name: 'Coffee Robusta', item_name: 'Coffee Robusta' },
//         { _id: '3', name: 'Cocoa Beans', item_name: 'Cocoa Beans' },
//         { _id: '4', name: 'Palm Oil', item_name: 'Palm Oil' },
//         { _id: '5', name: 'Rubber', item_name: 'Rubber' },
//         { _id: '6', name: 'Soy', item_name: 'Soy' },
//         { _id: '7', name: 'Wood', item_name: 'Wood' },
//         { _id: '8', name: 'Cardamom', item_name: 'Cardamom' },
//       ];
//       setProducts(staticProducts);
//     } catch (error) {
//       console.error('Failed to fetch products:', error);
//       setProducts([]);
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

//   /* ---------------- Layer Control Setup ---------------- */
//   const setupInitialLayerControl = (map) => {
//     const L = window.L;
    
//     // Define base maps for the control
//     const baseMaps = {
//       "🛰️ Satellite": baseLayers.current.satellite,
//       "🗺️ Street Map": baseLayers.current.street, 
//       "🌍 Hybrid": baseLayers.current.hybrid
//     };

//     // Initial overlay with just land plots
//     const overlayMaps = {
//       "📍 Land Plots": plotsLayerRef.current
//     };

//     // Create and add initial layer control
//     map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
//       position: 'topright',
//       collapsed: false
//     }).addTo(map);

//     console.log('Initial layer control added');
//   };

//   const setupLayerControl = (map) => {
//     const L = window.L;
    
//     // Remove existing layer control if present
//     if (map.layerControlInstance) {
//       map.removeControl(map.layerControlInstance);
//       map.layerControlInstance = null;
//     }

//     // Define base maps for the control
//     const baseMaps = {
//       "🛰️ Satellite": baseLayers.current.satellite,
//       "🗺️ Street Map": baseLayers.current.street, 
//       "🌍 Hybrid": baseLayers.current.hybrid
//     };

//     // Create overlay layers
//     const overlayMaps = {
//       "📍 Land Plots": plotsLayerRef.current
//     };

//     // Add Earth Engine layers if available
//     if (globalTileUrls && globalTileUrls.global_tree_cover_url && globalTileUrls.global_deforestation_url) {
//       try {
//         console.log('Creating Earth Engine layers...');
        
//         // Create tree cover layer
//         if (!treeCoverLayerRef.current) {
//           treeCoverLayerRef.current = L.tileLayer(globalTileUrls.global_tree_cover_url, {
//             attribution: 'Hansen/UMD/Google/USGS/NASA',
//             opacity: 0.7,
//             maxZoom: 18
//           });
//           console.log('Tree cover layer created');
//         }

//         // Create deforestation layer
//         if (!deforestationLayerRef.current) {
//           deforestationLayerRef.current = L.tileLayer(globalTileUrls.global_deforestation_url, {
//             attribution: 'Hansen/UMD/Google/USGS/NASA', 
//             opacity: 0.8,
//             maxZoom: 18
//           });
//           console.log('Deforestation layer created');
//         }

//         // Add to overlay maps
//         overlayMaps["🌳 Forest Cover 2000"] = treeCoverLayerRef.current;
//         overlayMaps["🔥 Forest Loss (2021-2024)"] = deforestationLayerRef.current;
        
//         console.log('Earth Engine layers added to overlay maps');

//       } catch (error) {
//         console.error('Error creating Earth Engine layers:', error);
//       }
//     } else {
//       console.log('Global tile URLs not available or incomplete:', globalTileUrls);
//     }

//     // Create and add layer control
//     map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
//       position: 'topright',
//       collapsed: false
//     }).addTo(map);

//     console.log('Layer control updated with overlays:', Object.keys(overlayMaps));
//   };

//   /* ---------------- Map renderer ---------------- */
//   function drawPlots() {
//     const L = window.L;
//     const map = leafletMapRef.current;
//     const layer = plotsLayerRef.current;
    
//     if (!L || !map || !layer || !mapReady) {
//       console.log('Map not ready for plotting');
//       return;
//     }

//     console.log('Drawing plots:', landPlots.length);

//     layer.clearLayers();
//     dotMarkersRef.current = [];

//     const allBounds = [];

//     landPlots.forEach(plot => {
//       let coordinates;
      
//       if (plot.coordinates) {
//         if (typeof plot.coordinates === 'string') {
//           try {
//             coordinates = JSON.parse(plot.coordinates);
//           } catch {
//             coordinates = [];
//           }
//         } else {
//           coordinates = plot.coordinates;
//         }
//       } else if (plot.geojson?.coordinates) {
//         if (plot.geojson.type === 'Point') {
//           coordinates = [plot.geojson.coordinates];
//         } else if (plot.geojson.coordinates[0]?.length) {
//           coordinates = plot.geojson.coordinates[0];
//         }
//       } else if (plot.longitude != null && plot.latitude != null) {
//         coordinates = [[plot.longitude, plot.latitude]];
//       } else {
//         return;
//       }

//       if (!coordinates || coordinates.length === 0) return;

//       const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
//       const isSinglePoint = latLngs.length === 1;

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
//         const [lat, lng] = latLngs[0];
//         const dot = L.circleMarker([lat, lng], { ...styles.pointDot(map.getZoom()) }).addTo(layer);
//         dotMarkersRef.current.push(dot);
//         L.circle([lat, lng], { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);

//         dot.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
//         dot.bindPopup(popupHtml);

//         allBounds.push([lat, lng]);
//         return;
//       }

//       // Multi-point polygon
//       L.polygon(latLngs, { ...styles.polygonGlow, interactive: false }).addTo(layer);
//       const polygon = L.polygon(latLngs, styles.polygon).addTo(layer);

//       polygon.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
//       polygon.bindPopup(popupHtml);

//       polygon.on('click', function () {
//         map.fitBounds(this.getBounds(), { padding: [50, 50] });
//       });

//       const center = centroidLatLng(latLngs);
//       if (center) {
//         const dot = L.circleMarker(center, styles.pointDot(map.getZoom())).addTo(layer);
//         dotMarkersRef.current.push(dot);
//         L.circle(center, { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);
//       }

//       allBounds.push(...latLngs);
//     });

//     if (allBounds.length) {
//       try { 
//         map.fitBounds(allBounds, { padding: [50, 50] }); 
//       } catch (error) {
//         console.warn('Error fitting bounds:', error);
//       }
//     }
//   }

//   /* -------- Rest of your existing handler functions remain the same -------- */
//   const handleSync = async () => {
//     await fetchLandPlots();
//     toast.success('Land plots synced from backend');
//   };

//   const handleFileUpload = async (event) => {
//   const file = event.target.files?.[0];
//   if (!file) return;

//   setUploadedFile(file);

//   const lower = file.name.toLowerCase();
//   if (!lower.endsWith('.csv')) {
//     toast.error('Please upload a CSV file');
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = (e) => {
//     try {
//       const text = e.target.result;
//       const lines = text.split('\n').filter(line => line.trim());
//       if (lines.length <= 1) {
//         toast.error('CSV appears empty');
//         return;
//       }

//       const headerLine = lines[0];
//       const headers = headerLine.split(',').map(h => h.trim());
//       console.log('CSV Headers:', headers);
      
//       // Parse all rows first
//       const allRows = [];
//       for (let i = 1; i < lines.length; i++) {
//         const values = lines[i].split(',').map(v => v.trim());
//         if (!values[0]) continue; // Skip rows without Plot ID

//         const rowData = {};
//         headers.forEach((header, index) => {
//           rowData[header] = values[index] || '';
//         });
//         allRows.push(rowData);
//       }

//       console.log('All parsed rows:', allRows);

//       // Group rows by Plot ID and collect coordinates
//       const plotMap = new Map();
      
//       for (const row of allRows) {
//         const plotId = row['Plot ID'];
//         if (!plotId) continue;

//         // Initialize plot if not exists
//         if (!plotMap.has(plotId)) {
//           plotMap.set(plotId, {
//             id: plotId,
//             name: row['Plot Name'] || 'Unnamed Plot',
//             country: row['Country'] || '',
//             products: row['Products'] ? row['Products'].split(';').map(p => p.trim()).filter(Boolean) : [],
//             commodities: row['Products'] ? row['Products'].split(';').map(p => p.trim()).filter(Boolean) : [],
//             area: parseFloat(row['Area (hectares)']) || 0,
//             coordinates: []
//           });
//         }

//         // Add coordinates if present
//         const lat = parseFloat(row['Latitude']);
//         const lng = parseFloat(row['Longitude']);
        
//         if (!isNaN(lat) && !isNaN(lng)) {
//           plotMap.get(plotId).coordinates.push([lng, lat]);
//         }
//       }

//       // Process each plot and close polygons
//       const plots = [];
//       for (const [plotId, plotData] of plotMap.entries()) {
//         if (plotData.coordinates.length === 0) {
//           console.warn(`No coordinates found for plot ${plotId}`);
//           continue;
//         }

//         // Close polygon if it has more than 2 points
//         if (plotData.coordinates.length > 2) {
//           const firstPoint = plotData.coordinates[0];
//           const lastPoint = plotData.coordinates[plotData.coordinates.length - 1];
          
//           // Close polygon if not already closed
//           if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
//             plotData.coordinates.push([firstPoint[0], firstPoint[1]]);
//           }
//         }

//         // Set geojson based on coordinate count
//         if (plotData.coordinates.length === 1) {
//           // Single point
//           plotData.geojson = {
//             type: 'Point',
//             coordinates: plotData.coordinates[0]
//           };
//           plotData.latitude = plotData.coordinates[0][1];
//           plotData.longitude = plotData.coordinates[0][0];
//         } else if (plotData.coordinates.length > 2) {
//           // Polygon
//           plotData.geojson = {
//             type: 'Polygon',
//             coordinates: [plotData.coordinates]
//           };
//           // Calculate centroid for latitude/longitude
//           let latSum = 0, lngSum = 0;
//           for (const [lng, lat] of plotData.coordinates) {
//             latSum += lat;
//             lngSum += lng;
//           }
//           plotData.latitude = latSum / plotData.coordinates.length;
//           plotData.longitude = lngSum / plotData.coordinates.length;
//         }

//         plots.push(plotData);
//       }

//       console.log('Processed plots:', plots);
//       setValidPlots(plots);
//       setInvalidPlots([]);
//       setUploadStep(1);

//       // Background ERP save (optional)
//       (async () => {
//         try {
//           setErpStatus('uploading');
//           setErpLog('Starting import…');

//           const begin = await landPlotService.beginImport();
//           const importName = begin?.name;
//           setErpImportName(importName);

//           const up = await landPlotService.uploadImportFile({ name: importName, file });
//           const fileUrl = up?.file_url || up?.file_name || null;
//           setErpFileUrl(fileUrl);

//           await landPlotService.finalizeImport({
//             name: importName,
//             total_plots: plots.length,
//             log: `Uploaded via Land Plots UI. File: ${file.name}${fileUrl ? ` (${fileUrl})` : ''}`,
//             status: 'Imported',
//           });

//           setErpStatus('success');
//           setErpLog(`Saved as ${importName}${fileUrl ? ` • ${fileUrl}` : ''}`);
//           toast.success('CSV saved in ERPNext');
//         } catch (err) {
//           console.error('ERPNext upload failed', err);
//           setErpStatus('error');
//           setErpLog(String(err?.response?.data?.message || err?.message || err));
//           toast.error('File import tracking failed, but you can still import the plots');
//         }
//       })();
//     } catch (error) {
//       console.error('Error parsing file:', error);
//       toast.error('Error parsing file. Please check the format.');
//     }
//   };
//   reader.readAsText(file);
// };


//   const startDrawing = () => {
//     const L = window.L;
//     const map = leafletMapRef.current;
    
//     if (!L || !map) {
//       toast.error('Map is not ready yet.');
//       return;
//     }
    
//     if (!L.Draw) {
//       toast.error('Drawing tools are not loaded yet. Please try again in a moment.');
//       return;
//     }

//     setIsDrawing(true);
//     setDrawnCoordinates([]);

//     const drawnItems = new L.FeatureGroup();
//     map.addLayer(drawnItems);

//     const drawControl = new L.Control.Draw({
//       position: 'topright',
//       draw: {
//         polygon: {
//           allowIntersection: false,
//           drawError: { color: '#e1e100', message: '<strong>Error:</strong> Shape edges cannot cross!' },
//           shapeOptions: { color: '#2E7D32' }
//         },
//         polyline: false,
//         circle: false,
//         rectangle: false,
//         marker: false,
//         circlemarker: false
//       },
//       edit: { featureGroup: drawnItems }
//     });
//     map.addControl(drawControl);

//     map.once(L.Draw.Event.CREATED, (e) => {
//       const layer = e.layer;
//       drawnItems.addLayer(layer);
//       const coords = layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat]);
//       setDrawnCoordinates(coords);
//       map.removeControl(drawControl);
//       setIsDrawing(false);
//       setDrawDialog(true);
//     });
//   };

//   const calculateArea = () => Math.round(Math.random() * 100 + 10);

//   const saveDrawnPlot = async () => {
//     try {
//       const newPlot = {
//         id: selectedPlot?.id || `PLOT${Date.now()}`,
//         name: selectedPlot?.name || 'New Plot',
//         country: selectedPlot?.country || '',
//         commodities: selectedPlot?.commodities || [],
//         products: selectedPlot?.products || [],
//         area: calculateArea(drawnCoordinates),
//         coordinates: drawnCoordinates
//       };

//       if (selectedPlot?.name) {
//         await updateLandPlot(selectedPlot.name, newPlot);
//       } else {
//         await createLandPlot(newPlot);
//       }

//       setDrawDialog(false);
//       setSelectedPlot(null);
//       setDrawnCoordinates([]);
//     } catch (error) {
//       // Error handled in context
//     }
//   };

//   const handleEdit = (plot) => { 
//     setSelectedPlot(plot); 
//     setEditDialog(true); 
//   };

//   const handleDelete = async (plot) => {
//     if (window.confirm('Are you sure you want to delete this land plot?')) {
//       await deleteLandPlot(plot.name);
//     }
//   };

//   const importPlotsFromCSV = async () => {
//     try {
//       console.log('Importing plots with deforestation calculation:', calculateDeforestation);
//       const result = await bulkCreateLandPlots(validPlots, calculateDeforestation);
//       setUploadDialog(false);
//       setUploadStep(0);
//     } catch (error) {
//       console.error('Import error:', error);
//     }
//   };

//   const commodityOptions = ['Coffee', 'Cocoa', 'Palm Oil', 'Rubber', 'Wood', 'Soy', 'Cattle', 'Cardamom'];
//   const countryOptions = ['Brazil', 'India', 'Ghana', 'Indonesia', 'Vietnam', 'Colombia'];

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
//         <CircularProgress />
//         <Typography sx={{ ml: 2 }}>Loading land plots...</Typography>
//       </Box>
//     );
//   }

//   /* ---------------- Render ---------------- */
//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>Land Plots (EUDR)</Typography>
//         <Box>
//           <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleSync} sx={{ mr: 1 }}>
//             Sync
//           </Button>
//           <Button variant="contained" startIcon={<AddIcon />} onClick={(e) => setTemplateMenu(e.currentTarget)}>
//             Create
//           </Button>
          
//            <Menu anchorEl={templateMenu} open={Boolean(templateMenu)} onClose={() => setTemplateMenu(null)}>
//         <MenuItem onClick={() => { setUploadDialog(true); setTemplateMenu(null); }}>
//           <UploadIcon sx={{ mr: 1 }} /> Upload File
//         </MenuItem>
//         <MenuItem onClick={() => { startDrawing(); setTemplateMenu(null); }}>
//           <DrawIcon sx={{ mr: 1 }} /> Draw on Map
//         </MenuItem>
//         <Divider />
//         <MenuItem disabled>
//           <DownloadIcon sx={{ mr: 1 }} /> Download Templates
//         </MenuItem>
//         <MenuItem onClick={() => { 
//           setTemplateMenu(null); 
//           handleDownloadTemplate(); 
//         }}>
//           <DownloadIcon sx={{ mr: 1 }} /> CSV Template
//         </MenuItem>
        
//       </Menu>
//         </Box>
//       </Box>

//       {/* View Toggle */}
//       <Paper sx={{ mb: 3 }}>
//         <Tabs value={viewMode} onChange={(e, v) => setViewMode(v)}>
//           <Tab icon={<MapIcon />} label="Map View" value="map" />
//           <Tab icon={<TableIcon />} label="Table View" value="table" />
//         </Tabs>
//       </Paper>

//       {/* Map View */}
//       {viewMode === 'map' && (
//         <Box>
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
//             {isDrawing && (
//               <Alert
//                 severity="info"
//                 sx={{
//                   position: 'absolute',
//                   top: 10,
//                   left: '50%',
//                   transform: 'translateX(-50%)',
//                   zIndex: 1000,
//                   pointerEvents: 'none'
//                 }}
//               >
//                 Click on the map to draw your land plot polygon
//               </Alert>
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

//           {/* Summary table under map */}
//           <TableContainer component={Paper}>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Plot ID</TableCell>
//                   <TableCell>Plot Name</TableCell>
//                   <TableCell>Country</TableCell>
//                   <TableCell>Area (ha)</TableCell>
//                   <TableCell>Deforestation (%)</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {landPlots.map((plot) => (
//                   <TableRow key={plot.name}>
//                     <TableCell>{plot.plot_id}</TableCell>
//                     <TableCell>{plot.plot_name}</TableCell>
//                     <TableCell>{plot.country}</TableCell>
//                     <TableCell>{plot.area}</TableCell>
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
//                     <TableCell>
//                       <IconButton size="small" onClick={() => handleEdit(plot)}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton size="small" onClick={() => handleDelete(plot)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       )}

//       {/* Table View */}
// {viewMode === 'table' && (
//   <TableContainer component={Paper}>
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>Plot ID</TableCell>
//           <TableCell>Name</TableCell>
//           <TableCell>Country</TableCell>
//           <TableCell>Commodities</TableCell>
//           <TableCell>Area (ha)</TableCell>
//           <TableCell>Coordinates</TableCell>
//           <TableCell>Actions</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {landPlots.map((plot) => (
//           <TableRow key={plot.name}>
//             <TableCell>{plot.plot_id}</TableCell>
//             <TableCell>{plot.plot_name}</TableCell>
//             <TableCell>{plot.country}</TableCell>
//             <TableCell>
//               {(() => {
//                 let commoditiesList = [];
//                 if (Array.isArray(plot.commodities)) {
//                   commoditiesList = plot.commodities;
//                 } else if (typeof plot.commodities === 'string' && plot.commodities) {
//                   commoditiesList = plot.commodities.split(',');
//                 }
//                 return commoditiesList.map(c => (
//                   <Chip key={c} label={c.trim()} size="small" sx={{ mr: 0.5 }} />
//                 ));
//               })()}
//             </TableCell>
//             <TableCell>{plot.area}</TableCell>
//             <TableCell>
//               <IconButton
//                 size="small"
//                 onClick={() => {
//                   let coords = [];
//                   if (plot.coordinates) {
//                     if (typeof plot.coordinates === 'string') {
//                       try {
//                         coords = JSON.parse(plot.coordinates);
//                       } catch {
//                         coords = [];
//                       }
//                     } else {
//                       coords = plot.coordinates;
//                     }
//                   } else if (plot.longitude && plot.latitude) {
//                     coords = [[plot.longitude, plot.latitude]];
//                   }
//                   setCoordData(coords);
//                   setCoordDialogOpen(true);
//                 }}
//               >
//                 <GpsFixedIcon />
//               </IconButton>
//               {(() => {
//                 let coords = [];
//                 if (plot.coordinates) {
//                   if (typeof plot.coordinates === 'string') {
//                     try {
//                       coords = JSON.parse(plot.coordinates);
//                     } catch {
//                       coords = [];
//                     }
//                   } else {
//                     coords = plot.coordinates;
//                   }
//                 } else if (plot.longitude && plot.latitude) {
//                   coords = [[plot.longitude, plot.latitude]];
//                 }
                
//                 // For polygons (multiple points), subtract 1 to exclude closing point
//                 // For single points, keep as is
//                 const displayCount = coords.length > 1 ? coords.length - 1 : coords.length;
//                 return coords.length > 0 ? `${displayCount} points` : '1 point';
//               })()}
//             </TableCell>
//             <TableCell>
//               <IconButton size="small" onClick={() => handleEdit(plot)}>
//                 <EditIcon />
//               </IconButton>
//               <IconButton size="small" onClick={() => handleDelete(plot)}>
//                 <DeleteIcon />
//               </IconButton>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// )}


//       {/* All your existing dialogs remain the same... */}
//       {/* Upload Dialog */}
//       <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Upload Land Plot Data</DialogTitle>
//         <DialogContent>
//           <Stepper activeStep={uploadStep} sx={{ mb: 3 }}>
//             <Step><StepLabel>Upload File</StepLabel></Step>
//             <Step><StepLabel>Import Land Plots</StepLabel></Step>
//           </Stepper>

//           {uploadStep === 0 && (
//             <Box>
//               <Alert severity="info" sx={{ mb: 2 }}>
//                 Supported formats: <strong>.csv</strong>. Supports both single coordinate (Latitude/Longitude) and multiple coordinate pairs per plot.
//               </Alert>

//               {erpStatus === 'uploading' && (
//                 <Alert severity="info" sx={{ mb: 2 }}>
//                   Saving file to ERPNext… {erpLog}
//                 </Alert>
//               )}
//               {erpStatus === 'success' && (
//                 <Alert severity="success" sx={{ mb: 2 }}>
//                   File saved in ERPNext {erpImportName ? `(${erpImportName})` : ''}
//                 </Alert>
//               )}
//               {erpStatus === 'error' && (
//                 <Alert severity="warning" sx={{ mb: 2 }}>
//                   File tracking failed, but you can still import the plots. Details: {erpLog}
//                 </Alert>
//               )}

//               <Button variant="contained" component="label" startIcon={<UploadIcon />} fullWidth>
//                 Browse for a CSV
//                 <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
//               </Button>
//               {uploadedFile && <Typography sx={{ mt: 2 }}>Selected: {uploadedFile.name}</Typography>}
//             </Box>
//           )}

//           {uploadStep === 1 && (
//             <Box>
//               <Typography variant="h6" gutterBottom>Valid Plots ({validPlots.length})</Typography>
              
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={calculateDeforestation}
//                     onChange={(e) => setCalculateDeforestation(e.target.checked)}
//                   />
//                 }
//                 label="Calculate deforestation data (requires Earth Engine - may take longer)"
//                 sx={{ mb: 2 }}
//               />
              
//               <List>
//                 {validPlots.map((plot, index) => (
//                   <ListItem key={index}>
//                     <ListItemText
//                       primary={plot.name}
//                       secondary={`${plot.country} — ${(plot.commodities || []).join(', ')} — Area: ${plot.area} ha`}
//                     />
//                     <ListItemSecondaryAction><Checkbox defaultChecked /></ListItemSecondaryAction>
//                   </ListItem>
//                 ))}
//               </List>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => { setUploadDialog(false); setUploadStep(0); }}>Cancel</Button>
//           {uploadStep === 1 && (
//             <Button variant="contained" onClick={importPlotsFromCSV}>
//               Import {validPlots.length} Plots
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>

//       {/* Draw Dialog */}
//       <Dialog open={drawDialog} onClose={() => setDrawDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Save Land Plot</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth label="Plot ID" value={selectedPlot?.id || ''}
//             onChange={(e) => setSelectedPlot({ ...selectedPlot, id: e.target.value })}
//             margin="normal" required
//           />
//           <TextField
//             fullWidth label="Plot Name" value={selectedPlot?.name || ''}
//             onChange={(e) => setSelectedPlot({ ...selectedPlot, name: e.target.value })}
//             margin="normal"
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Country</InputLabel>
//             <Select
//               value={selectedPlot?.country || ''}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
//             >
//               {countryOptions.map(country => <MenuItem key={country} value={country}>{country}</MenuItem>)}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Commodities</InputLabel>
//             <Select
//               multiple
//               value={selectedPlot?.commodities || []}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, commodities: e.target.value })}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((v) => <Chip key={v} label={v} size="small" />)}
//                 </Box>
//               )}
//             >
//               {commodityOptions.map(commodity => <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>)}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <InputLabel>Products</InputLabel>
//             <Select
//               multiple
//               value={selectedPlot?.products || []}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, products: e.target.value })}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((productId) => {
//                     const product = products.find(p => p._id === productId);
//                     return product ? <Chip key={productId} label={product.name} size="small" /> : null;
//                   })}
//                 </Box>
//               )}
//             >
//               {products.map(product => <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>)}
//             </Select>
//           </FormControl>

//           <Typography variant="body2" sx={{ mt: 2 }}>
//             Area: ~{calculateArea(drawnCoordinates)} hectares
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDrawDialog(false)}>Cancel</Button>
//           <Button variant="contained" onClick={saveDrawnPlot}>Save Plot</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Land Plot</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth label="Plot ID" value={selectedPlot?.plot_id || ''}
//             onChange={(e) => setSelectedPlot({ ...selectedPlot, plot_id: e.target.value })}
//             margin="normal"
//           />
//           <TextField
//             fullWidth label="Plot Name" value={selectedPlot?.plot_name || ''}
//             onChange={(e) => setSelectedPlot({ ...selectedPlot, plot_name: e.target.value })}
//             margin="normal"
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Country</InputLabel>
//             <Select
//               value={selectedPlot?.country || ''}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
//             >
//               {countryOptions.map(country => <MenuItem key={country} value={country}>{country}</MenuItem>)}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Commodities</InputLabel>
//             <Select
//               multiple
//               value={(() => {
//                 if (Array.isArray(selectedPlot?.commodities)) return selectedPlot.commodities;
//                 if (typeof selectedPlot?.commodities === 'string') return selectedPlot.commodities.split(',');
//                 return [];
//               })()}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, commodities: e.target.value })}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((v) => <Chip key={v} label={v} size="small" />)}
//                 </Box>
//               )}
//             >
//               {commodityOptions.map(commodity => <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>)}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={async () => {
//               try {
//                 await updateLandPlot(selectedPlot.name, selectedPlot);
//                 setEditDialog(false);
//               } catch (error) {
//                 // Error handled in context
//               }
//             }}
//           >
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Coordinates viewer */}
//       <CoordinateTable
//         open={coordDialogOpen}
//         onClose={() => setCoordDialogOpen(false)}
//         coordinates={coordData}
//       />
//     </Box>
//   );
// };

//  const handleDownloadTemplate = async () => {
//     try {
//       console.log('Starting template download...');
      
//       const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Latitude,Longitude
// PLOT001,Coffee Farm North,Brazil,Coffee Arabica,50,-15.7801,-47.9292
// PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232
// PLOT003,Plantrich farm,India,Cardamom,75,12.9716,77.5946
// PLOT004,Farm A Polygon,India,Cardamom,75,10.21979,77.19177
// PLOT004,,,,,10.21931,77.19199
// PLOT004,,,,,10.21927,77.19255
// PLOT004,,,,,10.21981,77.19252`;

//       // Add BOM for UTF-8 encoding
//       const BOM = '\uFEFF';
//       const csvWithBOM = BOM + csvContent;

//       // Create blob with proper MIME type
//       const blob = new Blob([csvWithBOM], { 
//         type: 'text/csv;charset=utf-8;' 
//       });

//       // Check for IE/Edge legacy support
//       if (window.navigator && window.navigator.msSaveBlob) {
//         window.navigator.msSaveBlob(blob, 'land_plots_template.csv');
//         toast.success('Template downloaded successfully!');
//         return;
//       }

//       // Modern browser approach with delay
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
      
//       // Set attributes
//       link.href = url;
//       link.download = 'land_plots_template.csv';
//       link.style.display = 'none';
      
//       // Add to DOM
//       document.body.appendChild(link);
      
//       // Use setTimeout to ensure blob URL is ready
//       setTimeout(() => {
//         // Use dispatchEvent for better browser compatibility
//         link.dispatchEvent(new MouseEvent('click', {
//           bubbles: true,
//           cancelable: true,
//           view: window
//         }));
        
//         // Clean up after a delay
//         setTimeout(() => {
//           document.body.removeChild(link);
//           window.URL.revokeObjectURL(url);
//         }, 100);
        
//         toast.success('Template downloaded successfully!');
//       }, 50);

//     } catch (error) {
//       console.error('Download failed:', error);
//       toast.error('Failed to download template. Please try again.');
//     }
//   };

//   // Alternative fallback method if the above doesn't work
//   const handleDownloadTemplateFallback = () => {
//     try {
//       const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Latitude,Longitude
// PLOT001,Coffee Farm North,Brazil,Coffee Arabica,50,-15.7801,-47.9292
// PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232
// PLOT003,Plantrich farm,India,Cardamom,75,12.9716,77.5946
// PLOT004,Farm A Polygon,India,Cardamom,75,10.21979,77.19177
// PLOT004,,,,,10.21931,77.19199
// PLOT004,,,,,10.21927,77.19255
// PLOT004,,,,,10.21981,77.19252`;

//       // Create a data URI instead of blob
//       const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      
//       const link = document.createElement('a');
//       link.href = dataUri;
//       link.download = 'land_plots_template.csv';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       toast.success('Template downloaded successfully!');
//     } catch (error) {
//       console.error('Fallback download failed:', error);
//       toast.error('Download failed. Please contact support.');
//     }
//   };


// export default LandPlots;



// import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
// import { supplierService } from '../services/supplierService';
// import { landPlotService } from '../services/landPlotService';
// import { useAuth } from '../context/AuthContext';
// // import 'mapbox-gl/dist/mapbox-gl.css';
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Alert,
//   Tabs,
//   Tab,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   Menu,
//   Stepper,
//   Step,
//   StepLabel,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   Divider,
//   Checkbox,
//   CircularProgress,
//   FormControlLabel
// } from '@mui/material';
// import {
//   Map as MapIcon,
//   TableChart as TableIcon,
//   Upload as UploadIcon,
//   Download as DownloadIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Draw as DrawIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material';
// import { toast } from 'react-toastify';
// import CoordinateTable from '../components/CoordinateTable';
// import GpsFixedIcon from '@mui/icons-material/GpsFixed';

// /* ---------------- Visual helpers for POINT VISIBILITY ---------------- */
// const DOT_MIN = 8;
// const DOT_MAX = 18;
// const dotRadiusForZoom = (z) => Math.max(DOT_MIN, Math.min(DOT_MAX, 6 + (z - 3) * 1.3));
// const POINT_RING_METERS = 12;

// const styles = {
//   polygon: { color: '#0035f5ff', fillColor: '#0035f5ff', fillOpacity: 0.1, weight: 2 },
//   polygonGlow: { color: '#6fc3faff', weight: 6, opacity: 0.1 },
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

// /* ---------------- Context with API Integration ---------------- */
// const DataContext = createContext();

// export const DataProvider = ({ children }) => {
//   const { isAuthenticated, loading: authLoading } = useAuth(); // Add this line
  
//   const [landPlots, setLandPlots] = useState([]);
//   const [loading, setLoading] = useState(false); // Change from true to false

//   // Fetch land plots from backend
//   const fetchLandPlots = async () => {
//     // ✅ Add authentication check at the start
//     if (!isAuthenticated) {
//       console.log('[DataProvider] Not authenticated, skipping fetch');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await landPlotService.getLandPlots();
//       setLandPlots(response?.data || []);
//     } catch (error) {
//       console.error('Failed to fetch land plots:', error);
      
//       // Don't show toast for auth errors (401/403)
//       if (error.response?.status !== 401 && error.response?.status !== 403) {
//         toast.error('Failed to load land plots');
//       }
      
//       setLandPlots([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create new land plot
//   const createLandPlot = async (plotData, calculateDeforestation = true) => {
//     try {
//       await landPlotService.createLandPlot(plotData, calculateDeforestation);
//       await fetchLandPlots();
//       toast.success('Land plot created successfully');
//     } catch (error) {
//       console.error('Failed to create land plot:', error);
//       toast.error('Failed to create land plot');
//       throw error;
//     }
//   };

//   // Update land plot
//   const updateLandPlot = async (name, plotData, recalculateDeforestation = false) => {
//     try {
//       await landPlotService.updateLandPlot(name, plotData, recalculateDeforestation);
//       await fetchLandPlots();
//       toast.success('Land plot updated successfully');
//     } catch (error) {
//       console.error('Failed to update land plot:', error);
//       toast.error('Failed to update land plot');
//       throw error;
//     }
//   };

//   // Delete land plot
//   const deleteLandPlot = async (name) => {
//     try {
//       await landPlotService.deleteLandPlot(name);
//       await fetchLandPlots();
//       toast.success('Land plot deleted successfully');
//     } catch (error) {
//       console.error('Failed to delete land plot:', error);
//       toast.error('Failed to delete land plot');
//       throw error;
//     }
//   };

//   // Bulk create land plots
//   const bulkCreateLandPlots = async (plotsData, calculateDeforestation = true) => {
//     try {
//       console.log('Importing plots with deforestation calculation:', calculateDeforestation);
//       const result = await landPlotService.bulkCreateLandPlots(plotsData, calculateDeforestation);
//       await fetchLandPlots();
      
//       if (result.failed && result.failed > 0) {
//         toast.warning(`${result.created} plots created successfully, ${result.failed} failed`);
//         console.log('Failed plots:', result.failed_plots);
//         return result;
//       } else {
//         toast.success(`${result.created || plotsData.length} plots imported successfully`);
//         return result;
//       }
//     } catch (error) {
//       console.error('Failed to bulk create land plots:', error);
//       toast.error('Failed to import plots. Check console for details.');
//       throw error;
//     }
//   };

//   // useEffect(() => {
//   //   fetchLandPlots();
//   // }, []);
//   useEffect(() => {
//     if (!authLoading && isAuthenticated) {
//       // Auth is loaded and user is authenticated - fetch data
//       fetchLandPlots();
//     } else if (!authLoading && !isAuthenticated) {
//       // Not authenticated - clear data and stop loading
//       setLandPlots([]);
//       setLoading(false);
//     }
//   }, [authLoading, isAuthenticated]);

//   return (
//     <DataContext.Provider value={{ 
//       landPlots, 
//       loading,
//       fetchLandPlots,
//       createLandPlot,
//       updateLandPlot,
//       deleteLandPlot,
//       bulkCreateLandPlots
//     }}>
//       {children}
//     </DataContext.Provider>
//   );
// };

// export const useDataContext = () => useContext(DataContext);

// /* ---------------- Main Component ---------------- */
// const LandPlots = () => {
//   const { 
//     landPlots, 
//     loading,
//     fetchLandPlots,
//     createLandPlot,
//     updateLandPlot,
//     deleteLandPlot,
//     bulkCreateLandPlots
//   } = useDataContext();

//   // UI state
//   const [viewMode, setViewMode] = useState('map');
//   const [templateMenu, setTemplateMenu] = useState(null);
//   const [selectedPlots, setSelectedPlots] = useState([]);


//   // Upload flow
//   const [uploadDialog, setUploadDialog] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadStep, setUploadStep] = useState(0);
//   const [validPlots, setValidPlots] = useState([]);
//   const [invalidPlots, setInvalidPlots] = useState([]);

//   // ERP upload status
//   const [erpStatus, setErpStatus] = useState('idle');
//   const [erpImportName, setErpImportName] = useState(null);
//   const [erpFileUrl, setErpFileUrl] = useState(null);
//   const [erpLog, setErpLog] = useState('');

//   // Draw/edit
//   const [drawDialog, setDrawDialog] = useState(false);
//   const [selectedPlot, setSelectedPlot] = useState(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [drawnCoordinates, setDrawnCoordinates] = useState([]);
//   const [editDialog, setEditDialog] = useState(false);

//   // Coordinates viewer
//   const [coordDialogOpen, setCoordDialogOpen] = useState(false);
//   const [coordData, setCoordData] = useState([]);

//   // Products and deforestation calculation
//   const [products, setProducts] = useState([]);
//   const [calculateDeforestation, setCalculateDeforestation] = useState(true);

//   // Map state - simplified
//   const [mapReady, setMapReady] = useState(false);
//   const [globalTileUrls, setGlobalTileUrls] = useState(null);
//   const [layersLoading, setLayersLoading] = useState(false);

//   /* ---------------- Map refs ---------------- */
//   const mapContainerRef = useRef(null);
//   const leafletMapRef = useRef(null);
//   const plotsLayerRef = useRef(null);
//   const dotMarkersRef = useRef([]);
//   const baseLayers = useRef({});
//   const treeCoverLayerRef = useRef(null);
//   const deforestationLayerRef = useRef(null);
//   const rotationIntervalRef = useRef(null);

//   /* ---------------- Effects ---------------- */
//   useEffect(() => { fetchProducts(); }, []);


// useEffect(() => {
//   if (viewMode === 'map' && leafletMapRef.current && mapReady) {
//     requestAnimationFrame(() => {
//       setTimeout(() => {
//         if (leafletMapRef.current) {
//           // Mapbox handles resizing automatically, just redraw plots
//           const map = leafletMapRef.current;
//           if (map.isStyleLoaded()) {
//             drawPlots();
//           } else {
//             map.once('style.load', () => {
//               drawPlots();
//             });
//           }
//         }
//       }, 250);
//     });
//   }
// }, [viewMode, mapReady]);

// useEffect(() => {
//   if (!leafletMapRef.current) return;
//   const handleResize = () => {
//     // Mapbox automatically handles resize, but we can trigger it explicitly if needed
//     const map = leafletMapRef.current;
//     if (map && typeof map.resize === 'function') {
//       map.resize();
//     }
//   };
//   window.addEventListener('resize', handleResize);
//   return () => window.removeEventListener('resize', handleResize);
// }, [mapReady]);


//   // useEffect(() => {
//   //   if (viewMode !== 'map') return;

//   //   let mounted = true;
//   //   let initTimer = null;

//   //   const initMap = async () => {
//   //     try {
//   //       console.log('Starting map initialization...');

//   //       // Wait for container with polling
//   //       let attempts = 0;
//   //       const maxAttempts = 20;
        
//   //       while (!mapContainerRef.current && mounted && attempts < maxAttempts) {
//   //         console.log(`Waiting for container... attempt ${attempts + 1}/${maxAttempts}`);
//   //         await new Promise(resolve => setTimeout(resolve, 100));
//   //         attempts++;
//   //       }

//   //       if (!mapContainerRef.current) {
//   //         console.error('Map container still not available after waiting');
//   //         if (mounted) setMapReady(true);
//   //         return;
//   //       }

//   //       console.log('Container found, loading Leaflet...');

//   //       // Load CSS first
//   //       if (!document.getElementById('leaflet-css')) {
//   //         const leafletCSS = document.createElement('link');
//   //         leafletCSS.id = 'leaflet-css';
//   //         leafletCSS.rel = 'stylesheet';
//   //         leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//   //         document.head.appendChild(leafletCSS);
//   //       }

//   //       if (!document.getElementById('leaflet-draw-css')) {
//   //         const drawCSS = document.createElement('link');
//   //         drawCSS.id = 'leaflet-draw-css';
//   //         drawCSS.rel = 'stylesheet';
//   //         drawCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
//   //         document.head.appendChild(drawCSS);
//   //       }

//   //       // Load Leaflet JS
//   //       if (!window.L) {
//   //         await new Promise((resolve, reject) => {
//   //           const script = document.createElement('script');
//   //           script.id = 'leaflet-js';
//   //           script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//   //           script.onload = resolve;
//   //           script.onerror = reject;
//   //           document.body.appendChild(script);
//   //         });
//   //       }

//   //       // Load Leaflet Draw
//   //       if (!window.L?.Draw) {
//   //         await new Promise((resolve, reject) => {
//   //           const script = document.createElement('script');
//   //           script.id = 'leaflet-draw-js';
//   //           script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
//   //           script.onload = resolve;
//   //           script.onerror = reject;
//   //           document.body.appendChild(script);
//   //         });
//   //       }

//   //       // Check if still mounted after async operations
//   //       if (!mounted) {
//   //         console.log('Component unmounted during script loading');
//   //         return;
//   //       }

//   //       // Double-check container still exists
//   //       if (!mapContainerRef.current) {
//   //         console.error('Container disappeared during script loading');
//   //         if (mounted) setMapReady(true);
//   //         return;
//   //       }

//   //       const L = window.L;
        
//   //       if (!L) {
//   //         throw new Error('Leaflet failed to load');
//   //       }

//   //       // Clean up existing map
//   //       if (leafletMapRef.current) {
//   //         try {
//   //           leafletMapRef.current.remove();
//   //         } catch (e) {
//   //           console.error('Error removing old map:', e);
//   //         }
//   //         leafletMapRef.current = null;
//   //       }
        
//   //       console.log('Creating map in container...');
//   //       mapContainerRef.current.innerHTML = '';

//   //       // Define base layers
//   //       baseLayers.current = {
//   //         satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//   //           attribution: 'Tiles © Esri',
//   //           maxZoom: 18
//   //         }),
//   //         street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   //           attribution: '© OpenStreetMap contributors',
//   //           maxZoom: 19
//   //         }),
//   //         hybrid: L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
//   //           maxZoom: 20,
//   //           subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
//   //           attribution: '© Google'
//   //         })
//   //       };

//   //       // Create map
//   //       const map = L.map(mapContainerRef.current, {
//   //         center: [20, 0],
//   //         zoom: 2,
//   //         zoomControl: true,
//   //         dragging: true,
//   //         scrollWheelZoom: true,
//   //         layers: [baseLayers.current.satellite]
//   //       });

//   //       if (!mounted) return;

//   //       leafletMapRef.current = map;

//   //       // Create plots layer
//   //       plotsLayerRef.current = L.layerGroup().addTo(map);
//   //       dotMarkersRef.current = [];

//   //       // Handle zoom events
//   //       map.on('zoomend', () => {
//   //         const z = map.getZoom();
//   //         dotMarkersRef.current.forEach(marker => {
//   //           if (marker.setStyle) {
//   //             marker.setStyle({ radius: dotRadiusForZoom(z) });
//   //           }
//   //         });
//   //       });

//   //       console.log('Map created successfully');

//   //       // Set ready immediately
//   //       if (mounted) {
//   //         setMapReady(true);
//   //       }

//   //       // Fix size and draw plots after a brief delay
//   //       setTimeout(() => {
//   //         if (leafletMapRef.current && mounted) {
//   //           leafletMapRef.current.invalidateSize();
//   //           drawPlots();
//   //           setupInitialLayerControl(leafletMapRef.current);
//   //           console.log('Map fully initialized');
//   //         }
//   //       }, 150);

//   //     } catch (error) {
//   //       console.error('Error initializing map:', error);
//   //       if (mounted) setMapReady(true); // Always hide spinner
//   //     }
//   //   };

//   //   // Delay initialization to let DOM settle (important for React Strict Mode)
//   //   initTimer = setTimeout(() => {
//   //     if (mounted) {
//   //       initMap();
//   //     }
//   //   }, 200);

//   //   // Cleanup
//   //   return () => {
//   //     if (initTimer) clearTimeout(initTimer);
//   //     mounted = false;
      
//   //     if (leafletMapRef.current) {
//   //       try {
//   //         leafletMapRef.current.remove();
//   //       } catch (e) {
//   //         console.error('Error removing map:', e);
//   //       }
//   //       leafletMapRef.current = null;
//   //     }
//   //     plotsLayerRef.current = null;
//   //     dotMarkersRef.current = [];
//   //     treeCoverLayerRef.current = null;
//   //     deforestationLayerRef.current = null;
//   //     setMapReady(false);
//   //   };
//   // }, [viewMode]);
//   useEffect(() => {
//     if (viewMode !== 'map') return;
  
//     let mounted = true;
  
//     const initMap = async () => {
//       try {
//         console.log('Starting Mapbox map initialization...');
  
//         // Wait for container
//         let attempts = 0;
//         const maxAttempts = 20;
        
//         while (!mapContainerRef.current && mounted && attempts < maxAttempts) {
//           await new Promise(resolve => setTimeout(resolve, 100));
//           attempts++;
//         }
  
//         if (!mapContainerRef.current) {
//           console.error('Map container not available');
//           if (mounted) setMapReady(true);
//           return;
//         }
  
//         // Load Mapbox GL JS dynamically
//         if (!window.mapboxgl) {
//           const link = document.createElement('link');
//           link.rel = 'stylesheet';
//           link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
//           document.head.appendChild(link);
  
//           await new Promise((resolve, reject) => {
//             const script = document.createElement('script');
//             script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
//             script.onload = resolve;
//             script.onerror = reject;
//             document.body.appendChild(script);
//           });
//         }
  
//         if (!mounted || !mapContainerRef.current) return;
  
//         // Clean up existing map
//         if (leafletMapRef.current) {
//           try {
//             leafletMapRef.current.remove();
//           } catch (e) {
//             console.error('Error removing old map:', e);
//           }
//           leafletMapRef.current = null;
//         }
  
//         mapContainerRef.current.innerHTML = '';
  
//         // Set Mapbox access token
//         window.mapboxgl.accessToken = 'pk.eyJ1IjoiZmFpcmNvZGVsYWIiLCJhIjoiY21pMzAzNDh4MHUzNTJrc2ZkNHdvdWowZCJ9.ctPB8FDsIjXa3MgFt4GVyA';
  
//         // Initialize Mapbox map with globe projection
//         const map = new window.mapboxgl.Map({
//           container: mapContainerRef.current,
//           style: 'mapbox://styles/mapbox/satellite-streets-v12',
//           projection: 'globe',
//           center: [0, 20],
//           zoom: 1.5,
//           pitch: 0,
//           bearing: 0
//         });
  
//         if (!mounted) return;
  
//         leafletMapRef.current = map;
  
//         // Configure atmosphere and stars
//         map.on('style.load', () => {
//           map.setFog({
//             'color': 'rgb(186, 210, 235)',
//             'high-color': 'rgb(36, 92, 223)',
//             'horizon-blend': 0.02,
//             'space-color': 'rgb(11, 11, 25)',
//             'star-intensity': 0.6
//           });
//         });
  
//         // Add navigation controls
//         map.addControl(new window.mapboxgl.NavigationControl());
//         map.addControl(new window.mapboxgl.FullscreenControl());
  
//         // Globe rotation animation (optional - can be disabled)
//         let userInteracting = false;
        
//         // Only enable globe rotation if there are no plots yet
//         const enableGlobeRotation = () => {
//           if (rotationIntervalRef.current) return; // Already running
          
//           const spinGlobe = () => {
//             if (!userInteracting && !map.getSource('farm-boundary') && !map.getSource('farm-points')) {
//               const center = map.getCenter();
//               center.lng -= 0.2;
//               map.easeTo({ center, duration: 100, easing: (n) => n });
//             } else {
//               // Stop rotation if plots are being drawn
//               if (rotationIntervalRef.current) {
//                 clearInterval(rotationIntervalRef.current);
//                 rotationIntervalRef.current = null;
//               }
//             }
//           };
          
//           rotationIntervalRef.current = setInterval(spinGlobe, 100);
//         };
  
//         map.on('mousedown', () => { userInteracting = true; });
//         map.on('dragstart', () => { userInteracting = true; });
//         map.on('moveend', () => { userInteracting = false; });
  
//         // Wait for map to load before drawing plots
//         map.once('load', () => {
//           if (mounted) {
//             setMapReady(true);
            
//             // Start globe rotation only briefly (1 second) if no plots exist
//             // This gives a nice initial animation
//             if (landPlots.length === 0) {
//               enableGlobeRotation();
//               setTimeout(() => {
//                 if (rotationIntervalRef.current) {
//                   clearInterval(rotationIntervalRef.current);
//                   rotationIntervalRef.current = null;
//                 }
//               }, 1000);
//             }
            
//             // Draw plots immediately when map is ready
//             // Ensure style is loaded before drawing
//             if (map.isStyleLoaded()) {
//               drawPlots();
//             } else {
//               map.once('style.load', () => {
//                 drawPlots();
//               });
//             }
//           }
//         });
  
//         console.log('Mapbox map created successfully');
  
//       } catch (error) {
//         console.error('Error initializing Mapbox map:', error);
//         if (mounted) setMapReady(true);
//       }
//     };
  
//     const initTimer = setTimeout(() => {
//       if (mounted) {
//         initMap();
//       }
//     }, 200);
  
//     return () => {
//       mounted = false;
//       if (initTimer) clearTimeout(initTimer);
      
//       // Stop globe rotation
//       if (rotationIntervalRef.current) {
//         clearInterval(rotationIntervalRef.current);
//         rotationIntervalRef.current = null;
//       }
      
//       if (leafletMapRef.current) {
//         try {
//           leafletMapRef.current.remove();
//         } catch (e) {
//           console.error('Error removing map:', e);
//         }
//         leafletMapRef.current = null;
//       }
//       setMapReady(false);
//     };
//   }, [viewMode]);
  

//   useEffect(() => {
//     if (mapReady && leafletMapRef.current && viewMode === 'map') {
//       console.log('Land plots updated, redrawing...', landPlots.length);
      
//       // Small delay to ensure state is settled
//       setTimeout(() => {
//         if (leafletMapRef.current && mapReady) {
//           // Check if map style is loaded (Mapbox requirement)
//           const map = leafletMapRef.current;
//           if (map.isStyleLoaded()) {
//             // Redraw plots
//             drawPlots();
//             console.log('Plots redrawn successfully');
//           } else {
//             // Wait for style to load
//             map.once('style.load', () => {
//               drawPlots();
//               console.log('Plots redrawn successfully after style load');
//             });
//           }
//         }
//       }, 100);
//     }
//   }, [landPlots, mapReady, viewMode]);
  

//   // Reset upload dialog state
//   useEffect(() => {
//     if (uploadDialog) {
//       setUploadStep(0);
//       setErpStatus('idle');
//       setErpImportName(null);
//       setErpFileUrl(null);
//       setErpLog('');
//       setValidPlots([]);
//       setInvalidPlots([]);
//       setUploadedFile(null);
//     }
//   }, [uploadDialog]);

//   /* ---------------- Data fetch ---------------- */
//   const fetchProducts = async () => {
//     try {
//       const staticProducts = [
//         { _id: '1', name: 'Coffee Arabica', item_name: 'Coffee Arabica' },
//         { _id: '2', name: 'Coffee Robusta', item_name: 'Coffee Robusta' },
//         { _id: '3', name: 'Cocoa Beans', item_name: 'Cocoa Beans' },
//         { _id: '4', name: 'Palm Oil', item_name: 'Palm Oil' },
//         { _id: '5', name: 'Rubber', item_name: 'Rubber' },
//         { _id: '6', name: 'Soy', item_name: 'Soy' },
//         { _id: '7', name: 'Wood', item_name: 'Wood' },
//         { _id: '8', name: 'Cardamom', item_name: 'Cardamom' },
//       ];
//       setProducts(staticProducts);
//     } catch (error) {
//       console.error('Failed to fetch products:', error);
//       setProducts([]);
//     }
//   };


//   /* ---------------- Layer Control Setup ---------------- */
//   const setupInitialLayerControl = (map) => {
//     const L = window.L;
    
//     // Define base maps for the control
//     const baseMaps = {
//       "🛰️ Satellite": baseLayers.current.satellite,
//       "🗺️ Street Map": baseLayers.current.street, 
//       "🌍 Hybrid": baseLayers.current.hybrid
//     };

//     // Initial overlay with just land plots
//     const overlayMaps = {
//       "📍 Land Plots": plotsLayerRef.current
//     };

//     // Create and add initial layer control
//     map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
//       position: 'topright',
//       collapsed: false
//     }).addTo(map);

//     console.log('Initial layer control added');
//   };

//   const setupLayerControl = (map) => {
//     const L = window.L;
    
//     // Remove existing layer control if present
//     if (map.layerControlInstance) {
//       map.removeControl(map.layerControlInstance);
//       map.layerControlInstance = null;
//     }

//     // Define base maps for the control
//     const baseMaps = {
//       "🛰️ Satellite": baseLayers.current.satellite,
//       "🗺️ Street Map": baseLayers.current.street, 
//       "🌍 Hybrid": baseLayers.current.hybrid
//     };

//     // Create overlay layers
//     const overlayMaps = {
//       "📍 Land Plots": plotsLayerRef.current
//     };

   

//     // Create and add layer control
//     map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
//       position: 'topright',
//       collapsed: false
//     }).addTo(map);

//     console.log('Layer control updated with overlays:', Object.keys(overlayMaps));
//   };

//   /* ---------------- Map renderer ---------------- */
//   // function drawPlots() {
//   //   const L = window.L;
//   //   const map = leafletMapRef.current;
//   //   const layer = plotsLayerRef.current;
    
//   //   if (!L || !map || !layer || !mapReady) {
//   //     console.log('Map not ready for plotting');
//   //     return;
//   //   }

//   //   console.log('Drawing plots:', landPlots.length);

//   //   layer.clearLayers();
//   //   dotMarkersRef.current = [];

//   //   const allBounds = [];

//   //   landPlots.forEach(plot => {
//   //     let coordinates;
      
//   //     if (plot.coordinates) {
//   //       if (typeof plot.coordinates === 'string') {
//   //         try {
//   //           coordinates = JSON.parse(plot.coordinates);
//   //         } catch {
//   //           coordinates = [];
//   //         }
//   //       } else {
//   //         coordinates = plot.coordinates;
//   //       }
//   //     } else if (plot.geojson?.coordinates) {
//   //       if (plot.geojson.type === 'Point') {
//   //         coordinates = [plot.geojson.coordinates];
//   //       } else if (plot.geojson.coordinates[0]?.length) {
//   //         coordinates = plot.geojson.coordinates[0];
//   //       }
//   //     } else if (plot.longitude != null && plot.latitude != null) {
//   //       coordinates = [[plot.longitude, plot.latitude]];
//   //     } else {
//   //       return;
//   //     }

//   //     if (!coordinates || coordinates.length === 0) return;

//   //     const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
//   //     const isSinglePoint = latLngs.length === 1;


//   //     let productsDisplay = '';
//   //     if (Array.isArray(plot.products)) {
//   //       productsDisplay = plot.products.join(', ');
//   //     } else if (Array.isArray(plot.commodities)) {
//   //       productsDisplay = plot.commodities.join(', ');
//   //     } else if (typeof plot.commodities === 'string') {
//   //       productsDisplay = plot.commodities;
//   //     }

//   //     const popupHtml = `
//   //       <div style="font-size:14px">
//   //         <strong style="color:#2E7D32;font-size:16px">${plot.plot_id || plot.id}</strong><br/>
//   //         <strong>${plot.plot_name || plot.name || 'Unnamed Plot'}</strong><br/>
//   //         Country: ${plot.country || 'Unknown'}<br/>
//   //         Products: ${productsDisplay || 'None'}<br/>
//   //         Area: ${plot.area || 0} hectares
//   //       </div>
//   //     `;

//   //     if (isSinglePoint) {
//   //       const [lat, lng] = latLngs[0];
//   //       const dot = L.circleMarker([lat, lng], { ...styles.pointDot(map.getZoom()) }).addTo(layer);
//   //       dotMarkersRef.current.push(dot);
//   //       L.circle([lat, lng], { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);

//   //       dot.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}`, { sticky: true });
//   //       dot.bindPopup(popupHtml);

//   //       allBounds.push([lat, lng]);
//   //       return;
//   //     }

//   //     // Multi-point polygon
//   //     L.polygon(latLngs, { ...styles.polygonGlow, interactive: false }).addTo(layer);
//   //     const polygon = L.polygon(latLngs, styles.polygon).addTo(layer);

//   //     polygon.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}`, { sticky: true });
//   //     polygon.bindPopup(popupHtml);

//   //     polygon.on('click', function () {
//   //       map.fitBounds(this.getBounds(), { padding: [50, 50] });
//   //     });

//   //     const center = centroidLatLng(latLngs);
//   //     if (center) {
//   //       const dot = L.circleMarker(center, styles.pointDot(map.getZoom())).addTo(layer);
//   //       dotMarkersRef.current.push(dot);
//   //       L.circle(center, { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);
//   //     }

//   //     allBounds.push(...latLngs);
//   //   });

//   //   if (allBounds.length) {
//   //     try { 
//   //       map.fitBounds(allBounds, { padding: [50, 50] }); 
//   //     } catch (error) {
//   //       console.warn('Error fitting bounds:', error);
//   //     }
//   //   }
//   // }
//   function drawPlots() {
//     const map = leafletMapRef.current;
    
//     if (!map || !mapReady || !window.mapboxgl) {
//       console.log('Map not ready for plotting');
//       return;
//     }
  
//     console.log('Drawing plots:', landPlots.length);
  
//     // Check if map style is loaded before adding layers
//     if (!map.isStyleLoaded()) {
//       console.log('Map style not loaded yet, waiting...');
//       map.once('style.load', () => {
//         drawPlots();
//       });
//       return;
//     }
  
//     // Remove existing layers and sources
//     if (map.getLayer('farm-boundary-glow')) map.removeLayer('farm-boundary-glow');
//     if (map.getLayer('farm-boundary-fill')) map.removeLayer('farm-boundary-fill');
//     if (map.getLayer('farm-boundary-outline')) map.removeLayer('farm-boundary-outline');
//     if (map.getLayer('farm-points')) map.removeLayer('farm-points');
//     if (map.getSource('farm-boundary')) map.removeSource('farm-boundary');
//     if (map.getSource('farm-points')) map.removeSource('farm-points');
    
//     // Remove existing event listeners to prevent duplicates
//     map.off('click', 'farm-boundary-fill');
//     map.off('mouseenter', 'farm-boundary-fill');
//     map.off('mouseleave', 'farm-boundary-fill');
  
//     const allFeatures = [];
//     const pointFeatures = [];
//     const bounds = new window.mapboxgl.LngLatBounds();
  
//     landPlots.forEach(plot => {
//       let coordinates;
      
//       if (plot.coordinates) {
//         if (typeof plot.coordinates === 'string') {
//           try {
//             coordinates = JSON.parse(plot.coordinates);
//           } catch {
//             coordinates = [];
//           }
//         } else {
//           coordinates = plot.coordinates;
//         }
//       } else if (plot.geojson?.coordinates) {
//         if (plot.geojson.type === 'Point') {
//           coordinates = [plot.geojson.coordinates];
//         } else if (plot.geojson.coordinates[0]?.length) {
//           coordinates = plot.geojson.coordinates[0];
//         }
//       } else if (plot.longitude != null && plot.latitude != null) {
//         coordinates = [[plot.longitude, plot.latitude]];
//       } else {
//         return;
//       }
  
//       if (!coordinates || coordinates.length === 0) return;
  
//       const isSinglePoint = coordinates.length === 1;
  
//       let productsDisplay = '';
//       if (Array.isArray(plot.products)) {
//         productsDisplay = plot.products.join(', ');
//       } else if (Array.isArray(plot.commodities)) {
//         productsDisplay = plot.commodities.join(', ');
//       } else if (typeof plot.commodities === 'string') {
//         productsDisplay = plot.commodities;
//       }
  
//       if (isSinglePoint) {
//         // Single point
//         const [lng, lat] = coordinates[0];
//         pointFeatures.push({
//           type: 'Feature',
//           geometry: {
//             type: 'Point',
//             coordinates: [lng, lat]
//           },
//           properties: {
//             plot_id: plot.plot_id || plot.id,
//             plot_name: plot.plot_name || plot.name || 'Unnamed Plot',
//             country: plot.country || 'Unknown',
//             products: productsDisplay || 'None',
//             area: plot.area || 0
//           }
//         });
//         bounds.extend([lng, lat]);
//       } else {
//         // Polygon
//         allFeatures.push({
//           type: 'Feature',
//           geometry: {
//             type: 'Polygon',
//             coordinates: [coordinates]
//           },
//           properties: {
//             plot_id: plot.plot_id || plot.id,
//             plot_name: plot.plot_name || plot.name || 'Unnamed Plot',
//             country: plot.country || 'Unknown',
//             products: productsDisplay || 'None',
//             area: plot.area || 0
//           }
//         });
  
//         // Calculate centroid for point marker
//         let lngSum = 0, latSum = 0;
//         coordinates.forEach(([lng, lat]) => {
//           lngSum += lng;
//           latSum += lat;
//           bounds.extend([lng, lat]);
//         });
//         const centerLng = lngSum / coordinates.length;
//         const centerLat = latSum / coordinates.length;
  
//         pointFeatures.push({
//           type: 'Feature',
//           geometry: {
//             type: 'Point',
//             coordinates: [centerLng, centerLat]
//           },
//           properties: {
//             plot_id: plot.plot_id || plot.id,
//             plot_name: plot.plot_name || plot.name || 'Unnamed Plot'
//           }
//         });
//       }
//     });
  
//     // Add polygon source and layers
//     if (allFeatures.length > 0) {
//       try {
//         map.addSource('farm-boundary', {
//           type: 'geojson',
//           data: {
//             type: 'FeatureCollection',
//             features: allFeatures
//           }
//         });
//         console.log('Added farm-boundary source with', allFeatures.length, 'features');
  
//         // Glow effect layer (outline) - added first so it appears behind
//         map.addLayer({
//           id: 'farm-boundary-glow',
//           type: 'line',
//           source: 'farm-boundary',
//           paint: {
//             'line-color': '#6fc3faff',
//             'line-width': 6,
//             'line-opacity': 0.1
//           }
//         });
  
//         // Fill layer
//         map.addLayer({
//           id: 'farm-boundary-fill',
//           type: 'fill',
//           source: 'farm-boundary',
//           paint: {
//             'fill-color': '#FFFF00',
//             'fill-opacity': 0.3
//           }
//         });
  
//         // Outline layer - added last so it appears on top
//         map.addLayer({
//           id: 'farm-boundary-outline',
//           type: 'line',
//           source: 'farm-boundary',
//           paint: {
//             'line-color': '#0035f5ff',
//             'line-width': 2
//           }
//         });
//         console.log('Added farm-boundary layers successfully');
//       } catch (error) {
//         console.error('Error adding farm-boundary layers:', error);
//       }
  
//       // Add click popup (only add if layer exists)
//       if (map.getLayer('farm-boundary-fill')) {
//         map.on('click', 'farm-boundary-fill', (e) => {
//           const props = e.features[0].properties;
//           const popupHtml = `
//             <div style="font-size:14px">
//               <strong style="color:#2E7D32;font-size:16px">${props.plot_id}</strong><br/>
//               <strong>${props.plot_name}</strong><br/>
//               Country: ${props.country}<br/>
//               Products: ${props.products}<br/>
//               Area: ${props.area} hectares
//             </div>
//           `;
          
//           new window.mapboxgl.Popup()
//             .setLngLat(e.lngLat)
//             .setHTML(popupHtml)
//             .addTo(map);
//         });
  
//         // Cursor pointer on hover
//         map.on('mouseenter', 'farm-boundary-fill', () => {
//           map.getCanvas().style.cursor = 'pointer';
//         });
//         map.on('mouseleave', 'farm-boundary-fill', () => {
//           map.getCanvas().style.cursor = '';
//         });
//       }
//     }
  
//     // Add point markers
//     if (pointFeatures.length > 0) {
//       try {
//         map.addSource('farm-points', {
//           type: 'geojson',
//           data: {
//             type: 'FeatureCollection',
//             features: pointFeatures
//           }
//         });
//         console.log('Added farm-points source with', pointFeatures.length, 'features');
  
//         map.addLayer({
//           id: 'farm-points',
//           type: 'circle',
//           source: 'farm-points',
//           paint: {
//             'circle-radius': [
//               'interpolate',
//               ['linear'],
//               ['zoom'],
//               3, 8,
//               10, 12,
//               15, 18
//             ],
//             'circle-color': '#90CAF9',
//             'circle-stroke-color': '#1E88E5',
//             'circle-stroke-width': 2
//           }
//         });
//         console.log('Added farm-points layer successfully');
//       } catch (error) {
//         console.error('Error adding farm-points layer:', error);
//       }
//     }
  
//     // Fit bounds and fly to plots
//     if (!bounds.isEmpty()) {
//       // Stop any globe rotation
//       if (rotationIntervalRef.current) {
//         clearInterval(rotationIntervalRef.current);
//         rotationIntervalRef.current = null;
//       }
      
//       // Use fitBounds with smooth animation to focus on plots
//       map.fitBounds(bounds, {
//         padding: { top: 50, bottom: 50, left: 50, right: 50 },
//         maxZoom: 16,
//         duration: 2000, // 2 second smooth transition
//         essential: true
//       });
      
//       console.log('Fitting bounds to plots');
//     } else {
//       console.log('No bounds to fit - no plots with valid coordinates');
//     }
//   }
  

//   /* -------- Rest of your existing handler functions remain the same -------- */
//   const handleSync = async () => {
//     await fetchLandPlots();
//     toast.success('Land plots synced from backend');
//   };

//   const handleFileUpload = async (event) => {
//   const file = event.target.files?.[0];
//   if (!file) return;

//   setUploadedFile(file);

//   const lower = file.name.toLowerCase();
//   if (!lower.endsWith('.csv')) {
//     toast.error('Please upload a CSV file');
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = (e) => {
//     try {
//       const text = e.target.result;
//       const lines = text.split('\n').filter(line => line.trim());
//       if (lines.length <= 1) {
//         toast.error('CSV appears empty');
//         return;
//       }

//       const headerLine = lines[0];
//       const headers = headerLine.split(',').map(h => h.trim());
//       console.log('CSV Headers:', headers);
      
//       // Parse all rows first
//       const allRows = [];
//       for (let i = 1; i < lines.length; i++) {
//         const values = lines[i].split(',').map(v => v.trim());
//         if (!values[0]) continue; // Skip rows without Plot ID

//         const rowData = {};
//         headers.forEach((header, index) => {
//           rowData[header] = values[index] || '';
//         });
//         allRows.push(rowData);
//       }

//       console.log('All parsed rows:', allRows);

//       // Group rows by Plot ID and collect coordinates
//       const plotMap = new Map();
      
//       for (const row of allRows) {
//         const plotId = row['Plot ID'];
//         if (!plotId) continue;

//         // Initialize plot if not exists
//         if (!plotMap.has(plotId)) {
//           plotMap.set(plotId, {
//             id: plotId,
//             name: row['Plot Name'] || 'Unnamed Plot',
//             country: row['Country'] || '',
//             products: row['Products'] ? row['Products'].split(';').map(p => p.trim()).filter(Boolean) : [],
//             commodities: row['Products'] ? row['Products'].split(';').map(p => p.trim()).filter(Boolean) : [],
//             area: parseFloat(row['Area (hectares)']) || 0,
//             coordinates: []
//           });
//         }

//         // Add coordinates if present
//         const lat = parseFloat(row['Latitude']);
//         const lng = parseFloat(row['Longitude']);
        
//         if (!isNaN(lat) && !isNaN(lng)) {
//           plotMap.get(plotId).coordinates.push([lng, lat]);
//         }
//       }

//       // Process each plot and close polygons
//       const plots = [];
//       for (const [plotId, plotData] of plotMap.entries()) {
//         if (plotData.coordinates.length === 0) {
//           console.warn(`No coordinates found for plot ${plotId}`);
//           continue;
//         }

//         // Close polygon if it has more than 2 points
//         if (plotData.coordinates.length > 2) {
//           const firstPoint = plotData.coordinates[0];
//           const lastPoint = plotData.coordinates[plotData.coordinates.length - 1];
          
//           // Close polygon if not already closed
//           if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
//             plotData.coordinates.push([firstPoint[0], firstPoint[1]]);
//           }
//         }

//         // Set geojson based on coordinate count
//         if (plotData.coordinates.length === 1) {
//           // Single point
//           plotData.geojson = {
//             type: 'Point',
//             coordinates: plotData.coordinates[0]
//           };
//           plotData.latitude = plotData.coordinates[0][1];
//           plotData.longitude = plotData.coordinates[0][0];
//         } else if (plotData.coordinates.length > 2) {
//           // Polygon
//           plotData.geojson = {
//             type: 'Polygon',
//             coordinates: [plotData.coordinates]
//           };
//           // Calculate centroid for latitude/longitude
//           let latSum = 0, lngSum = 0;
//           for (const [lng, lat] of plotData.coordinates) {
//             latSum += lat;
//             lngSum += lng;
//           }
//           plotData.latitude = latSum / plotData.coordinates.length;
//           plotData.longitude = lngSum / plotData.coordinates.length;
//         }

//         plots.push(plotData);
//       }

//       console.log('Processed plots:', plots);
//       setValidPlots(plots);
//       setInvalidPlots([]);
//       setUploadStep(1);

//       // Background ERP save (optional)
//       (async () => {
//         try {
//           setErpStatus('uploading');
//           setErpLog('Starting import…');

//           const begin = await landPlotService.beginImport();
//           const importName = begin?.name;
//           setErpImportName(importName);

//           const up = await landPlotService.uploadImportFile({ name: importName, file });
//           const fileUrl = up?.file_url || up?.file_name || null;
//           setErpFileUrl(fileUrl);

//           await landPlotService.finalizeImport({
//             name: importName,
//             total_plots: plots.length,
//             log: `Uploaded via Land Plots UI. File: ${file.name}${fileUrl ? ` (${fileUrl})` : ''}`,
//             status: 'Imported',
//           });

//           setErpStatus('success');
//           setErpLog(`Saved as ${importName}${fileUrl ? ` • ${fileUrl}` : ''}`);
//           toast.success('CSV saved in ERPNext');
//         } catch (err) {
//           console.error('ERPNext upload failed', err);
//           setErpStatus('error');
//           setErpLog(String(err?.response?.data?.message || err?.message || err));
//           // toast.error('File import tracking failed, but you can still import the plots');
//         }
//       })();
//     } catch (error) {
//       console.error('Error parsing file:', error);
//       toast.error('Error parsing file. Please check the format.');
//     }
//   };
//   reader.readAsText(file);
// };


//   // const startDrawing = () => {
//   //   const L = window.L;
//   //   const map = leafletMapRef.current;
    
//   //   if (!L || !map) {
//   //     toast.error('Map is not ready yet.');
//   //     return;
//   //   }
    
//   //   if (!L.Draw) {
//   //     toast.error('Drawing tools are not loaded yet. Please try again in a moment.');
//   //     return;
//   //   }

//   //   setIsDrawing(true);
//   //   setDrawnCoordinates([]);

//   //   const drawnItems = new L.FeatureGroup();
//   //   map.addLayer(drawnItems);

//   //   const drawControl = new L.Control.Draw({
//   //     position: 'topright',
//   //     draw: {
//   //       polygon: {
//   //         allowIntersection: false,
//   //         drawError: { color: '#e1e100', message: '<strong>Error:</strong> Shape edges cannot cross!' },
//   //         shapeOptions: { color: '#2E7D32' }
//   //       },
//   //       polyline: false,
//   //       circle: false,
//   //       rectangle: false,
//   //       marker: false,
//   //       circlemarker: false
//   //     },
//   //     edit: { featureGroup: drawnItems }
//   //   });
//   //   map.addControl(drawControl);

//   //   map.once(L.Draw.Event.CREATED, (e) => {
//   //     const layer = e.layer;
//   //     drawnItems.addLayer(layer);
//   //     const coords = layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat]);
//   //     setDrawnCoordinates(coords);
//   //     map.removeControl(drawControl);
//   //     setIsDrawing(false);
//   //     setDrawDialog(true);
//   //   });
//   // };

//   const calculateArea = () => Math.round(Math.random() * 100 + 10);

//   const saveDrawnPlot = async () => {
//     try {
//       const newPlot = {
//         id: selectedPlot?.id || `PLOT${Date.now()}`,
//         name: selectedPlot?.name || 'New Plot',
//         country: selectedPlot?.country || '',
//         commodities: selectedPlot?.commodities || [],
//         products: selectedPlot?.products || [],
//         area: calculateArea(drawnCoordinates),
//         coordinates: drawnCoordinates
//       };

//       if (selectedPlot?.name) {
//         await updateLandPlot(selectedPlot.name, newPlot);
//       } else {
//         await createLandPlot(newPlot);
//       }

//       setDrawDialog(false);
//       setSelectedPlot(null);
//       setDrawnCoordinates([]);
//     } catch (error) {
//       // Error handled in context
//     }
//   };

//   const handleEdit = (plot) => { 
//     setSelectedPlot(plot); 
//     setEditDialog(true); 
//   };

//   const handleDelete = async (plot) => {
//     if (window.confirm('Are you sure you want to delete this land plot?')) {
//       await deleteLandPlot(plot.name);
//     }
//   };
//   const handleBulkDelete = async () => {
//     if (selectedPlots.length === 0) {
//       toast.warning('Please select plots to delete');
//       return;
//     }
  
//     const confirmed = window.confirm(
//       `Are you sure you want to delete ${selectedPlots.length} land plot(s)? This action cannot be undone.`
//     );
  
//     if (!confirmed) return;
  
//     try {      
//       // Delete all selected plots
//       const deletePromises = selectedPlots.map(plotName => 
//         landPlotService.deleteLandPlot(plotName)
//       );
      
//       await Promise.all(deletePromises);
      
//       // Refresh the list
//       await fetchLandPlots();
      
//       // Clear selection
//       setSelectedPlots([]);
      
//       toast.success(`Successfully deleted ${selectedPlots.length} land plots`);
//     } catch (error) {
//       console.error('Bulk delete failed:', error);
//       toast.error('Failed to delete some plots. Please try again.');
//     }
//   };
  
//   // Helper functions for selection
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelectedPlots(landPlots.map(plot => plot.name));
//     } else {
//       setSelectedPlots([]);
//     }
//   };
  
//   const handleSelectPlot = (plotName) => {
//     setSelectedPlots(prev => {
//       if (prev.includes(plotName)) {
//         return prev.filter(name => name !== plotName);
//       } else {
//         return [...prev, plotName];
//       }
//     });
//   };
  
//   const isSelected = (plotName) => selectedPlots.includes(plotName);
  

//   const importPlotsFromCSV = async () => {
//     try {
//       const result = await bulkCreateLandPlots(validPlots, calculateDeforestation);
//       setUploadDialog(false);
//       setUploadStep(0);
//     } catch (error) {
//       console.error('Import error:', error);
//     }
//   };
//   const changeBaseMap = (style) => {
//     const map = leafletMapRef.current;
//     if (!map) return;
  
//     const styles = {
//       satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
//       street: 'mapbox://styles/mapbox/streets-v12',
//       hybrid: 'mapbox://styles/mapbox/satellite-streets-v12'
//     };
  
//     map.setStyle(styles[style]);
    
//     // Redraw plots after style loads
//     map.once('style.load', () => {
//       drawPlots();
//     });
//   };
//   // Load Mapbox GL Draw
// const loadMapboxDraw = async () => {
//   if (!window.MapboxDraw) {
//     const link = document.createElement('link');
//     link.href = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.css';
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);

//     await new Promise((resolve, reject) => {
//       const script = document.createElement('script');
//       script.src = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.js';
//       script.onload = resolve;
//       script.onerror = reject;
//       document.body.appendChild(script);
//     });
//   }
// };

// const startDrawing = async () => {
//   const map = leafletMapRef.current;
  
//   if (!map || !window.mapboxgl) {
//     toast.error('Map is not ready yet.');
//     return;
//   }

//   await loadMapboxDraw();

//   const draw = new window.MapboxDraw({
//     displayControlsDefault: false,
//     controls: {
//       polygon: true,
//       trash: true
//     }
//   });

//   map.addControl(draw);
//   setIsDrawing(true);

//   map.on('draw.create', (e) => {
//     const coords = e.features[0].geometry.coordinates[0];
//     setDrawnCoordinates(coords);
//     map.removeControl(draw);
//     setIsDrawing(false);
//     setDrawDialog(true);
//   });
// };

  

//   const commodityOptions = ['Coffee', 'Cocoa', 'Palm Oil', 'Rubber', 'Wood', 'Soy', 'Cattle', 'Cardamom'];
//   const countryOptions = ['Brazil', 'India', 'Ghana', 'Indonesia', 'Vietnam', 'Colombia'];

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
//         <CircularProgress />
//         <Typography sx={{ ml: 2 }}>Loading land plots...</Typography>
//       </Box>
//     );
//   }

//   /* ---------------- Render ---------------- */
//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>Land Plots (EUDR)</Typography>
//         <Box>
//           <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleSync} sx={{ mr: 1 }}>
//             Sync
//           </Button>
//           <Button variant="contained" startIcon={<AddIcon />} onClick={(e) => setTemplateMenu(e.currentTarget)}>
//             Create
//           </Button>
          
//            <Menu anchorEl={templateMenu} open={Boolean(templateMenu)} onClose={() => setTemplateMenu(null)}>
//         <MenuItem onClick={() => { setUploadDialog(true); setTemplateMenu(null); }}>
//           <UploadIcon sx={{ mr: 1 }} /> Upload File
//         </MenuItem>
//         <MenuItem onClick={() => { startDrawing(); setTemplateMenu(null); }}>
//           <DrawIcon sx={{ mr: 1 }} /> Draw on Map
//         </MenuItem>
//         <Divider />
//         <MenuItem disabled>
//           <DownloadIcon sx={{ mr: 1 }} /> Download Templates
//         </MenuItem>
//         <MenuItem onClick={() => { 
//           setTemplateMenu(null); 
//           handleDownloadTemplate(); 
//         }}>
//           <DownloadIcon sx={{ mr: 1 }} /> CSV Template
//         </MenuItem>
        
//       </Menu>
//         </Box>
//       </Box>

//       {/* View Toggle */}
//       <Paper sx={{ mb: 3 }}>
//         <Tabs value={viewMode} onChange={(e, v) => setViewMode(v)}>
//           <Tab icon={<MapIcon />} label="Map View" value="map" />
//           <Tab icon={<TableIcon />} label="Table View" value="table" />
//         </Tabs>
//       </Paper>

//       {/* Map View */}
//       {viewMode === 'map' && (
//         <Box>
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
//             {isDrawing && (
//               <Alert
//                 severity="info"
//                 sx={{
//                   position: 'absolute',
//                   top: 10,
//                   left: '50%',
//                   transform: 'translateX(-50%)',
//                   zIndex: 1000,
//                   pointerEvents: 'none'
//                 }}
//               >
//                 Click on the map to draw your land plot polygon
//               </Alert>
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

          
//           {selectedPlots.length > 0 && (
//             <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e3f2fd' }}>
//               <Typography variant="body1" fontWeight="bold">
//                 {selectedPlots.length} plot(s) selected
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="error"
//                 startIcon={<DeleteIcon />}
//                 onClick={handleBulkDelete}
//               >
//                 Delete Selected
//               </Button>
//               <Button
//                 variant="outlined"
//                 onClick={() => setSelectedPlots([])}
//               >
//                 Clear Selection
//               </Button>
//             </Paper>
//           )}
//         <TableContainer component={Paper}>
//           <Table size="small">
//             <TableHead>
//               <TableRow>
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     indeterminate={
//                       selectedPlots.length > 0 && 
//                       selectedPlots.length < landPlots.length
//                     }
//                     checked={
//                       landPlots.length > 0 && 
//                       selectedPlots.length === landPlots.length
//                     }
//                     onChange={handleSelectAll}
//                   />
//                 </TableCell>
//                 <TableCell>Plot ID</TableCell>
//                 <TableCell>Plot Name</TableCell>
//                 <TableCell>Country</TableCell>
//                 <TableCell>Area (ha)</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {landPlots.map((plot) => (
//                 <TableRow key={plot.name} selected={isSelected(plot.name)}>
//                   <TableCell padding="checkbox">
//                     <Checkbox
//                       checked={isSelected(plot.name)}
//                       onChange={() => handleSelectPlot(plot.name)}
//                     />
//                   </TableCell>
//                   <TableCell>{plot.plot_id}</TableCell>
//                   <TableCell>{plot.plot_name}</TableCell>
//                   <TableCell>{plot.country}</TableCell>
//                   <TableCell>{plot.area}</TableCell>
//                   <TableCell>
//                     <IconButton size="small" onClick={() => handleEdit(plot)}>
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton size="small" onClick={() => handleDelete(plot)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         </Box>
//       )}

     
// {viewMode === 'table' && (
//   <Box>
//     {/* Bulk Actions Bar */}
//     {selectedPlots.length > 0 && (
//       <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
//         <Typography variant="body1">
//           {selectedPlots.length} plot(s) selected
//         </Typography>
//         <Button
//           variant="contained"
//           color="error"
//           startIcon={<DeleteIcon />}
//           onClick={handleBulkDelete}
//         >
//           Delete Selected
//         </Button>
//         <Button
//           variant="outlined"
//           onClick={() => setSelectedPlots([])}
//         >
//           Clear Selection
//         </Button>
//       </Paper>
//     )}

//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell padding="checkbox">
//               <Checkbox
//                 indeterminate={
//                   selectedPlots.length > 0 && 
//                   selectedPlots.length < landPlots.length
//                 }
//                 checked={
//                   landPlots.length > 0 && 
//                   selectedPlots.length === landPlots.length
//                 }
//                 onChange={handleSelectAll}
//               />
//             </TableCell>
//             <TableCell>Plot ID</TableCell>
//             <TableCell>Name</TableCell>
//             <TableCell>Country</TableCell>
//             <TableCell>Commodities</TableCell>
//             <TableCell>Area (ha)</TableCell>
//             <TableCell>Coordinates</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {landPlots.map((plot) => {
//             const isItemSelected = isSelected(plot.name);
            
//             return (
//               <TableRow
//                 key={plot.name}
//                 hover
//                 selected={isItemSelected}
//               >
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     checked={isItemSelected}
//                     onChange={() => handleSelectPlot(plot.name)}
//                   />
//                 </TableCell>
//                 <TableCell>{plot.plot_id}</TableCell>
//                 <TableCell>{plot.plot_name}</TableCell>
//                 <TableCell>{plot.country}</TableCell>
//                 <TableCell>
//                   {(() => {
//                     let commoditiesList = [];
//                     if (Array.isArray(plot.commodities)) {
//                       commoditiesList = plot.commodities;
//                     } else if (typeof plot.commodities === 'string' && plot.commodities) {
//                       commoditiesList = plot.commodities.split(',');
//                     }
//                     return commoditiesList.map(c => (
//                       <Chip key={c} label={c.trim()} size="small" sx={{ mr: 0.5 }} />
//                     ));
//                   })()}
//                 </TableCell>
//                 <TableCell>{plot.area}</TableCell>
//                 <TableCell>
//                   <IconButton
//                     size="small"
//                     onClick={() => {
//                       let coords = [];
//                       if (plot.coordinates) {
//                         if (typeof plot.coordinates === 'string') {
//                           try {
//                             coords = JSON.parse(plot.coordinates);
//                           } catch {
//                             coords = [];
//                           }
//                         } else {
//                           coords = plot.coordinates;
//                         }
//                       } else if (plot.longitude && plot.latitude) {
//                         coords = [[plot.longitude, plot.latitude]];
//                       }
//                       setCoordData(coords);
//                       setCoordDialogOpen(true);
//                     }}
//                   >
//                     <GpsFixedIcon />
//                   </IconButton>
//                   {(() => {
//                     let coords = [];
//                     if (plot.coordinates) {
//                       if (typeof plot.coordinates === 'string') {
//                         try {
//                           coords = JSON.parse(plot.coordinates);
//                         } catch {
//                           coords = [];
//                         }
//                       } else {
//                         coords = plot.coordinates;
//                       }
//                     } else if (plot.longitude && plot.latitude) {
//                       coords = [[plot.longitude, plot.latitude]];
//                     }
                    
//                     const displayCount = coords.length > 1 ? coords.length - 1 : coords.length;
//                     return coords.length > 0 ? `${displayCount} points` : '1 point';
//                   })()}
//                 </TableCell>
//                 <TableCell>
//                   <IconButton size="small" onClick={() => handleEdit(plot)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton size="small" onClick={() => handleDelete(plot)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   </Box>
// )}



//       {/* All your existing dialogs remain the same... */}
//       {/* Upload Dialog */}
//       <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Upload Land Plot Data</DialogTitle>
//         <DialogContent>
//           <Stepper activeStep={uploadStep} sx={{ mb: 3 }}>
//             <Step><StepLabel>Upload File</StepLabel></Step>
//             <Step><StepLabel>Import Land Plots</StepLabel></Step>
//           </Stepper>

//           {uploadStep === 0 && (
//             <Box>
//               <Alert severity="info" sx={{ mb: 2 }}>
//                 Supported formats: <strong>.csv</strong>. Supports both single coordinate (Latitude/Longitude) and multiple coordinate pairs per plot.
//               </Alert>

//               {erpStatus === 'uploading' && (
//                 <Alert severity="info" sx={{ mb: 2 }}>
//                   Saving file to ERPNext… {erpLog}
//                 </Alert>
//               )}
//               {erpStatus === 'success' && (
//                 <Alert severity="success" sx={{ mb: 2 }}>
//                   File saved in ERPNext {erpImportName ? `(${erpImportName})` : ''}
//                 </Alert>
//               )}
//               {/* {erpStatus === 'error' && (
//                 <Alert severity="warning" sx={{ mb: 2 }}>
//                   File tracking failed, but you can still import the plots. Details: {erpLog}
//                 </Alert>
//               )} */}

//               <Button variant="contained" component="label" startIcon={<UploadIcon />} fullWidth>
//                 Browse for a CSV
//                 <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
//               </Button>
//               {uploadedFile && <Typography sx={{ mt: 2 }}>Selected: {uploadedFile.name}</Typography>}
//             </Box>
//           )}

//           {uploadStep === 1 && (
//             <Box>
//               <Typography variant="h6" gutterBottom>Valid Plots ({validPlots.length})</Typography>
              
//               <List>
//                 {validPlots.map((plot, index) => (
//                   <ListItem key={index}>
//                     <ListItemText
//                       primary={plot.name}
//                       secondary={`${plot.country} — ${(plot.commodities || []).join(', ')} — Area: ${plot.area} ha`}
//                     />
//                     <ListItemSecondaryAction><Checkbox defaultChecked /></ListItemSecondaryAction>
//                   </ListItem>
//                 ))}
//               </List>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => { setUploadDialog(false); setUploadStep(0); }}>Cancel</Button>
//           {uploadStep === 1 && (
//             <Button variant="contained" onClick={importPlotsFromCSV}>
//               Import {validPlots.length} Plots
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>

//       {/* Draw Dialog */}
//       <Dialog open={drawDialog} onClose={() => setDrawDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Save Land Plot</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth label="Plot ID" value={selectedPlot?.id || ''}
//             onChange={(e) => setSelectedPlot({ ...selectedPlot, id: e.target.value })}
//             margin="normal" required
//           />
//           <TextField
//             fullWidth label="Plot Name" value={selectedPlot?.name || ''}
//             onChange={(e) => setSelectedPlot({ ...selectedPlot, name: e.target.value })}
//             margin="normal"
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Country</InputLabel>
//             <Select
//               value={selectedPlot?.country || ''}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
//             >
//               {countryOptions.map(country => <MenuItem key={country} value={country}>{country}</MenuItem>)}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Commodities</InputLabel>
//             <Select
//               multiple
//               value={selectedPlot?.commodities || []}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, commodities: e.target.value })}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((v) => <Chip key={v} label={v} size="small" />)}
//                 </Box>
//               )}
//             >
//               {commodityOptions.map(commodity => <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>)}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <InputLabel>Products</InputLabel>
//             <Select
//               multiple
//               value={selectedPlot?.products || []}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, products: e.target.value })}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((productId) => {
//                     const product = products.find(p => p._id === productId);
//                     return product ? <Chip key={productId} label={product.name} size="small" /> : null;
//                   })}
//                 </Box>
//               )}
//             >
//               {products.map(product => <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>)}
//             </Select>
//           </FormControl>

//           <Typography variant="body2" sx={{ mt: 2 }}>
//             Area: ~{calculateArea(drawnCoordinates)} hectares
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDrawDialog(false)}>Cancel</Button>
//           <Button variant="contained" onClick={saveDrawnPlot}>Save Plot</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Edit Land Plot</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth label="Plot ID" value={selectedPlot?.plot_id || ''}
//             onChange={(e) => setSelectedPlot({ ...selectedPlot, plot_id: e.target.value })}
//             margin="normal"
//           />
//           <TextField
//             fullWidth label="Plot Name" value={selectedPlot?.plot_name || ''}
//             onChange={(e) => setSelectedPlot({ ...selectedPlot, plot_name: e.target.value })}
//             margin="normal"
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Country</InputLabel>
//             <Select
//               value={selectedPlot?.country || ''}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
//             >
//               {countryOptions.map(country => <MenuItem key={country} value={country}>{country}</MenuItem>)}
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Commodities</InputLabel>
//             <Select
//               multiple
//               value={(() => {
//                 if (Array.isArray(selectedPlot?.commodities)) return selectedPlot.commodities;
//                 if (typeof selectedPlot?.commodities === 'string') return selectedPlot.commodities.split(',');
//                 return [];
//               })()}
//               onChange={(e) => setSelectedPlot({ ...selectedPlot, commodities: e.target.value })}
//               renderValue={(selected) => (
//                 <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                   {selected.map((v) => <Chip key={v} label={v} size="small" />)}
//                 </Box>
//               )}
//             >
//               {commodityOptions.map(commodity => <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>)}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={async () => {
//               try {
//                 await updateLandPlot(selectedPlot.name, selectedPlot);
//                 setEditDialog(false);
//               } catch (error) {
//                 // Error handled in context
//               }
//             }}
//           >
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Coordinates viewer */}
//       <CoordinateTable
//         open={coordDialogOpen}
//         onClose={() => setCoordDialogOpen(false)}
//         coordinates={coordData}
//       />
//     </Box>
//   );
// };

//  const handleDownloadTemplate = async () => {
//     try {
//       console.log('Starting template download...');
      
//       const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Latitude,Longitude
// PLOT001,Coffee Farm North,Brazil,Coffee Arabica,50,-15.7801,-47.9292
// PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232
// PLOT003,Plantrich farm,India,Cardamom,75,12.9716,77.5946
// PLOT004,Farm A Polygon,India,Cardamom,75,10.21979,77.19177
// PLOT004,,,,,10.21931,77.19199
// PLOT004,,,,,10.21927,77.19255
// PLOT004,,,,,10.21981,77.19252`;

//       // Add BOM for UTF-8 encoding
//       const BOM = '\uFEFF';
//       const csvWithBOM = BOM + csvContent;

//       // Create blob with proper MIME type
//       const blob = new Blob([csvWithBOM], { 
//         type: 'text/csv;charset=utf-8;' 
//       });

//       // Check for IE/Edge legacy support
//       if (window.navigator && window.navigator.msSaveBlob) {
//         window.navigator.msSaveBlob(blob, 'land_plots_template.csv');
//         toast.success('Template downloaded successfully!');
//         return;
//       }

//       // Modern browser approach with delay
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
      
//       // Set attributes
//       link.href = url;
//       link.download = 'land_plots_template.csv';
//       link.style.display = 'none';
      
//       // Add to DOM
//       document.body.appendChild(link);
      
//       // Use setTimeout to ensure blob URL is ready
//       setTimeout(() => {
//         // Use dispatchEvent for better browser compatibility
//         link.dispatchEvent(new MouseEvent('click', {
//           bubbles: true,
//           cancelable: true,
//           view: window
//         }));
        
//         // Clean up after a delay
//         setTimeout(() => {
//           document.body.removeChild(link);
//           window.URL.revokeObjectURL(url);
//         }, 100);
        
//         toast.success('Template downloaded successfully!');
//       }, 50);

//     } catch (error) {
//       console.error('Download failed:', error);
//       toast.error('Failed to download template. Please try again.');
//     }
//   };

//   // Alternative fallback method if the above doesn't work
//   const handleDownloadTemplateFallback = () => {
//     try {
//       const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Latitude,Longitude
// PLOT001,Coffee Farm North,Brazil,Coffee Arabica,50,-15.7801,-47.9292
// PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232
// PLOT003,Plantrich farm,India,Cardamom,75,12.9716,77.5946
// PLOT004,Farm A Polygon,India,Cardamom,75,10.21979,77.19177
// PLOT004,,,,,10.21931,77.19199
// PLOT004,,,,,10.21927,77.19255
// PLOT004,,,,,10.21981,77.19252`;

//       // Create a data URI instead of blob
//       const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      
//       const link = document.createElement('a');
//       link.href = dataUri;
//       link.download = 'land_plots_template.csv';
      
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       toast.success('Template downloaded successfully!');
//     } catch (error) {
//       console.error('Fallback download failed:', error);
//       toast.error('Download failed. Please contact support.');
//     }
//   };


// export default LandPlots;



import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { supplierService } from '../services/supplierService';
import { landPlotService } from '../services/landPlotService';
import { useAuth } from '../context/AuthContext';
// import 'mapbox-gl/dist/mapbox-gl.css'; // Kept commented as per original
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Menu,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import {
  Map as MapIcon,
  TableChart as TableIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Draw as DrawIcon,
  Refresh as RefreshIcon,
  GpsFixed as GpsFixedIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import CoordinateTable from '../components/CoordinateTable'; // Preserved import

// --- 1. Visual Helpers (Mapbox Styles) ---
const DOT_MIN = 8;
const DOT_MAX = 18;
const dotRadiusForZoom = (z) => Math.max(DOT_MIN, Math.min(DOT_MAX, 6 + (z - 3) * 1.3));
const POINT_RING_METERS = 12; // ~12m ring

const styles = {
  // FIX: Changed 8-digit hex to 6-digit hex for Mapbox compatibility
  polygon: { color: '#0035f5', fillColor: '#0035f5', fillOpacity: 0.1, weight: 2 },
  polygonGlow: { color: '#6fc3fa', weight: 6, opacity: 0.1 },
  pointDot: (z) => ({
    radius: dotRadiusForZoom(z),
    color: '#1E88E5',
    weight: 2,
    fillColor: '#90CAF9',
    fillOpacity: 1
  }),
  pointRing: { color: '#1E88E5', weight: 2, opacity: 0.8, fillOpacity: 0.05 }
};

// --- 2. Context ---
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // 1. Get isSupplier from useAuth
  const { isAuthenticated, isSupplier, loading: authLoading } = useAuth();
  const [landPlots, setLandPlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLandPlots = async () => {
    // 2. Guard clause: Stop if not authenticated OR NOT A SUPPLIER
    if (!isAuthenticated || !isSupplier) return; 

    try {
      setLoading(true);
      const response = await landPlotService.getLandPlots();
      const data = response?.data || response?.plots || [];
      setLandPlots(Array.isArray(data) ? data : []);
    } catch (error) {
      // Silence 403 errors if they slip through, log others
      if (error.response?.status === 403) {
        console.warn("Skipping land plot fetch: User not authorized.");
      } else if (error.response?.status !== 401) {
        console.error(error);
        toast.error('Failed to load land plots');
      }
      setLandPlots([]);
    } finally {
      setLoading(false);
    }
  };

  const createLandPlot = async (data, calc) => {
    await landPlotService.createLandPlot(data, calc);
    await fetchLandPlots();
    toast.success('Land plot created successfully');
  };

  const updateLandPlot = async (name, data, recalc) => {
    await landPlotService.updateLandPlot(name, data, recalc);
    await fetchLandPlots();
    toast.success('Land plot updated successfully');
  };

  const deleteLandPlot = async (name) => {
    await landPlotService.deleteLandPlot(name);
    await fetchLandPlots();
    toast.success('Land plot deleted successfully');
  };

  const bulkCreateLandPlots = async (data, calc) => {
    const result = await landPlotService.bulkCreateLandPlots(data, calc);
    await fetchLandPlots();
    if (result.failed > 0) {
      toast.warning(`${result.created} created, ${result.failed} failed`);
    } else {
      toast.success(`${result.created} plots imported successfully`);
    }
    return result;
  };

  // 3. Update useEffect to depend on isSupplier
  useEffect(() => {
    if (!authLoading && isAuthenticated && isSupplier) {
      fetchLandPlots();
    } else if (!authLoading && (!isAuthenticated || !isSupplier)) {
      setLandPlots([]);
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [authLoading, isAuthenticated, isSupplier]);

  return (
    <DataContext.Provider
      value={{
        landPlots,
        loading,
        fetchLandPlots,
        createLandPlot,
        updateLandPlot,
        deleteLandPlot,
        bulkCreateLandPlots
      }}
    >
      {children}
    </DataContext.Provider>
  );
};


export const useDataContext = () => useContext(DataContext);

// --- 3. Main Component ---
const LandPlots = () => {
  const theme = useTheme(); // Used for UI styling
  const {
    landPlots,
    loading,
    fetchLandPlots,
    createLandPlot,
    updateLandPlot,
    deleteLandPlot,
    bulkCreateLandPlots
  } = useDataContext();

  // UI State
  const [viewMode, setViewMode] = useState('map');
  const [templateMenu, setTemplateMenu] = useState(null);
  const [selectedPlots, setSelectedPlots] = useState([]); // For multi-select in table
  const [isImporting, setIsImporting] = useState(false); 

  // Upload & ERP Sync State
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStep, setUploadStep] = useState(0);
  const [validPlots, setValidPlots] = useState([]);
  const [erpStatus, setErpStatus] = useState('idle'); // idle, checking, ready, syncing, success, error
  const [erpImportName, setErpImportName] = useState(null);
  const [erpLog, setErpLog] = useState('');

  // Draw / Edit State
  const [drawDialog, setDrawDialog] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState([]);
  const [editDialog, setEditDialog] = useState(false);
  
  // Coordinate Table Modal
  const [coordDialogOpen, setCoordDialogOpen] = useState(false);
  const [coordData, setCoordData] = useState([]);

  // Products List (for Select)
  const [products, setProducts] = useState([]);
  
  // Deforestation Calculation Toggle
  const [calculateDeforestation, setCalculateDeforestation] = useState(true);

  // Map Refs
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null); // Stores the Mapbox GL instance
  const rotationIntervalRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [layersLoading, setLayersLoading] = useState(false);

  // --- Effects ---

  useEffect(() => {
    // Mock or fetch products for the dropdown
    const staticProducts = [
      { _id: '1', name: 'Coffee Arabica' },
      { _id: '2', name: 'Coffee Robusta' },
      { _id: '3', name: 'Cocoa Beans' },
      { _id: '4', name: 'Palm Oil' },
      { _id: '5', name: 'Rubber' },
      { _id: '6', name: 'Soy' },
      { _id: '7', name: 'Wood' },
      { _id: '8', name: 'Cardamom' }
    ];
    setProducts(staticProducts);
  }, []);

  // Map Initialization
  useEffect(() => {
    if (viewMode !== 'map') return;
    let mounted = true;

    const initMap = async () => {
      // 1. Ensure Mapbox GL JS is loaded
      if (!window.mapboxgl) {
        // Fallback: Try to load from CDN if not in bundle
        try {
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
        } catch (e) {
            console.error("Failed to load Mapbox:", e);
            return;
        }
      }

      if (!mapContainerRef.current) return;
      
      // Clear container
      mapContainerRef.current.innerHTML = '';
      
      // Token (Keeping original token)
      window.mapboxgl.accessToken = 'pk.eyJ1IjoiZmFpcmNvZGVsYWIiLCJhIjoiY21pMzAzNDh4MHUzNTJrc2ZkNHdvdWowZCJ9.ctPB8FDsIjXa3MgFt4GVyA';

      const map = new window.mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        projection: 'globe',
        center: [0, 20],
        zoom: 1.5,
        attributionControl: false
      });

      leafletMapRef.current = map;

      // FIX: Specific fog settings requested by user
      map.on('style.load', () => {
        map.setFog({
            'color': 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
        });
      });

      map.addControl(new window.mapboxgl.NavigationControl());
      map.addControl(new window.mapboxgl.FullscreenControl());

      // Globe rotation logic (preserved)
      const enableGlobeRotation = () => {
        if (rotationIntervalRef.current) return;
        const spinGlobe = () => {
          if (!map.getSource('farm-boundary')) {
            const center = map.getCenter();
            center.lng -= 0.2; // Speed
            map.easeTo({ center, duration: 100, easing: (n) => n });
          } else if (rotationIntervalRef.current) {
            clearInterval(rotationIntervalRef.current);
            rotationIntervalRef.current = null;
          }
        };
        rotationIntervalRef.current = setInterval(spinGlobe, 100);
      };

      map.on('load', () => {
        if (mounted) {
          setMapReady(true);
          // If no plots, spin globe
          if (landPlots.length === 0) {
            enableGlobeRotation();
            // Stop after user interaction usually, but here simplified
            setTimeout(() => {
                if(rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
            }, 1000);
          }
          // Force resize to prevent rendering issues
          map.resize();
          drawPlots();
        }
      });
    };

    // Small delay to ensure container is rendered
    const timer = setTimeout(initMap, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
      if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
      }
      setMapReady(false);
    };
    // eslint-disable-next-line
  }, [viewMode]);

  // React to data changes
  useEffect(() => {
    if (mapReady && leafletMapRef.current && viewMode === 'map') {
      const map = leafletMapRef.current;
      if (map.isStyleLoaded()) {
        drawPlots();
      } else {
        map.once('style.load', drawPlots);
      }
    }
    // eslint-disable-next-line
  }, [landPlots, mapReady, viewMode]);

  // --- Map Drawing Logic ---
  function drawPlots() {
    const map = leafletMapRef.current;
    if (!map || !mapReady) return;

    // Cleanup old layers
    const layersToRemove = [
      'farm-boundary-glow', 'farm-boundary-fill', 'farm-boundary-outline', 
      'farm-points', 'farm-labels' // Added labels layer to cleanup
    ];
    layersToRemove.forEach(id => {
        if (map.getLayer(id)) map.removeLayer(id);
    });
    ['farm-boundary', 'farm-points'].forEach(id => {
        if (map.getSource(id)) map.removeSource(id);
    });

    const allFeatures = [];
    const pointFeatures = [];
    const bounds = new window.mapboxgl.LngLatBounds();

    landPlots.forEach(plot => {
      let coordinates;
      try {
        coordinates = typeof plot.coordinates === 'string' ? JSON.parse(plot.coordinates) : plot.coordinates;
      } catch { coordinates = []; }

      if (!coordinates || coordinates.length === 0) return;

      const isSinglePoint = coordinates.length === 1;
      const props = {
        plot_id: plot.plot_id || plot.id,
        plot_name: plot.plot_name || plot.name || 'Unnamed',
        country: plot.country || 'Unknown',
        area: plot.area || 0
      };

      if (isSinglePoint) {
        const [lng, lat] = coordinates[0];
        pointFeatures.push({ 
            type: 'Feature', 
            geometry: { type: 'Point', coordinates: [lng, lat] }, 
            properties: props 
        });
        bounds.extend([lng, lat]);
      } else {
        allFeatures.push({ 
            type: 'Feature', 
            geometry: { type: 'Polygon', coordinates: [coordinates] }, 
            properties: props 
        });
        coordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
        
        // Calculate centroid
        let lngSum = 0, latSum = 0;
        coordinates.forEach(([l, t]) => { lngSum += l; latSum += t; });
        const center = [lngSum/coordinates.length, latSum/coordinates.length];
        
        // Add point for labeling/centroid
        pointFeatures.push({ 
            type: 'Feature', 
            geometry: { type: 'Point', coordinates: center }, 
            properties: props 
        });
      }
    });

    // --- 1. Polygons Layer ---
    if (allFeatures.length > 0) {
      map.addSource('farm-boundary', { type: 'geojson', data: { type: 'FeatureCollection', features: allFeatures } });
      
      map.addLayer({ 
        id: 'farm-boundary-glow', type: 'line', source: 'farm-boundary', 
        paint: { 'line-color': '#6fc3fa', 'line-width': 6, 'line-opacity': 0.5 } 
      });
      map.addLayer({ 
        id: 'farm-boundary-fill', type: 'fill', source: 'farm-boundary', 
        paint: { 'fill-color': '#FFFF00', 'fill-opacity': 0.3 } 
      });
      map.addLayer({ 
        id: 'farm-boundary-outline', type: 'line', source: 'farm-boundary', 
        paint: { 'line-color': '#0035f5', 'line-width': 2 } 
      });
      
      // Polygon Click: Zoom to bounds
      map.on('click', 'farm-boundary-fill', (e) => {
        const geometry = e.features[0].geometry;
        if (geometry.type === 'Polygon') {
            const bounds = new window.mapboxgl.LngLatBounds();
            geometry.coordinates[0].forEach(coord => bounds.extend(coord));
            map.fitBounds(bounds, { padding: 100, maxZoom: 16, duration: 1500 });
        }
      });
      
      map.on('mouseenter', 'farm-boundary-fill', () => map.getCanvas().style.cursor = 'pointer');
      map.on('mouseleave', 'farm-boundary-fill', () => map.getCanvas().style.cursor = '');
    }

    // --- 2. Points & Labels Layer ---
    if (pointFeatures.length > 0) {
      map.addSource('farm-points', { type: 'geojson', data: { type: 'FeatureCollection', features: pointFeatures } });
      
      // Circle Dots
      map.addLayer({ 
        id: 'farm-points', 
        type: 'circle', 
        source: 'farm-points', 
        paint: { 
            'circle-radius': 6, 
            'circle-color': '#90CAF9', 
            'circle-stroke-width': 2, 
            'circle-stroke-color': '#1E88E5' 
        } 
      });

      // LABELS: Add text labels above points
      map.addLayer({
        id: 'farm-labels',
        type: 'symbol',
        source: 'farm-points',
        layout: {
          'text-field': ['get', 'plot_name'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 1.2], // Move text slightly below/above point
          'text-anchor': 'top',
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 2
        }
      });

      // Point Click: Fly to location
      map.on('click', 'farm-points', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        map.flyTo({
            center: coordinates,
            zoom: 16,
            essential: true,
            duration: 2000
        });
        
        // Show popup as well
        new window.mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`<b>${e.features[0].properties.plot_name}</b><br/>ID: ${e.features[0].properties.plot_id}`)
            .addTo(map);
      });

      map.on('mouseenter', 'farm-points', () => map.getCanvas().style.cursor = 'pointer');
      map.on('mouseleave', 'farm-points', () => map.getCanvas().style.cursor = '');
    }

    // Initial fit bounds (only if not drawing)
    if (!bounds.isEmpty() && !isDrawing) {
        if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
        map.fitBounds(bounds, { padding: 100, maxZoom: 14, duration: 2000 });
    }
  }


  // --- Handlers ---

  const handleSync = async () => {
    await fetchLandPlots();
    toast.success('Synced successfully');
  };

  // Upload Logic (Preserved)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
        const lines = evt.target.result.split('\n').filter(l => l.trim());
        if (lines.length <= 1) return toast.error('CSV seems empty or invalid');
        
        const headers = lines[0].split(',').map(h => h.trim());
        // Logic to group lines into polygons by ID
        const plotsMap = new Map();

        // Basic CSV parsing (Plot ID, Name, Country, Product, Area, Lat, Lng)
        for(let i=1; i<lines.length; i++) {
            const vals = lines[i].split(',').map(v => v.trim());
            if(!vals[0]) continue;
            
            const id = vals[0];
            if(!plotsMap.has(id)) {
                plotsMap.set(id, { 
                    id, 
                    name: vals[1] || 'Unnamed', 
                    country: vals[2], 
                    area: parseFloat(vals[4]) || 0, 
                    coordinates: [] 
                });
            }
            const lat = parseFloat(vals[5]);
            const lng = parseFloat(vals[6]);
            if(!isNaN(lat) && !isNaN(lng)) {
                plotsMap.get(id).coordinates.push([lng, lat]);
            }
        }

        const finalPlots = Array.from(plotsMap.values()).map(p => {
            // Close loop if needed
            if(p.coordinates.length > 2 && (p.coordinates[0][0] !== p.coordinates[p.coordinates.length-1][0] || p.coordinates[0][1] !== p.coordinates[p.coordinates.length-1][1])) {
                p.coordinates.push(p.coordinates[0]);
            }
            return p;
        });
        
        setValidPlots(finalPlots);
        setUploadStep(1);
        
        // Simulate ERP check
        setErpStatus('idle');
    };
    reader.readAsText(file);
  };

  const importPlotsFromCSV = async () => {
    if (isImporting) return; // Prevent double-click logic
    setIsImporting(true); // Start loading
    
    try {
      await bulkCreateLandPlots(validPlots, calculateDeforestation);
      setUploadDialog(false);
      setUploadStep(0);
      setUploadedFile(null);
      setValidPlots([]);
    } catch (error) {
      console.error("Import failed", error);
    } finally {
      setIsImporting(false); // Stop loading
    }
  };
  

  // Drawing Logic (Preserved)
  const loadMapboxDraw = async () => {
    if (!window.MapboxDraw) {
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        await new Promise((resolve) => {
            const s = document.createElement('script');
            s.src = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.js';
            s.onload = resolve;
            document.body.appendChild(s);
        });
    }
  };

  const startDrawing = async () => {
    if (!leafletMapRef.current) return toast.error('Map not ready');
    await loadMapboxDraw();
    const draw = new window.MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });
    leafletMapRef.current.addControl(draw);
    setIsDrawing(true);

    leafletMapRef.current.once('draw.create', (e) => {
        const coords = e.features[0].geometry.coordinates[0];
        setDrawnCoordinates(coords);
        // Cleanup draw control
        leafletMapRef.current.removeControl(draw);
        setIsDrawing(false);
        setDrawDialog(true);
    });
  };

  const saveDrawnPlot = async () => {
    const newPlot = {
        id: selectedPlot?.id || `PLOT-${Date.now()}`,
        name: selectedPlot?.name || 'New Plot',
        country: selectedPlot?.country || '',
        area: 0, // Backend calculates usually
        coordinates: drawnCoordinates
    };
    
    if(selectedPlot?.name) {
       // Update mode
       // logic would vary based on API, assume create logic for draw for now
    } else {
       await createLandPlot(newPlot, true);
    }
    setDrawDialog(false);
    setSelectedPlot(null);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedPlots.length} plots?`)) return;
    // Sequential delete for safety
    for (const name of selectedPlots) {
        await deleteLandPlot(name);
    }
    await fetchLandPlots();
    setSelectedPlots([]);
    toast.success('Deleted successfully');
  };

  const handleDownloadTemplate = () => {
    const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Latitude,Longitude\nPLOT001,Coffee Farm A,Brazil,Coffee,50,-15.7801,-47.9292\nPLOT001,Coffee Farm A,Brazil,Coffee,50,-15.7901,-47.9292\nPLOT001,Coffee Farm A,Brazil,Coffee,50,-15.7901,-47.9392\nPLOT001,Coffee Farm A,Brazil,Coffee,50,-15.7801,-47.9392`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'land_plot_template.csv';
    a.click();
  };

  // --- Render ---

  // if (loading) return <Box display="flex" justifyContent="center" p={10}><CircularProgress /></Box>;

  return (
    <Fade in={true}>
      <Box>
        {/* --- HEADER (Updated UI) --- */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={800} 
              sx={{ 
                mb: 0.5,
                background: 'linear-gradient(45deg, #2E3B55 30%, #6a5acd 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Land Plots (EUDR)
            </Typography>
            <Typography color="text.secondary">
              Manage and map your agricultural plots.
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            {/* Sync Button Removed as requested */}
            {/* <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleSync} sx={{ borderRadius: 2, fontWeight: 600 }}>Sync</Button> */}
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={(e) => setTemplateMenu(e.currentTarget)} 
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Create
            </Button>
            <Menu 
              anchorEl={templateMenu} 
              open={Boolean(templateMenu)} 
              onClose={() => setTemplateMenu(null)} 
              PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <MenuItem onClick={() => { setUploadDialog(true); setTemplateMenu(null); }}>
                    <UploadIcon sx={{ mr: 1 }} /> Upload CSV
                </MenuItem>
                <MenuItem onClick={() => { startDrawing(); setTemplateMenu(null); }}>
                    <DrawIcon sx={{ mr: 1 }} /> Draw on Map
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { handleDownloadTemplate(); setTemplateMenu(null); }}>
                    <DownloadIcon sx={{ mr: 1 }} /> Download Template
                </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* --- VIEW TOGGLE --- */}
        <Paper elevation={0} sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider', borderRadius: 0, bgcolor: 'transparent' }}>
            <Tabs 
                value={viewMode} 
                onChange={(e, v) => setViewMode(v)} 
                sx={{ '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' } }}
            >
                <Tab icon={<MapIcon />} label="Map View" value="map" iconPosition="start" />
                <Tab icon={<TableIcon />} label="Table View" value="table" iconPosition="start" />
            </Tabs>
        </Paper>

        {/* --- MAP VIEW --- */}
        {viewMode === 'map' && (
          <Box>
            <Paper 
              elevation={0} 
              sx={{ 
                height: '600px',
                mb: 3, 
                position: 'relative', 
                borderRadius: 4, 
                border: '1px solid', 
                borderColor: 'divider', 
                overflow: 'hidden',
                bgcolor: 'rgb(11, 11, 25)' // Match space-color of fog
              }}
            >
              <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

              {/* Loading / refreshing overlay */}
              {(loading || !mapReady) && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    backgroundColor: alpha(theme.palette.grey[900], 0.75),
                    color: 'white',
                    zIndex: 10,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <CircularProgress color="inherit" />
                  <Typography mt={2} fontWeight={600}>
                    {loading ? 'Refreshing plot data…' : 'Initializing globe…'}
                  </Typography>
                </Box>
              )}

              {isDrawing && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    position: 'absolute',
                    top: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 11,
                    fontWeight: 600 
                  }}
                >
                  Click on the map to draw polygon points. Press Enter to finish.
                </Alert>
              )}
            </Paper>
            
            {selectedPlots.length > 0 && (
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 3
                }}
              >
                <Typography fontWeight="bold">
                  {selectedPlots.length} selected
                </Typography>
                <Button color="error" startIcon={<DeleteIcon />} onClick={handleBulkDelete}>
                  Delete
                </Button>
                <Button onClick={() => setSelectedPlots([])}>Clear</Button>
              </Paper>
            )}
          </Box>
        )}


        {/* --- TABLE VIEW --- */}
        {viewMode === 'table' && (
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            {/* Loading overlay over table */}
            {loading && (
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  backgroundColor: alpha(theme.palette.background.paper, 0.7),
                  zIndex: 2
                }}
              >
                <CircularProgress />
              </Box>
            )}

            {selectedPlots.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography fontWeight={600}>
                  {selectedPlots.length} plots selected
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </Button>
                <Button size="small" onClick={() => setSelectedPlots([])}>
                  Clear
                </Button>
              </Box>
            )}

            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'background.neutral' }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox 
                        indeterminate={
                          selectedPlots.length > 0 &&
                          selectedPlots.length < landPlots.length
                        }
                        checked={
                          landPlots.length > 0 &&
                          selectedPlots.length === landPlots.length
                        }
                        onChange={(e) =>
                          setSelectedPlots(
                            e.target.checked ? landPlots.map((p) => p.name) : []
                          )
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Plot ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Country</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Commodities</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Area (ha)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, pr: 4 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {landPlots.map((plot) => (
                    <TableRow
                      key={plot.name}
                      hover
                      selected={selectedPlots.includes(plot.name)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedPlots.includes(plot.name)}
                          onChange={() =>
                            setSelectedPlots((prev) =>
                              prev.includes(plot.name)
                                ? prev.filter((x) => x !== plot.name)
                                : [...prev, plot.name]
                            )
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{plot.plot_id}</TableCell>
                      <TableCell>{plot.plot_name}</TableCell>
                      <TableCell>{plot.country}</TableCell>
                      <TableCell>
                        {(Array.isArray(plot.commodities)
                          ? plot.commodities
                          : (plot.commodities || '').split(',')
                        )
                          .filter(Boolean)
                          .map((c, i) => (
                            <Chip
                              key={i}
                              label={c}
                              size="small"
                              sx={{
                                mr: 0.5,
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                color: 'success.dark',
                                fontWeight: 600
                              }}
                            />
                          ))}
                      </TableCell>
                      <TableCell>{plot.area}</TableCell>
                      <TableCell align="right" sx={{ pr: 4 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedPlot(plot);
                            setEditDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteLandPlot(plot.name)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setCoordData(plot.coordinates || []);
                            setCoordDialogOpen(true);
                          }}
                        >
                          <GpsFixedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}


        {/* --- DIALOGS (UI Tweaked, Logic Preserved) --- */}
        
        {/* Upload Dialog */}
        <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>Upload Land Plots</DialogTitle>
            <DialogContent dividers>
                <Stepper activeStep={uploadStep} sx={{ mb: 4 }}>
                    <Step><StepLabel>Upload CSV</StepLabel></Step>
                    <Step><StepLabel>Preview & Import</StepLabel></Step>
                </Stepper>
                {uploadStep === 0 && (
                    <Box textAlign="center" py={4} border="2px dashed" borderColor="divider" borderRadius={3} bgcolor="background.default">
                        <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography gutterBottom>Drag and drop your CSV file here</Typography>
                        <Button component="label" variant="contained" sx={{ mt: 2 }}>
                            Browse File 
                            <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
                        </Button>
                    </Box>
                )}
                {uploadStep === 1 && (
                    <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>{validPlots.length} valid plots found.</Alert>
                        <List dense disablePadding>
                            {validPlots.slice(0, 5).map((p, i) => (
                                <ListItem key={i} divider><ListItemText primary={p.name} secondary={`${p.country} • ${p.area} ha`} /></ListItem>
                            ))}
                        </List>
                        {validPlots.length > 5 && <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>...and {validPlots.length - 5} more</Typography>}
                        
                        <Box mt={2}>
                            <FormControlLabel 
                                control={<Checkbox checked={calculateDeforestation} onChange={e => setCalculateDeforestation(e.target.checked)} />} 
                                label="Calculate Deforestation Risk (using Google Earth Engine)" 
                            />
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setUploadDialog(false)} disabled={isImporting}>
                  Cancel
              </Button>
              {uploadStep === 1 && (
                  <Button 
                      variant="contained" 
                      onClick={importPlotsFromCSV}
                      disabled={isImporting} // Disable while importing
                      startIcon={isImporting ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                      {isImporting ? 'Importing...' : `Import ${validPlots.length} Plots`}
                  </Button>
              )}
          </DialogActions>
        </Dialog>

        {/* Draw & Edit Dialogs */}
        <Dialog open={drawDialog || editDialog} onClose={() => { setDrawDialog(false); setEditDialog(false); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ fontWeight: 700 }}>{editDialog ? 'Edit Plot' : 'Save New Plot'}</DialogTitle>
            <DialogContent dividers>
                <TextField 
                    fullWidth label="Plot ID" margin="normal" 
                    value={selectedPlot?.id || selectedPlot?.plot_id || ''} 
                    onChange={e => setSelectedPlot({ ...selectedPlot, id: e.target.value, plot_id: e.target.value })} 
                />
                <TextField 
                    fullWidth label="Name" margin="normal" 
                    value={selectedPlot?.name || selectedPlot?.plot_name || ''} 
                    onChange={e => setSelectedPlot({ ...selectedPlot, name: e.target.value, plot_name: e.target.value })} 
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Country</InputLabel>
                    <Select 
                        value={selectedPlot?.country || ''} label="Country" 
                        onChange={e => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
                    >
                        {['Brazil', 'Vietnam', 'India', 'Ghana'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => { setDrawDialog(false); setEditDialog(false); }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={editDialog ? async () => { await updateLandPlot(selectedPlot.name, selectedPlot); setEditDialog(false); } : saveDrawnPlot}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>

        <CoordinateTable open={coordDialogOpen} onClose={() => setCoordDialogOpen(false)} coordinates={coordData} />
      </Box>
    </Fade>
  );
};

export default LandPlots;
