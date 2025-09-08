import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  Table, TableBody, TableCell,
  TableHead, TableRow, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CoordinateTable = ({ open, onClose, coordinates = [] }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ display:'flex', justifyContent:'space-between' }}>
      Coordinates (Lat / Lng)
      <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coordinates.map(([lng, lat], idx) => (
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{lat}</TableCell>
              <TableCell>{lng}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
  </Dialog>
);

export default CoordinateTable;