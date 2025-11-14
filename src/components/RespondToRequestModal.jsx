// import React, { useState } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, Button, MenuItem
// } from '@mui/material';

// const RespondToRequestModal = ({ open, onClose, onSubmit }) => {
//   const [message, setMessage] = useState('');
//   const [status, setStatus] = useState('pending');

//   const handleSubmit = () => {
//     onSubmit({ message, status });
//     setMessage('');
//     setStatus('pending');
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Respond to Request</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Message"
//           fullWidth
//           multiline
//           rows={4}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           margin="normal"
//         />
//         <TextField
//           label="Status"
//           select
//           fullWidth
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           margin="normal"
//         >
//           <MenuItem value="pending">Pending</MenuItem>
//           <MenuItem value="accepted">Accepted</MenuItem>
//           <MenuItem value="rejected">Rejected</MenuItem>
//         </TextField>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained" color="primary">
//           Submit
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default RespondToRequestModal;
// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   List,
//   ListItem,
//   Checkbox,
//   ListItemText,
//   Divider,
//   Alert,
//   Box
// } from '@mui/material';

// const RespondToRequestModal = ({
//   open,
//   onClose,
//   onSubmit,
//   availablePlots = [],
//   selectedPlots = [],
//   onPlotsChange,
//   showPlotSelection = false
// }) => {
//   const [response, setResponse] = useState({
//     message: '',
//     status: 'accept'
//   });

//   const handleSubmit = () => {
//     onSubmit(response);
//     setResponse({ message: '', status: 'accept' });
//   };

//   const handleClose = () => {
//     setResponse({ message: '', status: 'accept' });
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//       <DialogTitle>Respond to Request</DialogTitle>
//       <DialogContent>
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Response</InputLabel>
//           <Select
//             value={response.status}
//             onChange={(e) => setResponse({ ...response, status: e.target.value })}
//             label="Response"
//           >
//             <MenuItem value="accept">Accept</MenuItem>
//             <MenuItem value="reject">Reject</MenuItem>
//           </Select>
//         </FormControl>

//         <TextField
//           fullWidth
//           multiline
//           rows={4}
//           label="Message"
//           value={response.message}
//           onChange={(e) => setResponse({ ...response, message: e.target.value })}
//           margin="normal"
//           placeholder="Enter your response message..."
//         />

//         {showPlotSelection && response.status === 'accept' && (
//           <>
//             <Divider sx={{ my: 2 }} />
//             <Typography variant="h6" gutterBottom>
//               Select Land Plots to Share
//             </Typography>
//             <Alert severity="info" sx={{ mb: 2 }}>
//               Choose which land plots to share with the customer
//             </Alert>
            
//             {availablePlots.length === 0 ? (
//               <Alert severity="warning">No land plots available to share</Alert>
//             ) : (
//               <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
//                 <List>
//                   {availablePlots.map((plot) => (
//                     <ListItem key={plot.id} dense>
//                       <Checkbox
//                         checked={selectedPlots.includes(plot.id)}
//                         onChange={(e) => {
//                           if (onPlotsChange) {
//                             onPlotsChange((prev) =>
//                               e.target.checked 
//                                 ? [...prev, plot.id] 
//                                 : prev.filter((id) => id !== plot.id)
//                             );
//                           }
//                         }}
//                       />
//                       <ListItemText
//                         primary={`${plot.plot_id} - ${plot.plot_name}`}
//                         secondary={`${plot.country} - ${plot.area} ha - ${Array.isArray(plot.commodities) ? plot.commodities.join(', ') : plot.commodities || ''}`}
//                       />
//                     </ListItem>
//                   ))}
//                 </List>
//               </Box>
//             )}

//             {selectedPlots.length > 0 && (
//               <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
//                 {selectedPlots.length} plot(s) selected to share
//               </Typography>
//             )}
//           </>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button onClick={handleSubmit} variant="contained">
//           Send Response
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default RespondToRequestModal;
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Divider,
  Alert,
  AlertTitle,
  Box
} from '@mui/material';

const RespondToRequestModal = ({
  open,
  onClose,
  onSubmit,
  availablePlots = [],
  selectedPlots = [],
  onPlotsChange,
  showPlotSelection = false,
  requestMessage = '',
  requestDetails = null
}) => {
  const [response, setResponse] = useState({
    message: '',
    status: 'accept'
  });

  // ✅ ADD DEBUG
  React.useEffect(() => {
    if (open) {
      console.log('🚀 Modal Props:', {
        requestMessage,
        requestDetails,
        messageLength: requestMessage?.length,
        messageType: typeof requestMessage
      });
    }
  }, [open, requestMessage, requestDetails]);

  const handleSubmit = () => {
    onSubmit(response);
    setResponse({ message: '', status: 'accept' });
  };

  const handleClose = () => {
    setResponse({ message: '', status: 'accept' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Respond to Request</DialogTitle>
      <DialogContent>
        {/* ✅ CHANGED: Use length check instead of truthy check */}
        {requestMessage && requestMessage.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Customer's Request Message</AlertTitle>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {requestMessage}
            </Typography>
          </Alert>
        )}

        {/* ✅ OPTIONAL: Always show request details section */}
        {requestDetails && (
          <Box 
            sx={{ 
              mb: 2, 
              p: 2, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300'
            }}
          >
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Request Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2">
                <strong>Request ID:</strong> {requestDetails._id || requestDetails.name || '—'}
              </Typography>
              <Typography variant="body2">
                <strong>Request Type:</strong>{' '}
                {requestDetails.requestType?.replace(/_/g, ' ').toUpperCase() || '—'}
              </Typography>
              {requestDetails.purchaseOrderNumber && (
                <Typography variant="body2">
                  <strong>Purchase Order:</strong> {requestDetails.purchaseOrderNumber}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Customer:</strong>{' '}
                {requestDetails.customer?.companyName || 
                 requestDetails.customer?.name || 
                 requestDetails.customer ||
                 '—'}
              </Typography>
              {requestDetails.createdAt && (
                <Typography variant="body2">
                  <strong>Date:</strong>{' '}
                  {new Date(requestDetails.createdAt).toLocaleDateString()}
                </Typography>
              )}
              {/* ✅ ADD: Show message here as fallback */}
              {requestDetails.message && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Message:</strong> {requestDetails.message}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Response Section */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Your Response
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Response Action</InputLabel>
          <Select
            value={response.status}
            onChange={(e) => setResponse({ ...response, status: e.target.value })}
            label="Response Action"
          >
            <MenuItem value="accept">Accept</MenuItem>
            <MenuItem value="reject">Reject</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Response Message"
          value={response.message}
          onChange={(e) => setResponse({ ...response, message: e.target.value })}
          margin="normal"
          placeholder="Enter your response message..."
          helperText="Provide details about your decision"
        />

        {/* Land Plot Selection */}
        {showPlotSelection && response.status === 'accept' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Select Land Plots to Share
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Choose which land plots to share with the customer
            </Alert>
            
            {availablePlots.length === 0 ? (
              <Alert severity="warning">No land plots available to share</Alert>
            ) : (
              <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
                <List>
                  {availablePlots.map((plot) => (
                    <ListItem key={plot.id} dense>
                      <Checkbox
                        checked={selectedPlots.includes(plot.id)}
                        onChange={(e) => {
                          if (onPlotsChange) {
                            onPlotsChange((prev) =>
                              e.target.checked 
                                ? [...prev, plot.id] 
                                : prev.filter((id) => id !== plot.id)
                            );
                          }
                        }}
                      />
                      <ListItemText
                        primary={`${plot.plot_id} - ${plot.plot_name}`}
                        secondary={`${plot.country} - ${plot.area} ha - ${Array.isArray(plot.commodities) ? plot.commodities.join(', ') : plot.commodities || ''}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {selectedPlots.length > 0 && (
              <Alert severity="success" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  {selectedPlots.length} plot(s) selected to share
                </Typography>
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Send Response
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RespondToRequestModal;
