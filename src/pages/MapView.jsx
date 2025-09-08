import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const MapView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  
  const { product, supplier } = location.state || {};

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet map
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      initializeMap();
    };
    document.head.appendChild(script);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const initializeMap = () => {
    const L = window.L;
    
    // Initialize map
    const newMap = L.map(mapRef.current).setView([0, 0], 2);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    // Add markers for land plots
    if (product && product.landPlots) {
      const bounds = [];
      
      product.landPlots.forEach(plot => {
        const marker = L.marker([plot.coordinates.lat, plot.coordinates.lng])
          .addTo(newMap)
          .bindPopup(`
            <div>
              <strong>${plot.name}</strong><br/>
              Area: ${plot.area}<br/>
              Product: ${product.name}<br/>
              Supplier: ${supplier?.companyName || 'Unknown'}
            </div>
          `);
        
        bounds.push([plot.coordinates.lat, plot.coordinates.lng]);
      });

          // Fit map to show all markers
      if (bounds.length > 0) {
        newMap.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    setMap(newMap);
  };

  if (!product) {
    return (
      <Box>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography>No product data available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Typography variant="h5">
          Land Plot Locations
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">{product.name}</Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label={`Category: ${product.category}`} size="small" sx={{ mr: 1 }} />
          <Chip label={`Origin: ${product.origin}`} size="small" sx={{ mr: 1 }} />
          <Chip label={`Supplier: ${supplier?.companyName}`} size="small" />
        </Box>
      </Paper>

      <Paper sx={{ height: '600px', position: 'relative' }}>
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </Paper>
    </Box>
  );
};

export default MapView;