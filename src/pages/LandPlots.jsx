// import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
// import { supplierService } from '../services/supplierService';
// import { landPlotService } from '../services/landPlotService';
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
//   Checkbox
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
// } from '@mui/icons-material';
// import { dataService } from '../services/dataService';
// import { toast } from 'react-toastify';
// import CoordinateTable from '../components/CoordinateTable';
// import GpsFixedIcon from '@mui/icons-material/GpsFixed';

// /* ---------------- Visual helpers for POINT VISIBILITY ---------------- */
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

// /* ---------------- Context ---------------- */
// const DataContext = createContext();

// export const DataProvider = ({ children }) => {
//   const [landPlots, setLandPlots] = useState(() => {
//     const savedPlots = localStorage.getItem('landPlots');
//     return savedPlots ? JSON.parse(savedPlots) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem('landPlots', JSON.stringify(landPlots));
//   }, [landPlots]);

//   return (
//     <DataContext.Provider value={{ landPlots, setLandPlots }}>
//       {children}
//     </DataContext.Provider>
//   );
// };
// export const useDataContext = () => useContext(DataContext);

// /* ---------------- Component ---------------- */
// const LandPlots = () => {
//   const { landPlots, setLandPlots } = useDataContext();

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
//   const [erpStatus, setErpStatus] = useState('idle'); // idle | uploading | success | error
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

//   // Products
//   const [products, setProducts] = useState([]);

//   /* ---------------- Map refs (one-time init + re-render layer) ---------------- */
//   const mapContainerRef = useRef(null);   // div container
//   const leafletMapRef = useRef(null);     // L.map
//   const plotsLayerRef = useRef(null);     // L.layerGroup for polygons/dots
//   const dotMarkersRef = useRef([]);       // store circleMarkers to resize on zoom
//   const didInitRef = useRef(false);       // guards StrictMode double-mount

//   /* ---------------- Effects ---------------- */
//   useEffect(() => { fetchProducts(); }, []);

//   // One-time map init (prevents "map under the map")
//   useEffect(() => {
//     if (viewMode !== 'map') return;

//     const addCssOnce = (id, href) => {
//       if (!document.getElementById(id)) {
//         const l = document.createElement('link');
//         l.id = id; l.rel = 'stylesheet'; l.href = href;
//         document.head.appendChild(l);
//       }
//     };
//     const addScriptOnce = (id, src) => new Promise((resolve) => {
//       if (document.getElementById(id)) return resolve();
//       const s = document.createElement('script');
//       s.id = id; s.src = src; s.onload = resolve;
//       document.body.appendChild(s);
//     });

//     // If already initialized, just ensure size is correct and redraw
//     if (didInitRef.current) {
//       leafletMapRef.current?.invalidateSize();
//       drawPlots(); // re-render layer if needed
//       return;
//     }
//     didInitRef.current = true;

//     addCssOnce('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
//     addCssOnce('leaflet-draw-css', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css');

//     (async () => {
//       if (!window.L) await addScriptOnce('leaflet-js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
//       if (!window.L.Draw) await addScriptOnce('leaflet-draw-js', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js');

//       const L = window.L;

//       // nuke any innerHTML the container might have from a previous mount
//       if (mapContainerRef.current) mapContainerRef.current.innerHTML = '';

//       const map = L.map(mapContainerRef.current, {
//         tap: false,
//         dragging: true,
//         scrollWheelZoom: true,
//       }).setView([0, 0], 2);
//       leafletMapRef.current = map;

//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors'
//       }).addTo(map);

//       plotsLayerRef.current = L.layerGroup().addTo(map);
//       drawPlots();

//       // keep big dots pretty as you zoom
//       map.on('zoomend.__dots__', () => {
//         const z = map.getZoom();
//         dotMarkersRef.current.forEach(m => m.setStyle({ radius: dotRadiusForZoom(z) }));
//       });

//       // fix layout timing
//       setTimeout(() => map.invalidateSize(), 0);
//     })();

//     // cleanup on unmount
//     return () => {
//       leafletMapRef.current?.remove();
//       leafletMapRef.current = null;
//       plotsLayerRef.current = null;
//       dotMarkersRef.current = [];
//       didInitRef.current = false;
//     };
//   }, [viewMode]);

//   // Redraw plots when data changes
//   useEffect(() => { if (leafletMapRef.current) drawPlots(); }, [landPlots]);

//   // Reset ERP status when opening upload dialog
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
//       const response = await supplierService.listProducts();
//       setProducts(response?.data?.products || []);
//     } catch (error) {
//       console.error('Failed to fetch products:', error);
//     }
//   };

//   /* ---------------- Map renderer (no re-init) ---------------- */
//   function drawPlots() {
//     const L = window.L;
//     const map = leafletMapRef.current;
//     const layer = plotsLayerRef.current;
//     if (!L || !map || !layer) return;

//     layer.clearLayers();
//     dotMarkersRef.current = [];

//     const allBounds = [];

//     landPlots.forEach(plot => {
//       let coordinates;
//       if (Array.isArray(plot.coordinates) && plot.coordinates.length) {
//         coordinates = plot.coordinates; // [lng, lat]
//       } else if (plot.geojson?.coordinates?.[0]?.length) {
//         coordinates = plot.geojson.coordinates[0]; // [lng, lat]
//       } else if (plot.longitude != null && plot.latitude != null) {
//         coordinates = [[plot.longitude, plot.latitude]]; // single point
//       } else {
//         return;
//       }

//       const latLngs = coordinates.map(([lng, lat]) => [lat, lng]);
//       const isSinglePoint = latLngs.length === 1;

//       const defText = plot.deforestationData?.percentage
//         ? `<br/>Deforestation: ${plot.deforestationData.percentage.toFixed(1)}%`
//         : '';

//       const popupHtml = `
//         <div style="font-size:14px">
//           <strong style="color:#2E7D32;font-size:16px">${plot.id}</strong><br/>
//           <strong>${plot.name || 'Unnamed Plot'}</strong><br/>
//           Country: ${plot.country || 'Unknown'}<br/>
//           Products: ${(plot.products || plot.commodities || []).join(', ') || 'None'}<br/>
//           Area: ${plot.area || 0} hectares
//           ${plot.deforestationData?.percentage
//             ? `<br/><span style="color:#D32F2F">Deforestation (post-2020): ${plot.deforestationData.percentage.toFixed(1)}%<br/>Deforested Area: ${plot.deforestationData.deforestedArea?.toFixed?.(2) ?? '—'} ha</span>`
//             : ''
//           }
//         </div>
//       `;

//       if (isSinglePoint) {
//         const [lat, lng] = latLngs[0];
//         const dot = L.circleMarker([lat, lng], { ...styles.pointDot(map.getZoom()) }).addTo(layer);
//         dotMarkersRef.current.push(dot);
//         // non-interactive ring so it never blocks drag/pan
//         L.circle([lat, lng], { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);

//         dot.bindTooltip(`<strong>${plot.id}</strong><br/>${plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
//         dot.bindPopup(popupHtml);

//         allBounds.push([lat, lng]);
//         return;
//       }

//       // Glow underlay (non-interactive) + main polygon
//       L.polygon(latLngs, { ...styles.polygonGlow, interactive: false }).addTo(layer);
//       const polygon = L.polygon(latLngs, styles.polygon).addTo(layer);

//       if (plot.deforestationData?.deforestedPolygons?.coordinates) {
//         plot.deforestationData.deforestedPolygons.coordinates.forEach(defCoords => {
//           const defLatLngs = defCoords.map(([lng2, lat2]) => [lat2, lng2]);
//           L.polygon(defLatLngs, { color: '#D32F2F', fillColor: '#F44336', fillOpacity: 0.7, weight: 1 }).addTo(layer);
//         });
//       }

//       polygon.bindTooltip(`<strong>${plot.id}</strong><br/>${plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
//       polygon.bindPopup(popupHtml);

//       polygon.on('click', function () {
//         map.fitBounds(this.getBounds(), { padding: [50, 50] });
//       });

//       // centroid dot + ring for visibility at low zoom
//       const center = centroidLatLng(latLngs);
//       if (center) {
//         const dot = L.circleMarker(center, styles.pointDot(map.getZoom())).addTo(layer);
//         dotMarkersRef.current.push(dot);
//         L.circle(center, { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);
//       }

//       allBounds.push(...latLngs);
//     });

//     if (allBounds.length) {
//       try { map.fitBounds(allBounds, { padding: [50, 50] }); } catch {}
//     }
//   }

//   /* ---------------- Sync (unchanged) ---------------- */
//   const handleSync = async () => {
//     try {
//       const response = await dataService.syncLandPlots();
//       const syncedPlots = response?.data?.data || [];

//       const mergedPlots = [...landPlots];
//       syncedPlots.forEach(p => {
//         if (!mergedPlots.some(x => x.id === p.id)) mergedPlots.push(p);
//       });

//       setLandPlots(mergedPlots);
//       toast.success('Land plots synced from ERPNext');
//     } catch (error) {
//       toast.error('Failed to sync land plots');
//     }
//   };

//   /* ---------------- File upload + ERP save (unchanged) ---------------- */
//   const handleFileUpload = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setUploadedFile(file);

//     const lower = file.name.toLowerCase();
//     if (!lower.endsWith('.csv')) {
//       toast.error('Please upload a CSV file (XLSX parsing not enabled yet)');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const text = e.target.result;
//         const lines = text.split('\n').filter(line => line.trim());
//         if (lines.length <= 1) {
//           toast.error('CSV appears empty');
//           return;
//         }

//         const plots = [];
//         for (let i = 1; i < lines.length; i++) {
//           const values = lines[i].split(',').map(v => v.trim());
//           if (!values[0]) continue;

//           const productsRaw = values[3] || '';
//           const productsList = productsRaw.includes(';')
//             ? productsRaw.split(';').map(p => p.trim()).filter(Boolean)
//             : [productsRaw].filter(Boolean);

//           const coordinates = [];
//           for (let j = 5; j < values.length; j += 2) {
//             const lat = parseFloat(values[j]);
//             const lng = parseFloat(values[j + 1]);
//             if (!isNaN(lat) && !isNaN(lng)) coordinates.push([lng, lat]);
//           }
//           if (coordinates.length > 2) {
//             const first = coordinates[0], last = coordinates[coordinates.length - 1];
//             if (first[0] !== last[0] || first[1] !== last[1]) coordinates.push([...first]);
//           }

//           plots.push({
//             id: values[0] || `PLOT${Date.now()}_${i}`,
//             name: values[1] || 'Unnamed Plot',
//             country: values[2] || '',
//             commodities: productsList,
//             products: productsList,
//             area: parseFloat(values[4]) || 0,
//             coordinates,
//             geojson: coordinates.length ? { type: 'Polygon', coordinates: [coordinates] } : null
//           });
//         }

//         setValidPlots(plots);
//         setInvalidPlots([]);
//         setUploadStep(1);

//         // Save the raw CSV in ERPNext in the background
//         (async () => {
//           try {
//             setErpStatus('uploading');
//             setErpLog('Starting import…');

//             const begin = await landPlotService.beginImport(); // { name }
//             const importName = begin?.name;
//             setErpImportName(importName);

//             const up = await landPlotService.uploadImportFile({ name: importName, file });
//             const fileUrl = up?.file_url || up?.file_name || null;
//             setErpFileUrl(fileUrl);

//             await landPlotService.finalizeImport({
//               name: importName,
//               total_plots: plots.length,
//               log: `Uploaded via Land Plots UI. File: ${file.name}${fileUrl ? ` (${fileUrl})` : ''}`,
//               status: 'Imported',
//             });

//             setErpStatus('success');
//             setErpLog(`Saved as ${importName}${fileUrl ? ` • ${fileUrl}` : ''}`);
//             toast.success('CSV saved in ERPNext');
//           } catch (err) {
//             console.error('ERPNext upload failed', err);
//             setErpStatus('error');
//             setErpLog(String(err?.response?.data?.message || err?.message || err));

//             if (erpImportName) {
//               try {
//                 await landPlotService.finalizeImport({
//                   name: erpImportName,
//                   total_plots: plots.length,
//                   status: 'Failed',
//                   log: erpLog || 'Upload failed',
//                 });
//               } catch {}
//             }
//             toast.error('Saved locally. Failed to save file in ERPNext');
//           }
//         })();
//       } catch (error) {
//         console.error('Error parsing file:', error);
//         toast.error('Error parsing file. Please check the format.');
//       }
//     };
//     reader.readAsText(file);
//   };

//   /* ---------------- Draw / Edit ---------------- */
//   const startDrawing = () => {
//     const L = window.L;
//     const map = leafletMapRef.current;
//     if (!map || !L?.Draw) {
//       toast.error('Map is not ready yet.');
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

//   const saveDrawnPlot = () => {
//     const newPlot = {
//       id: selectedPlot?.id || `PLOT${Date.now()}`,
//       name: selectedPlot?.name || 'New Plot',
//       country: selectedPlot?.country || '',
//       commodities: selectedPlot?.commodities || [],
//       products: selectedPlot?.products || [],
//       area: calculateArea(drawnCoordinates),
//       coordinates: drawnCoordinates
//     };

//     if (selectedPlot?.id) {
//       setLandPlots(landPlots.map(p => p.id === selectedPlot.id ? newPlot : p));
//       toast.success('Land plot updated');
//     } else {
//       setLandPlots([...landPlots, newPlot]);
//       toast.success('Land plot created');
//     }

//     setDrawDialog(false);
//     setSelectedPlot(null);
//     setDrawnCoordinates([]);
//   };

//   const handleEdit = (plot) => { setSelectedPlot(plot); setEditDialog(true); };
//   const handleDelete = (plotId) => {
//     if (window.confirm('Are you sure you want to delete this land plot?')) {
//       setLandPlots(landPlots.filter(p => p.id !== plotId));
//       toast.success('Land plot deleted');
//     }
//   };

//   const commodityOptions = ['Coffee', 'Cocoa', 'Palm Oil', 'Rubber', 'Wood', 'Soy', 'Cattle'];
//   const countryOptions = ['Brazil', 'India', 'Ghana', 'Indonesia', 'Vietnam', 'Colombia'];

//   /* ---------------- Render ---------------- */
//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>Land Plots (EUDR)</Typography>
//         <Box>
//           <Button variant="contained" startIcon={<AddIcon />} onClick={(e) => setTemplateMenu(e.currentTarget)}>
//             Create
//           </Button>
//           <Menu anchorEl={templateMenu} open={Boolean(templateMenu)} onClose={() => setTemplateMenu(null)}>
//             <MenuItem onClick={() => { setUploadDialog(true); setTemplateMenu(null); }}>
//               <UploadIcon sx={{ mr: 1 }} /> Upload File
//             </MenuItem>
//             <MenuItem onClick={() => { startDrawing(); setTemplateMenu(null); }}>
//               <DrawIcon sx={{ mr: 1 }} /> Draw on Map
//             </MenuItem>
//             <Divider />
//             <MenuItem disabled>
//               <DownloadIcon sx={{ mr: 1 }} /> Download Templates
//             </MenuItem>
//             <MenuItem onClick={() => downloadTemplate('excel')}>Excel Template</MenuItem>
//             <MenuItem onClick={() => downloadTemplate('csv')}>CSV Template</MenuItem>
//             <MenuItem onClick={() => downloadTemplate('geojson')}>GeoJSON Template</MenuItem>
//             <MenuItem onClick={() => downloadTemplate('kml')}>KML Template</MenuItem>
//           </Menu>
//         </Box>
//       </Box>

//       {/* View Toggle */}
//       <Paper sx={{ mb: 3 }}>
//         <Tabs value={viewMode} onChange={(e, v) => setViewMode(v)}>
//           <Tab icon={<MapIcon />} label="Map View" value="map" />
//           <Tab icon={<TableChartIconFix />} label="Table View" value="table" />
//         </Tabs>
//       </Paper>

//       {/* Map View */}
//       {viewMode === 'map' && (
//         <Box>
//           <Paper sx={{ height: 500, mb: 3, position: 'relative' }}>
//             <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
//             {isDrawing && (
//               <Alert
//                 severity="info"
//                 sx={{
//                   position: 'absolute',
//                   top: 10,
//                   left: '50%',
//                   transform: 'translateX(-50%)',
//                   zIndex: 1000,
//                   pointerEvents: 'none'   // important: don't block panning
//                 }}
//               >
//                 Click on the map to draw your land plot polygon
//               </Alert>
//             )}
//           </Paper>

//           {/* Summary table under map */}
//           <TableContainer component={Paper}>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Plot ID</TableCell>
//                   <TableCell>Country</TableCell>
//                   <TableCell>Products</TableCell>
//                   <TableCell>Area (ha)</TableCell>
//                   <TableCell>Deforestation (%)</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {landPlots.map((plot) => (
//                   <TableRow key={plot.id}>
//                     <TableCell>{plot.id}</TableCell>
//                     <TableCell>{plot.country}</TableCell>
//                     <TableCell>
//                       {(plot.commodities || plot.products || []).map(c => (
//                         <Chip key={c} label={c} size="small" sx={{ mr: 0.5 }} />
//                       ))}
//                     </TableCell>
//                     <TableCell>{plot.area}</TableCell>
//                     <TableCell>
//                       {plot.deforestationData?.percentage ? (
//                         <Chip
//                           label={`${plot.deforestationData.percentage.toFixed(1)}%`}
//                           color={plot.deforestationData.percentage > 0 ? 'error' : 'success'}
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
//                       <IconButton size="small" onClick={() => handleDelete(plot.id)}>
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
//       {viewMode === 'table' && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Plot ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Country</TableCell>
//                 <TableCell>Products</TableCell>
//                 <TableCell>Area (ha)</TableCell>
//                 <TableCell>Coordinates</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {landPlots.map((plot) => (
//                 <TableRow key={plot.id}>
//                   <TableCell>{plot.id}</TableCell>
//                   <TableCell>{plot.name}</TableCell>
//                   <TableCell>{plot.country}</TableCell>
//                   <TableCell>
//                     {(plot.commodities || plot.products || []).map(c => (
//                       <Chip key={c} label={c} size="small" sx={{ mr: 0.5 }} />
//                     ))}
//                   </TableCell>
//                   <TableCell>{plot.area}</TableCell>
//                   <TableCell>
//                     <IconButton
//                       size="small"
//                       onClick={() => {
//                         const coords = plot.coordinates
//                           || (plot.geojson ? plot.geojson.coordinates[0] : [])
//                           || (plot.longitude && plot.latitude ? [[plot.longitude, plot.latitude]] : []);
//                         setCoordData(coords);
//                         setCoordDialogOpen(true);
//                       }}
//                     >
//                       <GpsFixedIcon />
//                     </IconButton>
//                     {plot.coordinates ? `${plot.coordinates.length} points` : '1 point'}
//                   </TableCell>
//                   <TableCell>
//                     <IconButton size="small" onClick={() => handleEdit(plot)}>
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton size="small" onClick={() => handleDelete(plot.id)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Upload Dialog */}
//       <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Upload Land Plot Data</DialogTitle>
//         <DialogContent>
//           <Stepper activeStep={uploadStep} sx={{ mb: 3 }}>
//             <Step><StepLabel>Upload File</StepLabel></Step>
//             <Step><StepLabel>Manage Land Plots</StepLabel></Step>
//           </Stepper>

//           {uploadStep === 0 && (
//             <Box>
//               <Alert severity="info" sx={{ mb: 2 }}>
//                 Supported formats: <strong>.csv</strong> (XLSX not enabled in this build). You can include up to 8 coordinate pairs per plot.
//               </Alert>

//               {erpStatus === 'uploading' && (
//                 <Alert severity="info" sx={{ mb: 2 }}>
//                   Saving file to ERPNext… {erpLog}
//                 </Alert>
//               )}
//               {erpStatus === 'success' && (
//                 <Alert severity="success" sx={{ mb: 2 }}>
//                   File saved in ERPNext {erpImportName ? `(${erpImportName})` : ''}{' '}
//                   {erpFileUrl ? <a href={erpFileUrl} target="_blank" rel="noreferrer">Open</a> : null}
//                 </Alert>
//               )}
//               {erpStatus === 'error' && (
//                 <Alert severity="warning" sx={{ mb: 2 }}>
//                   Couldn’t save file in ERPNext. You can still import locally. Details: {erpLog}
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
//               <List>
//                 {validPlots.map((plot, index) => (
//                   <ListItem key={index}>
//                     <ListItemText
//                       primary={plot.name}
//                       secondary={`${plot.country} — ${(plot.commodities || plot.products || []).join(', ')}`}
//                     />
//                     <ListItemSecondaryAction><Checkbox defaultChecked /></ListItemSecondaryAction>
//                   </ListItem>
//                 ))}
//               </List>

//               {erpStatus === 'success' && (
//                 <Alert severity="success" sx={{ mt: 2 }}>
//                   CSV stored in ERPNext {erpImportName ? `(${erpImportName})` : ''}{' '}
//                   {erpFileUrl ? <a href={erpFileUrl} target="_blank" rel="noreferrer">Open</a> : null}
//                 </Alert>
//               )}
//               {erpStatus === 'error' && (
//                 <Alert severity="warning" sx={{ mt: 2 }}>
//                   The CSV wasn’t saved to ERPNext, but you can still import the parsed plots locally.
//                 </Alert>
//               )}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => { setUploadDialog(false); setUploadStep(0); }}>Cancel</Button>
//           {uploadStep === 1 && (
//             <Button
//               variant="contained"
//               onClick={() => {
//                 setLandPlots([...landPlots, ...validPlots]);
//                 setUploadDialog(false);
//                 setUploadStep(0);
//                 toast.success(`${validPlots.length} plots imported successfully`);
//               }}
//             >
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

//           {/* Products */}
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
//             fullWidth label="Plot ID" value={selectedPlot?.id || ''}
//             onChange={(e) => setSelectedPlot({ ...selectedPlot, id: e.target.value })}
//             margin="normal"
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
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={() => {
//               setLandPlots(landPlots.map(p => p.id === selectedPlot.id ? selectedPlot : p));
//               setEditDialog(false);
//               toast.success('Land plot updated');
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

// // Fix for TableChart icon name collision in some bundlers
// const TableChartIconFix = (props) => <TableIcon {...props} />;

// const downloadTemplate = (format) => {
//   if (format === 'csv') {
//     const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Lat1,Lng1,Lat2,Lng2,Lat3,Lng3,Lat4,Lng4,Lat5,Lng5,Lat6,Lng6,Lat7,Lng7,Lat8,Lng8
// PLOT001,Coffee Farm North,Brazil,Coffee Arabica;Coffee Robusta,50,-15.7801,-47.9292,-15.7805,-47.9295,-15.7810,-47.9290,-15.7806,-47.9287,,,,,,,,
// PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232,7.9470,-1.0235,7.9468,-1.0228,7.9463,-1.0230,,,,,,,,`;
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'land_plots_template.csv';
//     link.click();
//     window.URL.revokeObjectURL(url);
//   }
// };

// import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
// import { supplierService } from '../services/supplierService';
// import { landPlotService } from '../services/landPlotService';
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
//   FormControlLabel,
//   Switch
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
//   Layers as LayersIcon,
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

// /* ---------------- Context with API Integration ---------------- */
// const DataContext = createContext();

// export const DataProvider = ({ children }) => {
//   const [landPlots, setLandPlots] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch land plots from backend
//   const fetchLandPlots = async () => {
//     try {
//       setLoading(true);
//       const response = await landPlotService.getLandPlots();
//       setLandPlots(response?.data || []);
//     } catch (error) {
//       console.error('Failed to fetch land plots:', error);
//       toast.error('Failed to load land plots');
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

//   // Bulk create land plots - Updated with better error handling
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

//   useEffect(() => {
//     fetchLandPlots();
//   }, []);

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

//   // Products
//   const [products, setProducts] = useState([]);

//   // Map state and deforestation calculation
//   const [mapReady, setMapReady] = useState(false);
//   const [calculateDeforestation, setCalculateDeforestation] = useState(true);

//   // Earth Engine layers state
//   const [showTreeCover, setShowTreeCover] = useState(false);
//   const [showDeforestation, setShowDeforestation] = useState(false);
//   const [globalTileUrls, setGlobalTileUrls] = useState(null);
//   const [layersLoading, setLayersLoading] = useState(false);

//   /* ---------------- Map refs ---------------- */
//   const mapContainerRef = useRef(null);
//   const leafletMapRef = useRef(null);
//   const plotsLayerRef = useRef(null);
//   const dotMarkersRef = useRef([]);
//   const treeCoverLayerRef = useRef(null);
//   const deforestationLayerRef = useRef(null);

//   /* ---------------- Effects ---------------- */
//   useEffect(() => { fetchProducts(); }, []);

//   // Load global tile URLs on component mount
//   useEffect(() => {
//     loadGlobalTileUrls();
//   }, []);

//   // FIXED: Simplified map initialization
//   useEffect(() => {
//     if (viewMode !== 'map') return;

//     // Load CSS first
//     if (!document.getElementById('leaflet-css')) {
//       const leafletCSS = document.createElement('link');
//       leafletCSS.id = 'leaflet-css';
//       leafletCSS.rel = 'stylesheet';
//       leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//       document.head.appendChild(leafletCSS);
//     }

//     if (!document.getElementById('leaflet-draw-css')) {
//       const drawCSS = document.createElement('link');
//       drawCSS.id = 'leaflet-draw-css';
//       drawCSS.rel = 'stylesheet';
//       drawCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
//       document.head.appendChild(drawCSS);
//     }

//     // Initialize map after libraries are loaded
//     const initMap = async () => {
//       // Load Leaflet library
//       if (!window.L) {
//         await new Promise((resolve) => {
//           if (document.getElementById('leaflet-js')) return resolve();
//           const script = document.createElement('script');
//           script.id = 'leaflet-js';
//           script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//           script.onload = resolve;
//           document.body.appendChild(script);
//         });
//       }

//       // Load Leaflet Draw library
//       if (!window.L?.Draw) {
//         await new Promise((resolve) => {
//           if (document.getElementById('leaflet-draw-js')) return resolve();
//           const script = document.createElement('script');
//           script.id = 'leaflet-draw-js';
//           script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
//           script.onload = resolve;
//           document.body.appendChild(script);
//         });
//       }

//       const L = window.L;
      
//       // Clean up existing map
//       if (leafletMapRef.current) {
//         leafletMapRef.current.remove();
//         leafletMapRef.current = null;
//       }

//       if (!mapContainerRef.current) return;

//       // Clear container
//       mapContainerRef.current.innerHTML = '';

//       try {
//         // Create map
//         const map = L.map(mapContainerRef.current, {
//           center: [20, 0],
//           zoom: 2,
//           zoomControl: true,
//           dragging: true,
//           scrollWheelZoom: true,
//         });

//         leafletMapRef.current = map;

//         // Add tile layer
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '© OpenStreetMap contributors',
//           maxZoom: 19
//         }).addTo(map);

//         // Create plots layer
//         plotsLayerRef.current = L.layerGroup().addTo(map);
//         dotMarkersRef.current = [];

//         // Handle zoom events for dot sizing
//         map.on('zoomend', () => {
//           const z = map.getZoom();
//           dotMarkersRef.current.forEach(marker => {
//             if (marker.setStyle) {
//               marker.setStyle({ radius: dotRadiusForZoom(z) });
//             }
//           });
//         });

//         setMapReady(true);

//         // Force size recalculation after a short delay
//         setTimeout(() => {
//           map.invalidateSize();
//           drawPlots();
//           addEarthEngineLayers();
//         }, 100);

//       } catch (error) {
//         console.error('Error initializing map:', error);
//         toast.error('Failed to initialize map');
//       }
//     };

//     initMap();

//     // Cleanup on unmount
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

//   // Redraw plots when data changes or map becomes ready
//   useEffect(() => {
//     if (mapReady && leafletMapRef.current) {
//       drawPlots();
//     }
//   }, [landPlots, mapReady]);

//   // Update Earth Engine layers when toggles change
//   useEffect(() => {
//     if (mapReady && globalTileUrls) {
//       updateEarthEngineLayers();
//     }
//   }, [showTreeCover, showDeforestation, mapReady, globalTileUrls]);

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
//       const tileUrls = await landPlotService.getGlobalDeforestationTiles();
//       setGlobalTileUrls(tileUrls);
//     } catch (error) {
//       console.error('Failed to load global tile URLs:', error);
//       toast.error('Failed to load deforestation layers');
//     } finally {
//       setLayersLoading(false);
//     }
//   };

//   /* ---------------- Earth Engine Layer Management ---------------- */
//   const addEarthEngineLayers = () => {
//     if (!leafletMapRef.current || !globalTileUrls) return;

//     const L = window.L;
//     const map = leafletMapRef.current;

//     // Create Earth Engine tile layers
//     treeCoverLayerRef.current = L.tileLayer(globalTileUrls.global_tree_cover_url, {
//       attribution: 'Hansen/UMD/Google/USGS/NASA',
//       opacity: 0.7,
//       maxZoom: 18
//     });

//     deforestationLayerRef.current = L.tileLayer(globalTileUrls.global_deforestation_url, {
//       attribution: 'Hansen/UMD/Google/USGS/NASA',
//       opacity: 0.8,
//       maxZoom: 18
//     });

//     // Add layer control
//     if (!map.layerControl) {
//       const overlayMaps = {
//         "Tree Cover 2000": treeCoverLayerRef.current,
//         "Forest Loss (2021-2024)": deforestationLayerRef.current
//       };

//       map.layerControl = L.control.layers({}, overlayMaps, {
//         position: 'topright',
//         collapsed: false
//       }).addTo(map);
//     }
//   };

//   const updateEarthEngineLayers = () => {
//     if (!leafletMapRef.current) return;

//     const map = leafletMapRef.current;

//     // Toggle tree cover layer
//     if (showTreeCover && treeCoverLayerRef.current && !map.hasLayer(treeCoverLayerRef.current)) {
//       map.addLayer(treeCoverLayerRef.current);
//     } else if (!showTreeCover && treeCoverLayerRef.current && map.hasLayer(treeCoverLayerRef.current)) {
//       map.removeLayer(treeCoverLayerRef.current);
//     }

//     // Toggle deforestation layer
//     if (showDeforestation && deforestationLayerRef.current && !map.hasLayer(deforestationLayerRef.current)) {
//       map.addLayer(deforestationLayerRef.current);
//     } else if (!showDeforestation && deforestationLayerRef.current && map.hasLayer(deforestationLayerRef.current)) {
//       map.removeLayer(deforestationLayerRef.current);
//     }
//   };

//   /* ---------------- FIXED: Map renderer ---------------- */
//   function drawPlots() {
//     const L = window.L;
//     const map = leafletMapRef.current;
//     const layer = plotsLayerRef.current;
    
//     if (!L || !map || !layer || !mapReady) {
//       console.log('Map not ready for plotting:', { L: !!L, map: !!map, layer: !!layer, mapReady });
//       return;
//     }

//     console.log('Drawing plots:', landPlots.length);

//     layer.clearLayers();
//     dotMarkersRef.current = [];

//     const allBounds = [];

//     landPlots.forEach(plot => {
//       let coordinates;
      
//       // Handle coordinates - could be string JSON or array
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

//       // Handle products display
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

//   /* ---------------- Handlers ---------------- */
//   const handleSync = async () => {
//     await fetchLandPlots();
//     toast.success('Land plots synced from backend');
//   };

//   // Updated CSV file upload handler to support both formats
//   const handleFileUpload = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setUploadedFile(file);

//     const lower = file.name.toLowerCase();
//     if (!lower.endsWith('.csv')) {
//       toast.error('Please upload a CSV file');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const text = e.target.result;
//         const lines = text.split('\n').filter(line => line.trim());
//         if (lines.length <= 1) {
//           toast.error('CSV appears empty');
//           return;
//         }

//         const headerLine = lines[0];
//         const headers = headerLine.split(',').map(h => h.trim());
//         console.log('CSV Headers:', headers);
        
//         const plots = [];
//         for (let i = 1; i < lines.length; i++) {
//           const values = lines[i].split(',').map(v => v.trim());
//           if (!values[0]) continue;

//           const hasLatLngColumns = headers.includes('Latitude') && headers.includes('Longitude');
          
//           let coordinates = [];
//           let productsRaw = '';
//           let area = 0;

//           if (hasLatLngColumns) {
//             // Handle single Latitude/Longitude format
//             const plotIdIndex = headers.indexOf('Plot ID');
//             const plotNameIndex = headers.indexOf('Plot Name');
//             const countryIndex = headers.indexOf('Country');
//             const productsIndex = headers.indexOf('Products');
//             const areaIndex = headers.indexOf('Area (hectares)');
//             const latIndex = headers.indexOf('Latitude');
//             const lngIndex = headers.indexOf('Longitude');

//             const lat = parseFloat(values[latIndex]);
//             const lng = parseFloat(values[lngIndex]);
            
//             if (!isNaN(lat) && !isNaN(lng)) {
//               coordinates = [[lng, lat]];
//             }

//             productsRaw = productsIndex !== -1 ? values[productsIndex] || '' : '';
//             area = areaIndex !== -1 ? parseFloat(values[areaIndex]) || 0 : 0;

//             const productsList = productsRaw.includes(';')
//               ? productsRaw.split(';').map(p => p.trim()).filter(Boolean)
//               : [productsRaw].filter(Boolean);

//             plots.push({
//               id: values[plotIdIndex] || `PLOT${Date.now()}_${i}`,
//               name: values[plotNameIndex] || 'Unnamed Plot',
//               country: values[countryIndex] || '',
//               commodities: productsList,
//               products: productsList,
//               area: area,
//               coordinates,
//               latitude: coordinates.length > 0 ? coordinates[0][1] : null,
//               longitude: coordinates.length > 0 ? coordinates[0][0] : null,
//               geojson: coordinates.length ? { 
//                 type: 'Point',
//                 coordinates: coordinates[0] 
//               } : null
//             });
//           } else {
//             // Handle multiple coordinate pairs format (original logic)
//             productsRaw = values[3] || '';
//             area = parseFloat(values[4]) || 0;

//             for (let j = 5; j < values.length; j += 2) {
//               const lat = parseFloat(values[j]);
//               const lng = parseFloat(values[j + 1]);
//               if (!isNaN(lat) && !isNaN(lng)) coordinates.push([lng, lat]);
//             }

//             const productsList = productsRaw.includes(';')
//               ? productsRaw.split(';').map(p => p.trim()).filter(Boolean)
//               : [productsRaw].filter(Boolean);

//             plots.push({
//               id: values[0] || `PLOT${Date.now()}_${i}`,
//               name: values[1] || 'Unnamed Plot',
//               country: values[2] || '',
//               commodities: productsList,
//               products: productsList,
//               area: area,
//               coordinates,
//               latitude: coordinates.length > 0 ? coordinates[0][1] : null,
//               longitude: coordinates.length > 0 ? coordinates[0][0] : null,
//               geojson: coordinates.length ? { 
//                 type: coordinates.length === 1 ? 'Point' : 'Polygon', 
//                 coordinates: coordinates.length === 1 ? coordinates[0] : [coordinates] 
//               } : null
//             });
//           }
//         }

//         console.log('Parsed plots:', plots);
//         setValidPlots(plots);
//         setInvalidPlots([]);
//         setUploadStep(1);

//         // Background ERP save (optional)
//         (async () => {
//           try {
//             setErpStatus('uploading');
//             setErpLog('Starting import…');

//             const begin = await landPlotService.beginImport();
//             const importName = begin?.name;
//             setErpImportName(importName);

//             const up = await landPlotService.uploadImportFile({ name: importName, file });
//             const fileUrl = up?.file_url || up?.file_name || null;
//             setErpFileUrl(fileUrl);

//             await landPlotService.finalizeImport({
//               name: importName,
//               total_plots: plots.length,
//               log: `Uploaded via Land Plots UI. File: ${file.name}${fileUrl ? ` (${fileUrl})` : ''}`,
//               status: 'Imported',
//             });

//             setErpStatus('success');
//             setErpLog(`Saved as ${importName}${fileUrl ? ` • ${fileUrl}` : ''}`);
//             toast.success('CSV saved in ERPNext');
//           } catch (err) {
//             console.error('ERPNext upload failed', err);
//             setErpStatus('error');
//             setErpLog(String(err?.response?.data?.message || err?.message || err));
//             toast.error('File import tracking failed, but you can still import the plots');
//           }
//         })();
//       } catch (error) {
//         console.error('Error parsing file:', error);
//         toast.error('Error parsing file. Please check the format.');
//       }
//     };
//     reader.readAsText(file);
//   };

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

//   // Show loading state
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
//           <Menu anchorEl={templateMenu} open={Boolean(templateMenu)} onClose={() => setTemplateMenu(null)}>
//             <MenuItem onClick={() => { setUploadDialog(true); setTemplateMenu(null); }}>
//               <UploadIcon sx={{ mr: 1 }} /> Upload File
//             </MenuItem>
//             <MenuItem onClick={() => { startDrawing(); setTemplateMenu(null); }}>
//               <DrawIcon sx={{ mr: 1 }} /> Draw on Map
//             </MenuItem>
//             <Divider />
//             <MenuItem disabled>
//               <DownloadIcon sx={{ mr: 1 }} /> Download Templates
//             </MenuItem>
//             <MenuItem onClick={() => downloadTemplate('csv')}>CSV Template</MenuItem>
//           </Menu>
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
//           {/* Earth Engine Layer Controls */}
//           <Paper sx={{ mb: 2, p: 2 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                 <LayersIcon sx={{ mr: 1, color: 'primary.main' }} />
//                 <Typography variant="h6">Earth Engine Layers</Typography>
//               </Box>
              
//               {layersLoading ? (
//                 <CircularProgress size={20} />
//               ) : (
//                 <>
//                   <FormControlLabel
//                     control={
//                       <Switch 
//                         checked={showTreeCover}
//                         onChange={(e) => setShowTreeCover(e.target.checked)}
//                         color="success"
//                       />
//                     }
//                     label="Tree Cover 2000"
//                   />
                  
//                   <FormControlLabel
//                     control={
//                       <Switch 
//                         checked={showDeforestation}
//                         onChange={(e) => setShowDeforestation(e.target.checked)}
//                         color="error"
//                       />
//                     }
//                     label="Forest Loss (2021-2024)"
//                   />
//                 </>
//               )}
//             </Box>
//           </Paper>

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
//                 <Typography sx={{ mt: 1 }}>Loading map...</Typography>
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
//       {viewMode === 'table' && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Plot ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Country</TableCell>
//                 <TableCell>Commodities</TableCell>
//                 <TableCell>Area (ha)</TableCell>
//                 <TableCell>Coordinates</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {landPlots.map((plot) => (
//                 <TableRow key={plot.name}>
//                   <TableCell>{plot.plot_id}</TableCell>
//                   <TableCell>{plot.plot_name}</TableCell>
//                   <TableCell>{plot.country}</TableCell>
//                   <TableCell>
//                     {(() => {
//                       let commoditiesList = [];
//                       if (Array.isArray(plot.commodities)) {
//                         commoditiesList = plot.commodities;
//                       } else if (typeof plot.commodities === 'string' && plot.commodities) {
//                         commoditiesList = plot.commodities.split(',');
//                       }
//                       return commoditiesList.map(c => (
//                         <Chip key={c} label={c.trim()} size="small" sx={{ mr: 0.5 }} />
//                       ));
//                     })()}
//                   </TableCell>
//                   <TableCell>{plot.area}</TableCell>
//                   <TableCell>
//                     <IconButton
//                       size="small"
//                       onClick={() => {
//                         let coords = [];
//                         if (plot.coordinates) {
//                           if (typeof plot.coordinates === 'string') {
//                             try {
//                               coords = JSON.parse(plot.coordinates);
//                             } catch {
//                               coords = [];
//                             }
//                           } else {
//                             coords = plot.coordinates;
//                           }
//                         } else if (plot.longitude && plot.latitude) {
//                           coords = [[plot.longitude, plot.latitude]];
//                         }
//                         setCoordData(coords);
//                         setCoordDialogOpen(true);
//                       }}
//                     >
//                       <GpsFixedIcon />
//                     </IconButton>
//                     {plot.coordinates ? 
//                       (typeof plot.coordinates === 'string' ? 
//                         `${JSON.parse(plot.coordinates || '[]').length} points` : 
//                         `${(plot.coordinates || []).length} points`
//                       ) : 
//                       '1 point'
//                     }
//                   </TableCell>
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
//       )}

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
              
//               {/* Deforestation calculation toggle */}
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

// // Updated template to match your CSV format
// const downloadTemplate = (format) => {
//   if (format === 'csv') {
//     const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Latitude,Longitude
// PLOT001,Coffee Farm North,Brazil,Coffee Arabica;Coffee Robusta,50,-15.7801,-47.9292
// PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232
// PLOT003,Plantrich farm,India,Cardamom,75,12.9716,77.5946`;
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'land_plots_template.csv';
//     link.click();
//     window.URL.revokeObjectURL(url);
//   }
// };

// export default LandPlots;
import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { supplierService } from '../services/supplierService';
import { landPlotService } from '../services/landPlotService';
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
  FormControlLabel
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
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import CoordinateTable from '../components/CoordinateTable';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

/* ---------------- Visual helpers for POINT VISIBILITY ---------------- */
const DOT_MIN = 8;
const DOT_MAX = 18;
const dotRadiusForZoom = (z) => Math.max(DOT_MIN, Math.min(DOT_MAX, 6 + (z - 3) * 1.3));
const POINT_RING_METERS = 12;

const styles = {
  polygon: { color: '#0035f5ff', fillColor: '#0035f5ff', fillOpacity: 0.1, weight: 2 },
  polygonGlow: { color: '#6fc3faff', weight: 6, opacity: 0.1 },
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

/* ---------------- Context with API Integration ---------------- */
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [landPlots, setLandPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch land plots from backend
  const fetchLandPlots = async () => {
    try {
      setLoading(true);
      const response = await landPlotService.getLandPlots();
      setLandPlots(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch land plots:', error);
      toast.error('Failed to load land plots');
      setLandPlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new land plot
  const createLandPlot = async (plotData, calculateDeforestation = true) => {
    try {
      await landPlotService.createLandPlot(plotData, calculateDeforestation);
      await fetchLandPlots();
      toast.success('Land plot created successfully');
    } catch (error) {
      console.error('Failed to create land plot:', error);
      toast.error('Failed to create land plot');
      throw error;
    }
  };

  // Update land plot
  const updateLandPlot = async (name, plotData, recalculateDeforestation = false) => {
    try {
      await landPlotService.updateLandPlot(name, plotData, recalculateDeforestation);
      await fetchLandPlots();
      toast.success('Land plot updated successfully');
    } catch (error) {
      console.error('Failed to update land plot:', error);
      toast.error('Failed to update land plot');
      throw error;
    }
  };

  // Delete land plot
  const deleteLandPlot = async (name) => {
    try {
      await landPlotService.deleteLandPlot(name);
      await fetchLandPlots();
      toast.success('Land plot deleted successfully');
    } catch (error) {
      console.error('Failed to delete land plot:', error);
      toast.error('Failed to delete land plot');
      throw error;
    }
  };

  // Bulk create land plots
  const bulkCreateLandPlots = async (plotsData, calculateDeforestation = true) => {
    try {
      console.log('Importing plots with deforestation calculation:', calculateDeforestation);
      const result = await landPlotService.bulkCreateLandPlots(plotsData, calculateDeforestation);
      await fetchLandPlots();
      
      if (result.failed && result.failed > 0) {
        toast.warning(`${result.created} plots created successfully, ${result.failed} failed`);
        console.log('Failed plots:', result.failed_plots);
        return result;
      } else {
        toast.success(`${result.created || plotsData.length} plots imported successfully`);
        return result;
      }
    } catch (error) {
      console.error('Failed to bulk create land plots:', error);
      toast.error('Failed to import plots. Check console for details.');
      throw error;
    }
  };

  useEffect(() => {
    fetchLandPlots();
  }, []);

  return (
    <DataContext.Provider value={{ 
      landPlots, 
      loading,
      fetchLandPlots,
      createLandPlot,
      updateLandPlot,
      deleteLandPlot,
      bulkCreateLandPlots
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);

/* ---------------- Main Component ---------------- */
const LandPlots = () => {
  const { 
    landPlots, 
    loading,
    fetchLandPlots,
    createLandPlot,
    updateLandPlot,
    deleteLandPlot,
    bulkCreateLandPlots
  } = useDataContext();

  // UI state
  const [viewMode, setViewMode] = useState('map');
  const [templateMenu, setTemplateMenu] = useState(null);

  // Upload flow
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStep, setUploadStep] = useState(0);
  const [validPlots, setValidPlots] = useState([]);
  const [invalidPlots, setInvalidPlots] = useState([]);

  // ERP upload status
  const [erpStatus, setErpStatus] = useState('idle');
  const [erpImportName, setErpImportName] = useState(null);
  const [erpFileUrl, setErpFileUrl] = useState(null);
  const [erpLog, setErpLog] = useState('');

  // Draw/edit
  const [drawDialog, setDrawDialog] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCoordinates, setDrawnCoordinates] = useState([]);
  const [editDialog, setEditDialog] = useState(false);

  // Coordinates viewer
  const [coordDialogOpen, setCoordDialogOpen] = useState(false);
  const [coordData, setCoordData] = useState([]);

  // Products and deforestation calculation
  const [products, setProducts] = useState([]);
  const [calculateDeforestation, setCalculateDeforestation] = useState(true);

  // Map state - simplified
  const [mapReady, setMapReady] = useState(false);
  const [globalTileUrls, setGlobalTileUrls] = useState(null);
  const [layersLoading, setLayersLoading] = useState(false);

  /* ---------------- Map refs ---------------- */
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const plotsLayerRef = useRef(null);
  const dotMarkersRef = useRef([]);
  const baseLayers = useRef({});
  const treeCoverLayerRef = useRef(null);
  const deforestationLayerRef = useRef(null);

  /* ---------------- Effects ---------------- */
  useEffect(() => { fetchProducts(); }, []);

  // Load global tile URLs
  useEffect(() => {
    loadGlobalTileUrls();
  }, []);

  // Update layer control when tile URLs are loaded
  useEffect(() => {
    if (mapReady && leafletMapRef.current && globalTileUrls) {
      console.log('Setting up layer control with tile URLs:', globalTileUrls);
      setupLayerControl(leafletMapRef.current);
    }
  }, [mapReady, globalTileUrls]);

  // Map initialization
  useEffect(() => {
    if (viewMode !== 'map') return;

    const initMap = async () => {
      try {
        // Load CSS first
        if (!document.getElementById('leaflet-css')) {
          const leafletCSS = document.createElement('link');
          leafletCSS.id = 'leaflet-css';
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(leafletCSS);
        }

        if (!document.getElementById('leaflet-draw-css')) {
          const drawCSS = document.createElement('link');
          drawCSS.id = 'leaflet-draw-css';
          drawCSS.rel = 'stylesheet';
          drawCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
          document.head.appendChild(drawCSS);
        }

        // Load Leaflet JS and WAIT for it to load
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

        // Load Leaflet Draw and WAIT for it to load
        if (!window.L?.Draw) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.id = 'leaflet-draw-js';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
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

        // Define base layers
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
          layers: [baseLayers.current.satellite] // Start with satellite
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
          // Setup initial layer control (will be updated when tiles load)
          setupInitialLayerControl(map);
        }, 100);

      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Failed to initialize map');
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      plotsLayerRef.current = null;
      dotMarkersRef.current = [];
      treeCoverLayerRef.current = null;
      deforestationLayerRef.current = null;
      setMapReady(false);
    };
  }, [viewMode]);

  // Redraw plots when data changes
  useEffect(() => {
    if (mapReady && leafletMapRef.current) {
      drawPlots();
    }
  }, [landPlots, mapReady]);

  // Reset upload dialog state
  useEffect(() => {
    if (uploadDialog) {
      setUploadStep(0);
      setErpStatus('idle');
      setErpImportName(null);
      setErpFileUrl(null);
      setErpLog('');
      setValidPlots([]);
      setInvalidPlots([]);
      setUploadedFile(null);
    }
  }, [uploadDialog]);

  /* ---------------- Data fetch ---------------- */
  const fetchProducts = async () => {
    try {
      const staticProducts = [
        { _id: '1', name: 'Coffee Arabica', item_name: 'Coffee Arabica' },
        { _id: '2', name: 'Coffee Robusta', item_name: 'Coffee Robusta' },
        { _id: '3', name: 'Cocoa Beans', item_name: 'Cocoa Beans' },
        { _id: '4', name: 'Palm Oil', item_name: 'Palm Oil' },
        { _id: '5', name: 'Rubber', item_name: 'Rubber' },
        { _id: '6', name: 'Soy', item_name: 'Soy' },
        { _id: '7', name: 'Wood', item_name: 'Wood' },
        { _id: '8', name: 'Cardamom', item_name: 'Cardamom' },
      ];
      setProducts(staticProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
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

  /* ---------------- Layer Control Setup ---------------- */
  const setupInitialLayerControl = (map) => {
    const L = window.L;
    
    // Define base maps for the control
    const baseMaps = {
      "🛰️ Satellite": baseLayers.current.satellite,
      "🗺️ Street Map": baseLayers.current.street, 
      "🌍 Hybrid": baseLayers.current.hybrid
    };

    // Initial overlay with just land plots
    const overlayMaps = {
      "📍 Land Plots": plotsLayerRef.current
    };

    // Create and add initial layer control
    map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
      position: 'topright',
      collapsed: false
    }).addTo(map);

    console.log('Initial layer control added');
  };

  const setupLayerControl = (map) => {
    const L = window.L;
    
    // Remove existing layer control if present
    if (map.layerControlInstance) {
      map.removeControl(map.layerControlInstance);
      map.layerControlInstance = null;
    }

    // Define base maps for the control
    const baseMaps = {
      "🛰️ Satellite": baseLayers.current.satellite,
      "🗺️ Street Map": baseLayers.current.street, 
      "🌍 Hybrid": baseLayers.current.hybrid
    };

    // Create overlay layers
    const overlayMaps = {
      "📍 Land Plots": plotsLayerRef.current
    };

    // Add Earth Engine layers if available
    if (globalTileUrls && globalTileUrls.global_tree_cover_url && globalTileUrls.global_deforestation_url) {
      try {
        console.log('Creating Earth Engine layers...');
        
        // Create tree cover layer
        if (!treeCoverLayerRef.current) {
          treeCoverLayerRef.current = L.tileLayer(globalTileUrls.global_tree_cover_url, {
            attribution: 'Hansen/UMD/Google/USGS/NASA',
            opacity: 0.7,
            maxZoom: 18
          });
          console.log('Tree cover layer created');
        }

        // Create deforestation layer
        if (!deforestationLayerRef.current) {
          deforestationLayerRef.current = L.tileLayer(globalTileUrls.global_deforestation_url, {
            attribution: 'Hansen/UMD/Google/USGS/NASA', 
            opacity: 0.8,
            maxZoom: 18
          });
          console.log('Deforestation layer created');
        }

        // Add to overlay maps
        overlayMaps["🌳 Forest Cover 2000"] = treeCoverLayerRef.current;
        overlayMaps["🔥 Forest Loss (2021-2024)"] = deforestationLayerRef.current;
        
        console.log('Earth Engine layers added to overlay maps');

      } catch (error) {
        console.error('Error creating Earth Engine layers:', error);
      }
    } else {
      console.log('Global tile URLs not available or incomplete:', globalTileUrls);
    }

    // Create and add layer control
    map.layerControlInstance = L.control.layers(baseMaps, overlayMaps, {
      position: 'topright',
      collapsed: false
    }).addTo(map);

    console.log('Layer control updated with overlays:', Object.keys(overlayMaps));
  };

  /* ---------------- Map renderer ---------------- */
  function drawPlots() {
    const L = window.L;
    const map = leafletMapRef.current;
    const layer = plotsLayerRef.current;
    
    if (!L || !map || !layer || !mapReady) {
      console.log('Map not ready for plotting');
      return;
    }

    console.log('Drawing plots:', landPlots.length);

    layer.clearLayers();
    dotMarkersRef.current = [];

    const allBounds = [];

    landPlots.forEach(plot => {
      let coordinates;
      
      if (plot.coordinates) {
        if (typeof plot.coordinates === 'string') {
          try {
            coordinates = JSON.parse(plot.coordinates);
          } catch {
            coordinates = [];
          }
        } else {
          coordinates = plot.coordinates;
        }
      } else if (plot.geojson?.coordinates) {
        if (plot.geojson.type === 'Point') {
          coordinates = [plot.geojson.coordinates];
        } else if (plot.geojson.coordinates[0]?.length) {
          coordinates = plot.geojson.coordinates[0];
        }
      } else if (plot.longitude != null && plot.latitude != null) {
        coordinates = [[plot.longitude, plot.latitude]];
      } else {
        return;
      }

      if (!coordinates || coordinates.length === 0) return;

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
        const [lat, lng] = latLngs[0];
        const dot = L.circleMarker([lat, lng], { ...styles.pointDot(map.getZoom()) }).addTo(layer);
        dotMarkersRef.current.push(dot);
        L.circle([lat, lng], { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);

        dot.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
        dot.bindPopup(popupHtml);

        allBounds.push([lat, lng]);
        return;
      }

      // Multi-point polygon
      L.polygon(latLngs, { ...styles.polygonGlow, interactive: false }).addTo(layer);
      const polygon = L.polygon(latLngs, styles.polygon).addTo(layer);

      polygon.bindTooltip(`<strong>${plot.plot_id || plot.id}</strong><br/>${plot.plot_name || plot.name || 'Unnamed Plot'}${defText}`, { sticky: true });
      polygon.bindPopup(popupHtml);

      polygon.on('click', function () {
        map.fitBounds(this.getBounds(), { padding: [50, 50] });
      });

      const center = centroidLatLng(latLngs);
      if (center) {
        const dot = L.circleMarker(center, styles.pointDot(map.getZoom())).addTo(layer);
        dotMarkersRef.current.push(dot);
        L.circle(center, { radius: POINT_RING_METERS, ...styles.pointRing, interactive: false }).addTo(layer);
      }

      allBounds.push(...latLngs);
    });

    if (allBounds.length) {
      try { 
        map.fitBounds(allBounds, { padding: [50, 50] }); 
      } catch (error) {
        console.warn('Error fitting bounds:', error);
      }
    }
  }

  /* -------- Rest of your existing handler functions remain the same -------- */
  const handleSync = async () => {
    await fetchLandPlots();
    toast.success('Land plots synced from backend');
  };

  const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setUploadedFile(file);

  const lower = file.name.toLowerCase();
  if (!lower.endsWith('.csv')) {
    toast.error('Please upload a CSV file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length <= 1) {
        toast.error('CSV appears empty');
        return;
      }

      const headerLine = lines[0];
      const headers = headerLine.split(',').map(h => h.trim());
      console.log('CSV Headers:', headers);
      
      // Parse all rows first
      const allRows = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (!values[0]) continue; // Skip rows without Plot ID

        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = values[index] || '';
        });
        allRows.push(rowData);
      }

      console.log('All parsed rows:', allRows);

      // Group rows by Plot ID and collect coordinates
      const plotMap = new Map();
      
      for (const row of allRows) {
        const plotId = row['Plot ID'];
        if (!plotId) continue;

        // Initialize plot if not exists
        if (!plotMap.has(plotId)) {
          plotMap.set(plotId, {
            id: plotId,
            name: row['Plot Name'] || 'Unnamed Plot',
            country: row['Country'] || '',
            products: row['Products'] ? row['Products'].split(';').map(p => p.trim()).filter(Boolean) : [],
            commodities: row['Products'] ? row['Products'].split(';').map(p => p.trim()).filter(Boolean) : [],
            area: parseFloat(row['Area (hectares)']) || 0,
            coordinates: []
          });
        }

        // Add coordinates if present
        const lat = parseFloat(row['Latitude']);
        const lng = parseFloat(row['Longitude']);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          plotMap.get(plotId).coordinates.push([lng, lat]);
        }
      }

      // Process each plot and close polygons
      const plots = [];
      for (const [plotId, plotData] of plotMap.entries()) {
        if (plotData.coordinates.length === 0) {
          console.warn(`No coordinates found for plot ${plotId}`);
          continue;
        }

        // Close polygon if it has more than 2 points
        if (plotData.coordinates.length > 2) {
          const firstPoint = plotData.coordinates[0];
          const lastPoint = plotData.coordinates[plotData.coordinates.length - 1];
          
          // Close polygon if not already closed
          if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
            plotData.coordinates.push([firstPoint[0], firstPoint[1]]);
          }
        }

        // Set geojson based on coordinate count
        if (plotData.coordinates.length === 1) {
          // Single point
          plotData.geojson = {
            type: 'Point',
            coordinates: plotData.coordinates[0]
          };
          plotData.latitude = plotData.coordinates[0][1];
          plotData.longitude = plotData.coordinates[0][0];
        } else if (plotData.coordinates.length > 2) {
          // Polygon
          plotData.geojson = {
            type: 'Polygon',
            coordinates: [plotData.coordinates]
          };
          // Calculate centroid for latitude/longitude
          let latSum = 0, lngSum = 0;
          for (const [lng, lat] of plotData.coordinates) {
            latSum += lat;
            lngSum += lng;
          }
          plotData.latitude = latSum / plotData.coordinates.length;
          plotData.longitude = lngSum / plotData.coordinates.length;
        }

        plots.push(plotData);
      }

      console.log('Processed plots:', plots);
      setValidPlots(plots);
      setInvalidPlots([]);
      setUploadStep(1);

      // Background ERP save (optional)
      (async () => {
        try {
          setErpStatus('uploading');
          setErpLog('Starting import…');

          const begin = await landPlotService.beginImport();
          const importName = begin?.name;
          setErpImportName(importName);

          const up = await landPlotService.uploadImportFile({ name: importName, file });
          const fileUrl = up?.file_url || up?.file_name || null;
          setErpFileUrl(fileUrl);

          await landPlotService.finalizeImport({
            name: importName,
            total_plots: plots.length,
            log: `Uploaded via Land Plots UI. File: ${file.name}${fileUrl ? ` (${fileUrl})` : ''}`,
            status: 'Imported',
          });

          setErpStatus('success');
          setErpLog(`Saved as ${importName}${fileUrl ? ` • ${fileUrl}` : ''}`);
          toast.success('CSV saved in ERPNext');
        } catch (err) {
          console.error('ERPNext upload failed', err);
          setErpStatus('error');
          setErpLog(String(err?.response?.data?.message || err?.message || err));
          toast.error('File import tracking failed, but you can still import the plots');
        }
      })();
    } catch (error) {
      console.error('Error parsing file:', error);
      toast.error('Error parsing file. Please check the format.');
    }
  };
  reader.readAsText(file);
};


  const startDrawing = () => {
    const L = window.L;
    const map = leafletMapRef.current;
    
    if (!L || !map) {
      toast.error('Map is not ready yet.');
      return;
    }
    
    if (!L.Draw) {
      toast.error('Drawing tools are not loaded yet. Please try again in a moment.');
      return;
    }

    setIsDrawing(true);
    setDrawnCoordinates([]);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: { color: '#e1e100', message: '<strong>Error:</strong> Shape edges cannot cross!' },
          shapeOptions: { color: '#2E7D32' }
        },
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false
      },
      edit: { featureGroup: drawnItems }
    });
    map.addControl(drawControl);

    map.once(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);
      const coords = layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat]);
      setDrawnCoordinates(coords);
      map.removeControl(drawControl);
      setIsDrawing(false);
      setDrawDialog(true);
    });
  };

  const calculateArea = () => Math.round(Math.random() * 100 + 10);

  const saveDrawnPlot = async () => {
    try {
      const newPlot = {
        id: selectedPlot?.id || `PLOT${Date.now()}`,
        name: selectedPlot?.name || 'New Plot',
        country: selectedPlot?.country || '',
        commodities: selectedPlot?.commodities || [],
        products: selectedPlot?.products || [],
        area: calculateArea(drawnCoordinates),
        coordinates: drawnCoordinates
      };

      if (selectedPlot?.name) {
        await updateLandPlot(selectedPlot.name, newPlot);
      } else {
        await createLandPlot(newPlot);
      }

      setDrawDialog(false);
      setSelectedPlot(null);
      setDrawnCoordinates([]);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleEdit = (plot) => { 
    setSelectedPlot(plot); 
    setEditDialog(true); 
  };

  const handleDelete = async (plot) => {
    if (window.confirm('Are you sure you want to delete this land plot?')) {
      await deleteLandPlot(plot.name);
    }
  };

  const importPlotsFromCSV = async () => {
    try {
      console.log('Importing plots with deforestation calculation:', calculateDeforestation);
      const result = await bulkCreateLandPlots(validPlots, calculateDeforestation);
      setUploadDialog(false);
      setUploadStep(0);
    } catch (error) {
      console.error('Import error:', error);
    }
  };

  const commodityOptions = ['Coffee', 'Cocoa', 'Palm Oil', 'Rubber', 'Wood', 'Soy', 'Cattle', 'Cardamom'];
  const countryOptions = ['Brazil', 'India', 'Ghana', 'Indonesia', 'Vietnam', 'Colombia'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading land plots...</Typography>
      </Box>
    );
  }

  /* ---------------- Render ---------------- */
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Land Plots (EUDR)</Typography>
        <Box>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleSync} sx={{ mr: 1 }}>
            Sync
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={(e) => setTemplateMenu(e.currentTarget)}>
            Create
          </Button>
          {/* <Menu anchorEl={templateMenu} open={Boolean(templateMenu)} onClose={() => setTemplateMenu(null)}>
            <MenuItem onClick={() => { setUploadDialog(true); setTemplateMenu(null); }}>
              <UploadIcon sx={{ mr: 1 }} /> Upload File
            </MenuItem>
            <MenuItem onClick={() => { startDrawing(); setTemplateMenu(null); }}>
              <DrawIcon sx={{ mr: 1 }} /> Draw on Map
            </MenuItem>
            <Divider />
            <MenuItem disabled>
              <DownloadIcon sx={{ mr: 1 }} /> Download Templates
            </MenuItem>
            <MenuItem onClick={() => downloadTemplate('csv')}>CSV Template</MenuItem>
          </Menu>
           */}
           <Menu anchorEl={templateMenu} open={Boolean(templateMenu)} onClose={() => setTemplateMenu(null)}>
        <MenuItem onClick={() => { setUploadDialog(true); setTemplateMenu(null); }}>
          <UploadIcon sx={{ mr: 1 }} /> Upload File
        </MenuItem>
        <MenuItem onClick={() => { startDrawing(); setTemplateMenu(null); }}>
          <DrawIcon sx={{ mr: 1 }} /> Draw on Map
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <DownloadIcon sx={{ mr: 1 }} /> Download Templates
        </MenuItem>
        <MenuItem onClick={() => { 
          setTemplateMenu(null); 
          handleDownloadTemplate(); 
        }}>
          <DownloadIcon sx={{ mr: 1 }} /> CSV Template
        </MenuItem>
        
      </Menu>
        </Box>
      </Box>

      {/* View Toggle */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={viewMode} onChange={(e, v) => setViewMode(v)}>
          <Tab icon={<MapIcon />} label="Map View" value="map" />
          <Tab icon={<TableIcon />} label="Table View" value="table" />
        </Tabs>
      </Paper>

      {/* Map View */}
      {viewMode === 'map' && (
        <Box>
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
            {isDrawing && (
              <Alert
                severity="info"
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000,
                  pointerEvents: 'none'
                }}
              >
                Click on the map to draw your land plot polygon
              </Alert>
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

          {/* Summary table under map */}
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Plot ID</TableCell>
                  <TableCell>Plot Name</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Area (ha)</TableCell>
                  <TableCell>Deforestation (%)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {landPlots.map((plot) => (
                  <TableRow key={plot.name}>
                    <TableCell>{plot.plot_id}</TableCell>
                    <TableCell>{plot.plot_name}</TableCell>
                    <TableCell>{plot.country}</TableCell>
                    <TableCell>{plot.area}</TableCell>
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
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEdit(plot)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(plot)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Table View */}
{viewMode === 'table' && (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Plot ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Country</TableCell>
          <TableCell>Commodities</TableCell>
          <TableCell>Area (ha)</TableCell>
          <TableCell>Coordinates</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {landPlots.map((plot) => (
          <TableRow key={plot.name}>
            <TableCell>{plot.plot_id}</TableCell>
            <TableCell>{plot.plot_name}</TableCell>
            <TableCell>{plot.country}</TableCell>
            <TableCell>
              {(() => {
                let commoditiesList = [];
                if (Array.isArray(plot.commodities)) {
                  commoditiesList = plot.commodities;
                } else if (typeof plot.commodities === 'string' && plot.commodities) {
                  commoditiesList = plot.commodities.split(',');
                }
                return commoditiesList.map(c => (
                  <Chip key={c} label={c.trim()} size="small" sx={{ mr: 0.5 }} />
                ));
              })()}
            </TableCell>
            <TableCell>{plot.area}</TableCell>
            <TableCell>
              <IconButton
                size="small"
                onClick={() => {
                  let coords = [];
                  if (plot.coordinates) {
                    if (typeof plot.coordinates === 'string') {
                      try {
                        coords = JSON.parse(plot.coordinates);
                      } catch {
                        coords = [];
                      }
                    } else {
                      coords = plot.coordinates;
                    }
                  } else if (plot.longitude && plot.latitude) {
                    coords = [[plot.longitude, plot.latitude]];
                  }
                  setCoordData(coords);
                  setCoordDialogOpen(true);
                }}
              >
                <GpsFixedIcon />
              </IconButton>
              {(() => {
                let coords = [];
                if (plot.coordinates) {
                  if (typeof plot.coordinates === 'string') {
                    try {
                      coords = JSON.parse(plot.coordinates);
                    } catch {
                      coords = [];
                    }
                  } else {
                    coords = plot.coordinates;
                  }
                } else if (plot.longitude && plot.latitude) {
                  coords = [[plot.longitude, plot.latitude]];
                }
                
                // For polygons (multiple points), subtract 1 to exclude closing point
                // For single points, keep as is
                const displayCount = coords.length > 1 ? coords.length - 1 : coords.length;
                return coords.length > 0 ? `${displayCount} points` : '1 point';
              })()}
            </TableCell>
            <TableCell>
              <IconButton size="small" onClick={() => handleEdit(plot)}>
                <EditIcon />
              </IconButton>
              <IconButton size="small" onClick={() => handleDelete(plot)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}


      {/* All your existing dialogs remain the same... */}
      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload Land Plot Data</DialogTitle>
        <DialogContent>
          <Stepper activeStep={uploadStep} sx={{ mb: 3 }}>
            <Step><StepLabel>Upload File</StepLabel></Step>
            <Step><StepLabel>Import Land Plots</StepLabel></Step>
          </Stepper>

          {uploadStep === 0 && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Supported formats: <strong>.csv</strong>. Supports both single coordinate (Latitude/Longitude) and multiple coordinate pairs per plot.
              </Alert>

              {erpStatus === 'uploading' && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Saving file to ERPNext… {erpLog}
                </Alert>
              )}
              {erpStatus === 'success' && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  File saved in ERPNext {erpImportName ? `(${erpImportName})` : ''}
                </Alert>
              )}
              {erpStatus === 'error' && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  File tracking failed, but you can still import the plots. Details: {erpLog}
                </Alert>
              )}

              <Button variant="contained" component="label" startIcon={<UploadIcon />} fullWidth>
                Browse for a CSV
                <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
              </Button>
              {uploadedFile && <Typography sx={{ mt: 2 }}>Selected: {uploadedFile.name}</Typography>}
            </Box>
          )}

          {uploadStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Valid Plots ({validPlots.length})</Typography>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={calculateDeforestation}
                    onChange={(e) => setCalculateDeforestation(e.target.checked)}
                  />
                }
                label="Calculate deforestation data (requires Earth Engine - may take longer)"
                sx={{ mb: 2 }}
              />
              
              <List>
                {validPlots.map((plot, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={plot.name}
                      secondary={`${plot.country} — ${(plot.commodities || []).join(', ')} — Area: ${plot.area} ha`}
                    />
                    <ListItemSecondaryAction><Checkbox defaultChecked /></ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setUploadDialog(false); setUploadStep(0); }}>Cancel</Button>
          {uploadStep === 1 && (
            <Button variant="contained" onClick={importPlotsFromCSV}>
              Import {validPlots.length} Plots
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Draw Dialog */}
      <Dialog open={drawDialog} onClose={() => setDrawDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Land Plot</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Plot ID" value={selectedPlot?.id || ''}
            onChange={(e) => setSelectedPlot({ ...selectedPlot, id: e.target.value })}
            margin="normal" required
          />
          <TextField
            fullWidth label="Plot Name" value={selectedPlot?.name || ''}
            onChange={(e) => setSelectedPlot({ ...selectedPlot, name: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Country</InputLabel>
            <Select
              value={selectedPlot?.country || ''}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
            >
              {countryOptions.map(country => <MenuItem key={country} value={country}>{country}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Commodities</InputLabel>
            <Select
              multiple
              value={selectedPlot?.commodities || []}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, commodities: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((v) => <Chip key={v} label={v} size="small" />)}
                </Box>
              )}
            >
              {commodityOptions.map(commodity => <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Products</InputLabel>
            <Select
              multiple
              value={selectedPlot?.products || []}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, products: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((productId) => {
                    const product = products.find(p => p._id === productId);
                    return product ? <Chip key={productId} label={product.name} size="small" /> : null;
                  })}
                </Box>
              )}
            >
              {products.map(product => <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>)}
            </Select>
          </FormControl>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Area: ~{calculateArea(drawnCoordinates)} hectares
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDrawDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveDrawnPlot}>Save Plot</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Land Plot</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Plot ID" value={selectedPlot?.plot_id || ''}
            onChange={(e) => setSelectedPlot({ ...selectedPlot, plot_id: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth label="Plot Name" value={selectedPlot?.plot_name || ''}
            onChange={(e) => setSelectedPlot({ ...selectedPlot, plot_name: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Country</InputLabel>
            <Select
              value={selectedPlot?.country || ''}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
            >
              {countryOptions.map(country => <MenuItem key={country} value={country}>{country}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Commodities</InputLabel>
            <Select
              multiple
              value={(() => {
                if (Array.isArray(selectedPlot?.commodities)) return selectedPlot.commodities;
                if (typeof selectedPlot?.commodities === 'string') return selectedPlot.commodities.split(',');
                return [];
              })()}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, commodities: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((v) => <Chip key={v} label={v} size="small" />)}
                </Box>
              )}
            >
              {commodityOptions.map(commodity => <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await updateLandPlot(selectedPlot.name, selectedPlot);
                setEditDialog(false);
              } catch (error) {
                // Error handled in context
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Coordinates viewer */}
      <CoordinateTable
        open={coordDialogOpen}
        onClose={() => setCoordDialogOpen(false)}
        coordinates={coordData}
      />
    </Box>
  );
};

// const downloadTemplate = (format) => {
//   if (format === 'csv') {
//     const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Latitude,Longitude
// PLOT001,Coffee Farm North,Brazil,Coffee Arabica,50,-15.7801,-47.9292
// PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232
// PLOT003,Plantrich farm,India,Cardamom,75,12.9716,77.5946
// PLOT004,Farm A Polygon,India,Cardamom,75,10.21979,77.19177
// PLOT004,,,,,10.21931,77.19199
// PLOT004,,,,,10.21927,77.19255
// PLOT004,,,,,10.21981,77.19252`;
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(url);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'land_plots_template.csv';
//     link.click();
//     window.URL.revokeObjectURL(url);
//   }
// };
 const handleDownloadTemplate = async () => {
    try {
      console.log('Starting template download...');
      
      const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Latitude,Longitude
PLOT001,Coffee Farm North,Brazil,Coffee Arabica,50,-15.7801,-47.9292
PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232
PLOT003,Plantrich farm,India,Cardamom,75,12.9716,77.5946
PLOT004,Farm A Polygon,India,Cardamom,75,10.21979,77.19177
PLOT004,,,,,10.21931,77.19199
PLOT004,,,,,10.21927,77.19255
PLOT004,,,,,10.21981,77.19252`;

      // Add BOM for UTF-8 encoding
      const BOM = '\uFEFF';
      const csvWithBOM = BOM + csvContent;

      // Create blob with proper MIME type
      const blob = new Blob([csvWithBOM], { 
        type: 'text/csv;charset=utf-8;' 
      });

      // Check for IE/Edge legacy support
      if (window.navigator && window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, 'land_plots_template.csv');
        toast.success('Template downloaded successfully!');
        return;
      }

      // Modern browser approach with delay
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set attributes
      link.href = url;
      link.download = 'land_plots_template.csv';
      link.style.display = 'none';
      
      // Add to DOM
      document.body.appendChild(link);
      
      // Use setTimeout to ensure blob URL is ready
      setTimeout(() => {
        // Use dispatchEvent for better browser compatibility
        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
        
        // Clean up after a delay
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        toast.success('Template downloaded successfully!');
      }, 50);

    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download template. Please try again.');
    }
  };

  // Alternative fallback method if the above doesn't work
  const handleDownloadTemplateFallback = () => {
    try {
      const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Latitude,Longitude
PLOT001,Coffee Farm North,Brazil,Coffee Arabica,50,-15.7801,-47.9292
PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232
PLOT003,Plantrich farm,India,Cardamom,75,12.9716,77.5946
PLOT004,Farm A Polygon,India,Cardamom,75,10.21979,77.19177
PLOT004,,,,,10.21931,77.19199
PLOT004,,,,,10.21927,77.19255
PLOT004,,,,,10.21981,77.19252`;

      // Create a data URI instead of blob
      const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
      
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = 'land_plots_template.csv';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Template downloaded successfully!');
    } catch (error) {
      console.error('Fallback download failed:', error);
      toast.error('Download failed. Please contact support.');
    }
  };


export default LandPlots;
