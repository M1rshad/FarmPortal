  import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
  import { supplierService } from '../services/supplierService';
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
    Checkbox // ADD THIS IMPORT
  } from '@mui/material';
  import {
    Sync as SyncIcon,
    Map as MapIcon,
    TableChart as TableIcon,
    Upload as UploadIcon,
    Download as DownloadIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Draw as DrawIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    CheckCircle as CheckIcon
  } from '@mui/icons-material';
  import { dataService } from '../services/dataService';
  import { toast } from 'react-toastify';
  import CoordinateTable from '../components/CoordinateTable';
  import GpsFixedIcon from '@mui/icons-material/GpsFixed';


  // Create DataContext
  const DataContext = createContext();


  export const DataProvider = ({ children }) => {
    const [landPlots, setLandPlots] = useState(() => {
      // Load from localStorage on initialization
      const savedPlots = localStorage.getItem('landPlots');
      return savedPlots ? JSON.parse(savedPlots) : [];
    });
    // // Replace the existing useEffect for map initialization
    //   useEffect(() => {
    //     if (viewMode === 'map' && mapRef.current) {
    //       // Small delay to ensure DOM is ready
    //       setTimeout(() => {
    //         if (!map || !mapRef.current._leaflet_id) {
    //           initializeMap();
    //         }
    //       }, 100);
    //     }
    //   }, [viewMode, landPlots]); // Add landPlots to dependencies
    useEffect(() => {
      // Save to localStorage whenever landPlots changes
      localStorage.setItem('landPlots', JSON.stringify(landPlots));
    }, [landPlots]);
  


    return (
      <DataContext.Provider value={{ landPlots, setLandPlots }}>
        {children}
      </DataContext.Provider>
    );
  };


  export const useDataContext = () => useContext(DataContext);


  const LandPlots = () => {
    const { landPlots, setLandPlots } = useDataContext();


    // State management
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'table'
    const [uploadDialog, setUploadDialog] = useState(false);
    const [drawDialog, setDrawDialog] = useState(false);
    const [templateMenu, setTemplateMenu] = useState(null);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [editDialog, setEditDialog] = useState(false);
    const [uploadStep, setUploadStep] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawnCoordinates, setDrawnCoordinates] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [validPlots, setValidPlots] = useState([]);
    const [invalidPlots, setInvalidPlots] = useState([]);
    const [coordDialogOpen, setCoordDialogOpen] = useState(false);
    const [coordData, setCoordData] = useState([]);
    const [products, setProducts] = useState([]); // Products state


    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [drawnPolygon, setDrawnPolygon] = useState(null);
    useEffect(() => {
      if (viewMode === 'map' && mapRef.current) {
        setTimeout(() => {
          if (!map || !mapRef.current._leaflet_id) {
            initializeMap();
          }
        }, 100);
      }
    }, [viewMode, landPlots]);
    // Fetch products on mount
    useEffect(() => {
      fetchProducts();
    }, []);


    const fetchProducts = async () => {
      try {
        const response = await supplierService.listProducts();
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };


    // Initialize map when component mounts
    useEffect(() => {
      if (viewMode === 'map' && mapRef.current && !map) {
        initializeMap();
      }
    }, [viewMode, mapRef.current]);


    const initializeMap = () => {
    // Clean up existing map first
    if (map) {
      try {
        map.remove();
        setMap(null);
      } catch (e) {
        console.log('Map cleanup error:', e);
      }
    }


    // Check if container is already initialized
    if (mapRef.current && mapRef.current._leaflet_id) {
      mapRef.current._leaflet_id = null;
    }
      // Load Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);


      // Load Leaflet Draw CSS
      const drawLink = document.createElement('link');
      drawLink.rel = 'stylesheet';
      drawLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css';
      document.head.appendChild(drawLink);


      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        // Load Leaflet Draw JS
        const drawScript = document.createElement('script');
        drawScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js';
        drawScript.onload = () => {
          setupMap();
        };
        document.head.appendChild(drawScript);
      };
      document.head.appendChild(script);
    };


  //   const setupMap = () => {
  //   const L = window.L;


  //   // Initialize map
  //   const newMap = L.map(mapRef.current).setView([0, 0], 2);


  //   // Add tile layer
  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '© OpenStreetMap contributors'
  //   }).addTo(newMap);


  //   // Add existing land plots as polygons
  //   const allBounds = [];
  
  //   landPlots.forEach(plot => {
  //     let coordinates;
  //     if (plot.geojson) {
  //       // Handle GeoJSON
  //       if (typeof plot.geojson === 'string') {
  //         coordinates = JSON.parse(plot.geojson).coordinates[0];
  //       } else {
  //         coordinates = plot.geojson.coordinates[0];
  //       }
  //     } else if (plot.coordinates && Array.isArray(plot.coordinates)) {
  //       coordinates = plot.coordinates;
  //     } else if (plot.longitude && plot.latitude) {
  //       const d = 0.0003; // ~30 meters
  //       const lng = plot.longitude, lat = plot.latitude;
  //       coordinates = [
  //         [lng - d, lat - d], [lng + d, lat - d],
  //         [lng + d, lat + d], [lng - d, lat + d],
  //         [lng - d, lat - d]
  //       ];
  //     } else {
  //       return; // Skip invalid plot
  //     }


  //     const polygon = L.polygon(coordinates, {
  //       color: '#2E7D32',
  //       fillColor: '#4CAF50',
  //       fillOpacity: 0.5
  //     }).addTo(newMap);


  //     // Create popup content here where plot is defined
  //     const popupContent = `
  //       <div style="font-size: 14px;">
  //         <strong style="color: #2E7D32; font-size: 16px;">${plot.id}</strong><br/>
  //         <strong>${plot.name || 'Unnamed Plot'}</strong><br/>
  //         Country: ${plot.country || 'Unknown'}<br/>
  //         Products: ${(plot.products || plot.commodities || []).join(', ') || 'None'}<br/>
  //         Area: ${plot.area || 0} hectares
  //       </div>
  //     `;
    
  //     polygon.bindPopup(popupContent);
    
  //     // Collect bounds
  //     coordinates.forEach(coord => {
  //       allBounds.push([coord[1] || coord.lat, coord[0] || coord.lng]);
  //     });
  //   });


  //   // Fit map to show all plots
  //   if (allBounds.length > 0) {
  //     newMap.fitBounds(allBounds, { padding: [50, 50] });
  //   }


  //   setMap(newMap);
  // };
  const setupMap = () => {
    const L = window.L;


    // Remove existing map instance if present
    if (map) {
      map.remove();
    }


    // Check if map container is ready
    if (!mapRef.current || mapRef.current._leaflet_id) {
      return;
    }


    // Initialize new map
    const newMap = L.map(mapRef.current).setView([0, 0], 2);
    setMap(newMap);


    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);


    const allBounds = [];


    landPlots.forEach(plot => {
      let coordinates;


      // Handle different formats
      if (plot.coordinates && Array.isArray(plot.coordinates) && plot.coordinates.length > 0) {
        coordinates = plot.coordinates;
      } else if (plot.geojson?.coordinates?.[0]?.length > 0) {
        coordinates = plot.geojson.coordinates[0];
      } else if (plot.longitude && plot.latitude) {
        // Fallback for single point - create small square
        const d = 0.0003;
        const lng = plot.longitude, lat = plot.latitude;
        coordinates = [
          [lng - d, lat - d], [lng + d, lat - d],
          [lng + d, lat + d], [lng - d, lat + d],
          [lng - d, lat - d]
        ];
      } else {
        return; // Skip invalid
      }


      const leafletCoords = coordinates.map(coord => [coord[1], coord[0]]);


      // Main polygon (green)
      const polygon = L.polygon(leafletCoords, {
        color: '#2E7D32',
        fillColor: '#4CAF50',
        fillOpacity: 0.5,
        weight: 2
      }).addTo(newMap);


      // Add deforested areas overlay (red) if data exists
      if (plot.deforestationData?.deforestedPolygons?.coordinates) {
        plot.deforestationData.deforestedPolygons.coordinates.forEach(deforestedCoords => {
          const deforestedLeafletCoords = deforestedCoords.map(coord => [coord[1], coord[0]]);
          L.polygon(deforestedLeafletCoords, {
            color: '#D32F2F',
            fillColor: '#F44336',
            fillOpacity: 0.7,
            weight: 1
          }).addTo(newMap);
        });
      }


      // Tooltip text with deforestation info
      const deforestationText = plot.deforestationData?.percentage
        ? `<br/>Deforestation: ${plot.deforestationData.percentage.toFixed(1)}%`
        : '';


      polygon.bindTooltip(
        `<strong>${plot.id}</strong><br/>${plot.name || 'Unnamed Plot'}${deforestationText}`,
        {
          permanent: false,
          direction: 'top',
          sticky: true
        }
      );


      // Click handler to zoom
      polygon.on('click', function () {
        newMap.fitBounds(this.getBounds(), { padding: [50, 50] });
      });


      // Popup with more details
      polygon.bindPopup(`
        <div style="font-size: 14px;">
          <strong style="color: #2E7D32; font-size: 16px;">${plot.id}</strong><br/>
          <strong>${plot.name || 'Unnamed Plot'}</strong><br/>
          Country: ${plot.country || 'Unknown'}<br/>
          Products: ${(plot.products || plot.commodities || []).join(', ') || 'None'}<br/>
          Area: ${plot.area || 0} hectares<br/>
          ${plot.deforestationData?.percentage
            ? `<span style="color: #D32F2F;">
                Deforestation (post-2020): ${plot.deforestationData.percentage.toFixed(1)}%<br/>
                Deforested Area: ${plot.deforestationData.deforestedArea.toFixed(2)} ha
              </span>`
            : '<span style="color: #4CAF50;">No deforestation detected</span>'
          }
        </div>
      `);


      if (leafletCoords.length > 0) {
        allBounds.push(...leafletCoords);
      }
    });


    // Fit map to all plots
    if (allBounds.length > 0) {
      try {
        newMap.fitBounds(allBounds, { padding: [50, 50] });
      } catch (e) {
        console.error("Could not fit map bounds:", e);
      }
    }
  };


    const handleSync = async () => {
      try {
        const response = await dataService.syncLandPlots();
        const syncedPlots = response.data.data;


        // Merge synced plots with existing plots, avoiding duplicates
        const mergedPlots = [...landPlots];
        syncedPlots.forEach((plot) => {
          if (!mergedPlots.some((existingPlot) => existingPlot.id === plot.id)) {
            mergedPlots.push(plot);
          }
        });


        setLandPlots(mergedPlots);
        toast.success('Land plots synced from ERPNext');


        // Reinitialize drawing functionality
        if (map) {
          const L = window.L;


          // Clear existing drawn items and controls
          map.eachLayer((layer) => {
            if (layer instanceof L.FeatureGroup) {
              map.removeLayer(layer);
            }
          });


          // Re-add drawing layer and controls
          const drawnItems = new L.FeatureGroup();
          map.addLayer(drawnItems);


          const drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: '#e1e100',
                  message: '<strong>Error:</strong> Shape edges cannot cross!'
                },
                shapeOptions: {
                  color: '#2E7D32'
                }
              },
              polyline: false,
              circle: false,
              rectangle: false,
              marker: false,
              circlemarker: false
            },
            edit: {
              featureGroup: drawnItems
            }
          });
          map.addControl(drawControl);


          // Reattach event listener for drawing
          map.on(L.Draw.Event.CREATED, (e) => {
            const layer = e.layer;
            drawnItems.addLayer(layer);


            // Get coordinates
            const coords = layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat]);
            setDrawnCoordinates(coords);
            setDrawnPolygon(layer);


            // Remove draw control
            map.removeControl(drawControl);
            setIsDrawing(false);
            setDrawDialog(true);
          });
        }
      } catch (error) {
        toast.error('Failed to sync land plots');
      }
    };




  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setUploadedFile(file);
    
  //     // Parse the file based on type
  //     if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         try {
  //           const text = e.target.result;
  //           const lines = text.split('\n').filter(line => line.trim());
  //           const headers = lines[0].split(',').map(h => h.trim());
          
  //           const plots = [];
  //           for (let i = 1; i < lines.length; i++) {
  //             const values = lines[i].split(',').map(v => v.trim());
            
  //             // Parse products - handle both semicolon and comma separated
  //             const productsRaw = values[3] || '';
  //             const productsList = productsRaw.includes(';')
  //               ? productsRaw.split(';').map(p => p.trim()).filter(p => p)
  //               : productsRaw.split(',').map(p => p.trim()).filter(p => p);
            
  //             const plot = {
  //               id: values[0] || `PLOT${Date.now()}_${i}`,
  //               name: values[1] || 'Unnamed Plot',
  //               country: values[2] || '',
  //               commodities: productsList, // Use commodities for consistency
  //               products: productsList,    // Also store as products
  //               area: parseFloat(values[4]) || 0,
  //               latitude: parseFloat(values[5]) || 0,
  //               longitude: parseFloat(values[6]) || 0
  //             };
            
  //             // Create polygon from center point
  //             if (plot.latitude && plot.longitude) {
  //               const d = 0.0003; // ~30 meters
  //               const lng = plot.longitude, lat = plot.latitude;
  //               plot.geojson = {
  //                 type: 'Polygon',
  //                 coordinates: [[
  //                   [lng - d, lat - d],
  //                   [lng + d, lat - d],
  //                   [lng + d, lat + d],
  //                   [lng - d, lat + d],
  //                   [lng - d, lat - d]
  //                 ]]
  //               };
  //               plot.coordinates = plot.geojson.coordinates[0];
  //             }
            
  //             plots.push(plot);
  //           }
          
  //           setValidPlots(plots);
  //           setInvalidPlots([]);
  //           setUploadStep(1);
  //         } catch (error) {
  //           console.error('Error parsing file:', error);
  //           toast.error('Error parsing file. Please check the format.');
  //         }
  //       };
  //       reader.readAsText(file);
  //     } else {
  //       toast.error('Please upload a CSV or Excel file');
  //     }
  //   }
  // };


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());
          
            const plots = [];
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',').map(v => v.trim());
            
              // Parse products
              const productsRaw = values[3] || '';
              const productsList = productsRaw.includes(';')
                ? productsRaw.split(';').map(p => p.trim()).filter(p => p)
                : [productsRaw].filter(p => p);
            
              // Parse multiple coordinate pairs (starting from index 5)
              const coordinates = [];
              for (let j = 5; j < values.length; j += 2) {
                const lat = parseFloat(values[j]);
                const lng = parseFloat(values[j + 1]);
                if (!isNaN(lat) && !isNaN(lng)) {
                  coordinates.push([lng, lat]); // GeoJSON format: [lng, lat]
                }
              }
            
              // Close the polygon if it has coordinates
              if (coordinates.length > 2) {
                // Ensure polygon is closed
                const firstPoint = coordinates[0];
                const lastPoint = coordinates[coordinates.length - 1];
                if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
                  coordinates.push([...firstPoint]);
                }
              }
            
              const plot = {
                id: values[0] || `PLOT${Date.now()}_${i}`,
                name: values[1] || 'Unnamed Plot',
                country: values[2] || '',
                commodities: productsList,
                products: productsList,
                area: parseFloat(values[4]) || 0,
                coordinates: coordinates,
                geojson: coordinates.length > 0 ? {
                  type: 'Polygon',
                  coordinates: [coordinates]
                } : null
              };
            
              plots.push(plot);
            }
          
            setValidPlots(plots);
            setInvalidPlots([]);
            setUploadStep(1);
          } catch (error) {
            console.error('Error parsing file:', error);
            toast.error('Error parsing file. Please check the format.');
          }
        };
        reader.readAsText(file);
      } else {
        toast.error('Please upload a CSV or Excel file');
      }
    }
  };
  // In LandPlots.jsx
  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setUploadedFile(file);
    
  //     if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         try {
  //           const text = e.target.result;
  //           const lines = text.split('\n').filter(line => line.trim());
  //           const headers = lines[0].split(',').map(h => h.trim());
          
  //           const plots = [];
  //           for (let i = 1; i < lines.length; i++) {
  //             const values = lines[i].split(',').map(v => v.trim());
            
  //             const productsRaw = values[3] || '';
  //             const productsList = productsRaw.includes(';')
  //               ? productsRaw.split(';').map(p => p.trim()).filter(p => p)
  //               : [productsRaw].filter(p => p);
            
  //             const coordinates = [];
  //             for (let j = 5; j < values.length; j += 2) {
  //               const lat = parseFloat(values[j]);
  //               const lng = parseFloat(values[j + 1]);
  //               if (!isNaN(lat) && !isNaN(lng)) {
  //                 coordinates.push([lng, lat]); // Standard GeoJSON: [lng, lat]
  //               }
  //             }
            
  //             if (coordinates.length > 2) {
  //               const firstPoint = coordinates[0];
  //               const lastPoint = coordinates[coordinates.length - 1];
  //               if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
  //                 coordinates.push([...firstPoint]); // Ensure polygon is closed
  //               }
  //             }
            
  //             const area = parseFloat(values[4]) || 0;
  //             const deforestationPercent = Math.random() * 15; // Random 0-15% for testing


  //             const plot = {
  //               id: values[0] || `PLOT${Date.now()}_${i}`,
  //               name: values[1] || 'Unnamed Plot',
  //               country: values[2] || '',
  //               commodities: productsList,
  //               products: productsList,
  //               area: area,
  //               coordinates: coordinates,
  //               geojson: coordinates.length > 0 ? {
  //                 type: 'Polygon',
  //                 coordinates: [coordinates]
  //               } : null,
  //               // MOCK DEFORESTATION DATA FOR TESTING
  //               deforestationData: {
  //                 percentage: deforestationPercent,
  //                 deforestedArea: area * (deforestationPercent / 100),
  //                 post2020: true,
  //                 lastAnalyzed: new Date().toISOString(),
  //                 // We'll leave deforestedPolygons empty for this mock
  //                 deforestedPolygons: null
  //               }
  //             };
            
  //             plots.push(plot);
  //           }
          
  //           setValidPlots(plots);
  //           setInvalidPlots([]);
  //           setUploadStep(1);
  //         } catch (error) {
  //           console.error('Error parsing file:', error);
  //           toast.error('Error parsing file. Please check the format.');
  //         }
  //       };
  //       reader.readAsText(file);
  //     } else {
  //       toast.error('Please upload a CSV or Excel file');
  //     }
  //   }
  // };
    const downloadTemplate = (format) => {
        if (format === 'csv') {
          // Create CSV template with multiple coordinate pairs
          const csvContent = `Plot ID,Plot Name,Country,Products,Area (hectares),Lat1,Lng1,Lat2,Lng2,Lat3,Lng3,Lat4,Lng4,Lat5,Lng5,Lat6,Lng6,Lat7,Lng7,Lat8,Lng8
      PLOT001,Coffee Farm North,Brazil,Coffee Arabica;Coffee Robusta,50,-15.7801,-47.9292,-15.7805,-47.9295,-15.7810,-47.9290,-15.7806,-47.9287,,,,,,,,
      PLOT002,Cocoa Plantation A,Ghana,Cocoa Beans,30,7.9465,-1.0232,7.9470,-1.0235,7.9468,-1.0228,7.9463,-1.0230,,,,,,,,`;
        
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'land_plots_template.csv';
          link.click();
          window.URL.revokeObjectURL(url);
        
          toast.info('Template downloaded. Add up to 8 coordinate pairs per plot');
        } else {
          toast.error(`${format.toUpperCase()} format not yet implemented`);
        }
      
        setTemplateMenu(null);
      };
    const startDrawing = () => {
      if (!map) return;


      const L = window.L;
      setIsDrawing(true);
      setDrawnCoordinates([]);


      // Create drawing layer
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);


      // Initialize draw control
      const drawControl = new L.Control.Draw({
        position: 'topright',
        draw: {
          polygon: {
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message: '<strong>Error:</strong> Shape edges cannot cross!'
            },
            shapeOptions: {
              color: '#2E7D32'
            }
          },
          polyline: false,
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: drawnItems
        }
      });
      map.addControl(drawControl);


      // Handle polygon creation
      map.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        drawnItems.addLayer(layer);


        // Get coordinates
        const coords = layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat]);
        setDrawnCoordinates(coords);
        setDrawnPolygon(layer);


        // Remove draw control
        map.removeControl(drawControl);
        setIsDrawing(false);
        setDrawDialog(true);
      });
    };


    const saveDrawnPlot = () => {
      const newPlot = {
        id: selectedPlot?.id || `PLOT${Date.now()}`,
        name: selectedPlot?.name || 'New Plot',
        country: selectedPlot?.country || '',
        commodities: selectedPlot?.commodities || [],
        area: calculateArea(drawnCoordinates),
        coordinates: drawnCoordinates
      };


      if (selectedPlot?.id) {
        // Update existing
        setLandPlots(landPlots.map(p => p.id === selectedPlot.id ? newPlot : p));
        toast.success('Land plot updated');
      } else {
        // Add new
        setLandPlots([...landPlots, newPlot]);
        toast.success('Land plot created');
      }


      setDrawDialog(false);
      setSelectedPlot(null);
      setDrawnCoordinates([]);
    };


    const calculateArea = (coordinates) => {
      // Simple area calculation - in real app, use proper geodesic calculation
      return Math.round(Math.random() * 100 + 10);
    };


    const handleEdit = (plot) => {
      setSelectedPlot(plot);
      setEditDialog(true);
    };


    const handleDelete = (plotId) => {
      if (window.confirm('Are you sure you want to delete this land plot?')) {
        setLandPlots(landPlots.filter(p => p.id !== plotId));
        toast.success('Land plot deleted');
      }
    };


    const commodityOptions = ['Coffee', 'Cocoa', 'Palm Oil', 'Rubber', 'Wood', 'Soy', 'Cattle'];
    const countryOptions = ['Brazil', 'India', 'Ghana', 'Indonesia', 'Vietnam', 'Colombia'];


    return (
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Land Plots (EUDR)
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={(e) => setTemplateMenu(e.currentTarget)}
            >
              Create
            </Button>
            <Menu
              anchorEl={templateMenu}
              open={Boolean(templateMenu)}
              onClose={() => setTemplateMenu(null)}
            >
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
              <MenuItem onClick={() => downloadTemplate('excel')}>Excel Template</MenuItem>
              <MenuItem onClick={() => downloadTemplate('csv')}>CSV Template</MenuItem>
              <MenuItem onClick={() => downloadTemplate('geojson')}>GeoJSON Template</MenuItem>
              <MenuItem onClick={() => downloadTemplate('kml')}>KML Template</MenuItem>
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
              <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
              {isDrawing && (
                <Alert
                  severity="info"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000
                  }}
                >
                  Click on the map to draw your land plot polygon
                </Alert>
              )}
            </Paper>
          
            {/* Table below map */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Plot ID</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell>Area (ha)</TableCell>
                    <TableCell>Deforestation (%)</TableCell> {/* NEW COLUMN */}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {landPlots.map((plot) => (
                    <TableRow key={plot.id}>
                      <TableCell>{plot.id}</TableCell>
                      <TableCell>{plot.country}</TableCell>
                      <TableCell>
                        {(plot.commodities || plot.products || []).map(c => (
                          <Chip key={c} label={c} size="small" sx={{ mr: 0.5 }} />
                        ))}
                      </TableCell>
                      <TableCell>{plot.area}</TableCell>
                      <TableCell>
                        {plot.deforestationData?.percentage ? (
                          <Chip
                            label={`${plot.deforestationData.percentage.toFixed(1)}%`}
                            color={plot.deforestationData.percentage > 0 ? "error" : "success"}
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
                        <IconButton size="small" onClick={() => handleDelete(plot.id)}>
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
                <TableCell>Products</TableCell> {/* Changed */}
                <TableCell>Area (ha)</TableCell>
                <TableCell>Coordinates</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
                {landPlots.map((plot) => (
                  <TableRow key={plot.id}>
                    <TableCell>{plot.id}</TableCell>
                    <TableCell>{plot.name}</TableCell>
                    <TableCell>{plot.country}</TableCell>
                    <TableCell>
                      {(plot.commodities || plot.products || []).map(c => (
                        <Chip key={c} label={c} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>{plot.area}</TableCell>
              
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              // Show all coordinates properly
                              const coords = plot.coordinates ||
                                            (plot.geojson ? plot.geojson.coordinates[0] : []) ||
                                            (plot.longitude && plot.latitude ? [[plot.longitude, plot.latitude]] : []);
                              setCoordData(coords);
                              setCoordDialogOpen(true);
                            }}
                          >
                            <GpsFixedIcon />
                          </IconButton>
                          {plot.coordinates ? `${plot.coordinates.length} points` : '1 point'}
                        </TableCell>
                    {/* <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setCoordData(plot.coordinates || []);
                          setCoordDialogOpen(true);
                        }}
                      >
                        <GpsFixedIcon />
                      </IconButton>
                    </TableCell> */}
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEdit(plot)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(plot.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}


        {/* Upload Dialog */}
        <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="md" fullWidth>
                  <DialogTitle>Upload Land Plot Data</DialogTitle>
          <DialogContent>
            <Stepper activeStep={uploadStep} sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Upload File</StepLabel>
              </Step>
              <Step>
                <StepLabel>Manage Land Plots</StepLabel>
              </Step>
            </Stepper>


            {uploadStep === 0 && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Supported formats: .xlsx, .csv, .geojson, .kml, .kmz, .gpkg, .gml, .zip (shapefiles only)
                </Alert>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                >
                  Browse for a file
                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.csv,.geojson,.kml,.kmz,.gpkg,.gml,.zip"
                    onChange={handleFileUpload}
                  />
                </Button>
                {uploadedFile && (
                  <Typography sx={{ mt: 2 }}>
                    Selected: {uploadedFile.name}
                  </Typography>
                )}
              </Box>
            )}


            {uploadStep === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Valid Plots ({validPlots.length})
                </Typography>
                <List>
                  {validPlots.map((plot, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={plot.name}
                        secondary={`${plot.country} - ${(plot.commodities || plot.products || []).join(', ')}`}
                      />
                      <ListItemSecondaryAction>
                        <Checkbox defaultChecked />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setUploadDialog(false); setUploadStep(0); }}>
              Cancel
            </Button>
            {uploadStep === 1 && (
              <Button
                variant="contained"
                onClick={() => {
                  setLandPlots([...landPlots, ...validPlots]);
                  setUploadDialog(false);
                  setUploadStep(0);
                  toast.success(`${validPlots.length} plots imported successfully`);
                }}
              >
                Import {validPlots.length} Plots
              </Button>
            )}
          </DialogActions>
        </Dialog>


        {/* Draw Dialog - Save drawn plot */}
        <Dialog open={drawDialog} onClose={() => setDrawDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Save Land Plot</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Plot ID"
              value={selectedPlot?.id || ''}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, id: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Plot Name"
              value={selectedPlot?.name || ''}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, name: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Country</InputLabel>
              <Select
                value={selectedPlot?.country || ''}
                onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
              >
                {countryOptions.map(country => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
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
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {commodityOptions.map(commodity => (
                  <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Products selection */}
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
                {products.map(product => (
                  <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>
                ))}
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
              fullWidth
              label="Plot ID"
              value={selectedPlot?.id || ''}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, id: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Plot Name"
              value={selectedPlot?.name || ''}
              onChange={(e) => setSelectedPlot({ ...selectedPlot, name: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Country</InputLabel>
              <Select
                value={selectedPlot?.country || ''}
                onChange={(e) => setSelectedPlot({ ...selectedPlot, country: e.target.value })}
              >
                {countryOptions.map(country => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
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
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {commodityOptions.map(commodity => (
                  <MenuItem key={commodity} value={commodity}>{commodity}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                setLandPlots(landPlots.map(p => p.id === selectedPlot.id ? selectedPlot : p));
                setEditDialog(false);
                toast.success('Land plot updated');
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>


        <CoordinateTable
          open={coordDialogOpen}
          onClose={() => setCoordDialogOpen(false)}
          coordinates={coordData}
        />


        {viewMode === 'draw' && (
          <Box sx={{ mt:2 }}>
            <Button
              variant="outlined"
              onClick={() =>
                setSelectedPlot({
                  ...selectedPlot,
                  coordinates: [...(selectedPlot?.coordinates || []), [0,0]]
                })
              }
            >
              + Add point
            </Button>


            {selectedPlot?.coordinates?.map((p,i)=>(
              <Box key={i} sx={{ display:'flex', gap:1, mt:1 }}>
                <TextField
                  label="Latitude"
                  type="number"
                  value={p[1]}
                  onChange={e=>{
                    const arr=[...selectedPlot.coordinates];
                    arr[i][1]=parseFloat(e.target.value);
                    setSelectedPlot({...selectedPlot, coordinates:arr});
                  }}
                />
                <TextField
                  label="Longitude"
                  type="number"
                  value={p[0]}
                  onChange={e=>{
                    const arr=[...selectedPlot.coordinates];
                    arr[i][0]=parseFloat(e.target.value);
                    setSelectedPlot({...selectedPlot, coordinates:arr});
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };


  export default LandPlots;