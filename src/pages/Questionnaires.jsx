// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, FormControlLabel, Radio, RadioGroup, Checkbox, Alert, Grid, Select, MenuItem, InputLabel, FormControl
// } from '@mui/material';
// import { Assignment as QuestionnaireIcon } from '@mui/icons-material';
// import { toast } from 'react-toastify';
// import { questionnaireService } from '../services/questionnaireService';
// import { dataService } from '../services/dataService';
// import { useAuth } from '../context/AuthContext';

// const Questionnaires = () => {
//   const { isSupplier } = useAuth();
//   const customerMode = !isSupplier;

//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Create (customer)
//   const [createOpen, setCreateOpen] = useState(false);
//   const [suppliers, setSuppliers] = useState([]);
//   const [supplierId, setSupplierId] = useState('');
//   const [title, setTitle] = useState('EUDR Compliance Assessment');
//   const [dueDate, setDueDate] = useState('');
//   const [qList, setQList] = useState([
//     { question: 'Is your company certified for sustainable practices?', input_type: 'Radio', options: ['Yes','No'], required: 1 },
//     { question: 'Provide the year of your last third-party audit', input_type: 'Text', required: 0 },
//   ]);

//   // Fill (supplier)
//   const [fillOpen, setFillOpen] = useState(false);
//   const [current, setCurrent] = useState(null);
//   const [answers, setAnswers] = useState({}); // { [rowname]: value }

//   const fetchList = async () => {
//     try {
//       setLoading(true);
//       const { items } = await questionnaireService.listForMe();
//       setRows(items);
//     } catch (e) {
//       console.error(e);
//       toast.error('Failed to load questionnaires');
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchList();
//     if (customerMode) {
//       (async () => {
//         try {
//           const resp = await dataService.getSuppliers();
//           const list = resp?.data?.suppliers ?? resp?.suppliers ?? [];
//           setSuppliers(Array.isArray(list) ? list : []);
//         } catch {/* ignore */}
//       })();
//     }
//   }, [isSupplier]);

//   const statusColor = (s) => {
//     const k = (s || '').toLowerCase();
//     if (k === 'pending') return 'warning';
//     if (k === 'completed') return 'success';
//     if (k === 'denied') return 'error';
//     return 'default';
//   };

//   // ---- Customer: create ----
//   const addQuestion = () => setQList((arr) => [...arr, { question: '', input_type: 'Text', required: 0 }]);
//   const removeQuestion = (idx) => setQList((arr) => arr.filter((_, i) => i !== idx));
//   const updateQuestion = (idx, patch) => setQList((arr) => arr.map((q, i) => (i === idx ? { ...q, ...patch } : q)));

//   const createQ = async () => {
//     if (!supplierId || !title || qList.length === 0) {
//       toast.error('Fill supplier, title, and add at least one question'); return;
//     }
//     // validate radios have options
//     for (const q of qList) {
//       if ((q.input_type || '').toLowerCase() === 'radio' && (!q.options || q.options.length === 0)) {
//         toast.error('Radio question requires options'); return;
//       }
//     }
//     try {
//       await questionnaireService.create({ supplierId, title, questions: qList, dueDate: dueDate || undefined });
//       toast.success('Questionnaire sent to supplier');
//       setCreateOpen(false);
//       setSupplierId(''); setTitle('EUDR Compliance Assessment'); setDueDate(''); setQList([]);
//       fetchList();
//     } catch (e) {
//       console.error(e);
//       toast.error('Failed to create questionnaire');
//     }
//   };

//   // ---- Supplier: open / answer ----
//   const openFill = async (id) => {
//     try {
//       const doc = await questionnaireService.getOne(id);
//       setCurrent(doc);
//       const init = {};
//       for (const q of doc.questions || []) init[q.rowname] = q.answer || '';
//       setAnswers(init);
//       setFillOpen(true);
//     } catch (e) {
//       console.error(e);
//       toast.error('Unable to open questionnaire');
//     }
//   };

//   const setAns = (rowname, value) => setAnswers((prev) => ({ ...prev, [rowname]: value }));

//   const saveProgress = async () => {
//     try {
//       await questionnaireService.submitAnswers({ id: current.id, answers, message: 'Saved progress', action: null });
//       toast.success('Progress saved');
//       fetchList();
//     } catch (e) {
//       console.error(e);
//       toast.error('Failed to save');
//     }
//   };

//   const completeAndSend = async () => {
//   try {
//     await questionnaireService.submitAnswers({ id: current.id, answers, message: 'Completed', action: 'complete' });
//     toast.success('Submitted');
//     setFillOpen(false);
//     fetchList();
//   } catch (e) {
//     console.error(e);
//     // Temporary: server probably saved but response failed → refresh anyway
//     toast.warn('Server returned an error, reloading status…');
//     setFillOpen(false);
//     fetchList();
//   }
// };


//   const deny = async (id) => {
//     try {
//       await questionnaireService.submitAnswers({ id, answers: {}, message: 'Denied by supplier', action: 'deny' });
//       toast.info('Questionnaire denied');
//       fetchList();
//     } catch (e) {
//       console.error(e);
//       toast.error('Failed to deny');
//     }
//   };

//   // ---- UI ----
//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600 }}>Questionnaires</Typography>
//         {customerMode && (
//           <Button variant="contained" startIcon={<QuestionnaireIcon />} onClick={() => setCreateOpen(true)}>
//             New Questionnaire
//           </Button>
//         )}
//       </Box>

//       <Paper>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Title</TableCell>
//                 <TableCell>{customerMode ? 'Supplier' : 'Customer'}</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Created</TableCell>
//                 <TableCell>Due</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {(rows || []).map((q) => (
//                 <TableRow key={q.id}>
//                   <TableCell>{q.title}</TableCell>
//                   <TableCell>{customerMode ? q.supplier : q.customer}</TableCell>
//                   <TableCell><Chip label={q.status} color={statusColor(q.status)} size="small" /></TableCell>
//                   <TableCell>{q.creation ? new Date(q.creation).toLocaleDateString() : '—'}</TableCell>
//                   <TableCell>{q.due_date || '—'}</TableCell>
//                   <TableCell>
//                     {!customerMode && q.status === 'Pending' && (
//                       <>
//                         <Button size="small" variant="contained" sx={{ mr: 1 }} onClick={() => openFill(q.id)}>Start</Button>
//                         <Button size="small" variant="outlined" color="error" onClick={() => deny(q.id)}>Deny</Button>
//                       </>
//                     )}
//                     {customerMode && (
//                       <Button size="small" variant="outlined" onClick={() => openFill(q.id)}>
//                         {q.status === 'Pending' ? 'Preview' : 'View'}
//                       </Button>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//               {rows.length === 0 && (
//                 <TableRow><TableCell colSpan={6} align="center"><Alert severity="info">No questionnaires found.</Alert></TableCell></TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Create questionnaire (customer) */}
//       <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="md" fullWidth>
//         <DialogTitle>New Questionnaire</DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 0.5 }}>
//             <Grid item xs={12} sm={6}>
//               <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField fullWidth label="Due Date" type="date" InputLabelProps={{ shrink: true }}
//                          value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
//             </Grid>
//             <Grid item xs={12}>
//               <InputLabel>Supplier</InputLabel>
//               <Select fullWidth value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
//                 {suppliers.map((s) => (
//                   <MenuItem key={s._id || s.name || s.id} value={s._id || s.name || s.id}>
//                     {s.companyName || s.supplier_name || s.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </Grid>

//             <Grid item xs={12}><Typography variant="h6">Questions</Typography></Grid>
//             {qList.map((q, idx) => (
//               <Grid container spacing={1} key={idx} sx={{ px: 2, mb: 1 }}>
//                 <Grid item xs={12} sm={7}>
//                   <TextField fullWidth label={`Question ${idx + 1}`} value={q.question}
//                              onChange={(e) => updateQuestion(idx, { question: e.target.value })} />
//                 </Grid>
//                 <Grid item xs={12} sm={2}>
//                   <Select fullWidth value={q.input_type}
//                           onChange={(e) => updateQuestion(idx, { input_type: e.target.value })}>
//                     <MenuItem value="Text">Text</MenuItem>
//                     <MenuItem value="Radio">Radio</MenuItem>
//                   </Select>
//                 </Grid>
//                 <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
//                   <FormControlLabel
//                     control={<Checkbox checked={!!q.required} onChange={(e) => updateQuestion(idx, { required: e.target.checked ? 1 : 0 })} />}
//                     label="Required"
//                   />
//                 </Grid>
//                 {q.input_type === 'Radio' && (
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Options (comma-separated)"
//                       value={(q.options || []).join(', ')}
//                       onChange={(e) => updateQuestion(idx, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
//                     />
//                   </Grid>
//                 )}
//                 <Grid item xs={12}>
//                   <Button size="small" color="error" onClick={() => removeQuestion(idx)}>Remove</Button>
//                 </Grid>
//               </Grid>
//             ))}
//             <Grid item xs={12}>
//               <Button onClick={addQuestion}>Add Question</Button>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={createQ}>Create & Send</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Fill / View (supplier answers actual questions) */}
//       <Dialog open={fillOpen} onClose={() => setFillOpen(false)} maxWidth="md" fullWidth>
//         <DialogTitle>{current?.title || 'Questionnaire'}</DialogTitle>
//         <DialogContent>
//           {!current ? (
//             <Alert severity="info">Loading…</Alert>
//           ) : (
//             <Box sx={{ mt: 1 }}>
//               {(current.questions || []).map((q) => (
//                 <Box key={q.rowname} sx={{ mb: 2 }}>
//                   <Typography sx={{ fontWeight: 600 }}>{q.question}{q.required ? ' *' : ''}</Typography>
//                   {q.input_type === 'Radio' ? (
//                     <RadioGroup value={answers[q.rowname] || ''} onChange={(e) => setAns(q.rowname, e.target.value)}>
//                       {(q.options || []).map((opt) => (
//                         <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
//                       ))}
//                     </RadioGroup>
//                   ) : (
//                     <TextField fullWidth value={answers[q.rowname] || ''} onChange={(e) => setAns(q.rowname, e.target.value)} />
//                   )}
//                 </Box>
//               ))}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           {!customerMode && (
//             <>
//               <Button onClick={saveProgress}>Save Progress</Button>
//               <Button color="error" onClick={() => deny(current.id)}>Deny</Button>
//               <Button variant="contained" onClick={completeAndSend}>Complete & Send</Button>
//             </>
//           )}
//           {customerMode && <Button onClick={() => setFillOpen(false)}>Close</Button>}
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Questionnaires;

import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControlLabel, Radio, RadioGroup, Checkbox, Alert, Grid, Select,
  MenuItem, InputLabel, FormControl, IconButton, Link
} from '@mui/material';
import { toast } from 'react-toastify';
import { questionnaireService } from '../services/questionnaireService';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import {
  Assignment as QuestionnaireIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';

const Questionnaires = () => {
  const { isSupplier } = useAuth();
  const customerMode = !isSupplier;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create (customer)
  const [createOpen, setCreateOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState('');
  const [title, setTitle] = useState('EUDR Compliance Assessment');
  const [dueDate, setDueDate] = useState('');
  const [qList, setQList] = useState([
    { question: 'Is your company certified for sustainable practices?', input_type: 'Multiple Choice', options: ['Yes', 'No'], required: 1 },
    { question: 'Provide the year of your last third-party audit', input_type: 'Text', required: 0 },
  ]);

  // Fill (supplier)
  const [fillOpen, setFillOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [answers, setAnswers] = useState({}); // { [rowname]: value }

  const [uploadingFiles, setUploadingFiles] = useState({}); // { [rowname]: boolean }
  const [uploadedFiles, setUploadedFiles] = useState({}); // { [rowname]: {name, url} }

  const fetchList = async () => {
    try {
      setLoading(true);
      const { items } = await questionnaireService.listForMe();
      setRows(items);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load questionnaires');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    if (customerMode) {
      (async () => {
        try {
          const resp = await dataService.getSuppliers();
          const list = resp?.data?.suppliers ?? resp?.suppliers ?? [];
          setSuppliers(Array.isArray(list) ? list : []);
        } catch {/* ignore */}
      })();
    }
  }, [isSupplier]);

  const statusColor = (s) => {
    const k = (s || '').toLowerCase();
    if (k === 'pending') return 'warning';
    if (k === 'completed') return 'success';
    if (k === 'denied') return 'error';
    return 'default';
  };

  // ---- Customer: create ----
  const addQuestion = () => setQList((arr) => [...arr, { question: '', input_type: 'Text', required: 0 }]);
  const removeQuestion = (idx) => setQList((arr) => arr.filter((_, i) => i !== idx));
  // const updateQuestion = (idx, patch) => setQList((arr) => arr.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  const updateQuestion = (idx, patch) => {
    setQList((arr) => arr.map((q, i) => {
      if (i === idx) {
        const updated = { ...q, ...patch };
        // Map "File Upload" to "File" for backend
        if (updated.input_type === 'File Upload') {
          updated.input_type = 'File';
        }
        return updated;
      }
      return q;
    }));
  };
  

  const createQ = async () => {
    if (!supplierId || !title || qList.length === 0) {
      toast.error('Fill supplier, title, and add at least one question'); return;
    }
    for (const q of qList) {
      if ((q.input_type || '').toLowerCase() === 'multiple choice' && (!q.options || q.options.length === 0)) {
        toast.error('Multiple Choice question requires options'); return;
      }
    }
    try {
      await questionnaireService.create({ supplierId, title, questions: qList, dueDate: dueDate || undefined });
      toast.success('Questionnaire sent to supplier');
      setCreateOpen(false);
      setSupplierId(''); setTitle('EUDR Compliance Assessment'); setDueDate(''); setQList([]);
      fetchList();
    } catch (e) {
      console.error(e);
      toast.error('Failed to create questionnaire');
    }
  };

  // ---- Supplier: open / answer ----
  // const openFill = async (id) => {
  //   try {
  //     const doc = await questionnaireService.getOne(id);
  //     setCurrent(doc);
  //     const init = {};
  //     for (const q of doc.questions || []) init[q.rowname] = q.answer || '';
  //     setAnswers(init);
  //     setFillOpen(true);
  //   } catch (e) {
  //     console.error(e);
  //     toast.error('Unable to open questionnaire');
  //   }
  // };
  const openFill = async (id) => {
    try {
      const doc = await questionnaireService.getOne(id);
      setCurrent(doc);
      const init = {};
      const uploaded = {};
      
      for (const q of doc.questions || []) {
        if (q.input_type === 'File' && q.answer) {
          // Existing file upload
          uploaded[q.rowname] = { url: q.answer, name: 'Uploaded file' };
          init[q.rowname] = q.answer;
        } else {
          init[q.rowname] = q.answer || '';
        }
      }
      
      setAnswers(init);
      setUploadedFiles(uploaded);
      setUploadingFiles({});
      setFillOpen(true);
    } catch (e) {
      console.error(e);
      toast.error('Unable to open questionnaire');
    }
  };
  
  const setAns = (rowname, value) => setAnswers((prev) => ({ ...prev, [rowname]: value }));

  // Handle file selection
const handleFileSelect = async (rowname, file) => {
  if (!file) return;

  // Validate file size (e.g., max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error('File size must be less than 10MB');
    return;
  }

  // Store file temporarily
  setAns(rowname, file);
  
  // Show file name
  setUploadedFiles(prev => ({
    ...prev,
    [rowname]: { name: file.name, url: null }
  }));
};

// Remove file
const handleFileRemove = (rowname) => {
  setAns(rowname, '');
  setUploadedFiles(prev => {
    const updated = { ...prev };
    delete updated[rowname];
    return updated;
  });
};

// Upload all pending files
const uploadPendingFiles = async () => {
  const filesToUpload = [];
  
  for (const q of current.questions || []) {
    if (q.input_type === 'File' && answers[q.rowname] instanceof File) {
      filesToUpload.push({ rowname: q.rowname, file: answers[q.rowname] });
    }
  }

  if (filesToUpload.length === 0) return {};

  const updatedAnswers = { ...answers };
  
  for (const { rowname, file } of filesToUpload) {
    try {
      setUploadingFiles(prev => ({ ...prev, [rowname]: true }));
      
      const result = await questionnaireService.uploadFile(
        current.id,
        rowname,
        file
      );
      
      // Replace File object with the returned file_url
      updatedAnswers[rowname] = result.file_url;
      
      setUploadedFiles(prev => ({
        ...prev,
        [rowname]: { name: result.file_name, url: result.file_url }
      }));
      
    } catch (e) {
      console.error('File upload error:', e);
      toast.error(`Failed to upload ${file.name}`);
      throw e;
    } finally {
      setUploadingFiles(prev => ({ ...prev, [rowname]: false }));
    }
  }
  
  return updatedAnswers;
};


  // const saveProgress = async () => {
  //   try {
  //     await questionnaireService.submitAnswers({ id: current.id, answers, message: 'Saved progress', action: null });
  //     toast.success('Progress saved');
  //     fetchList();
  //   } catch (e) {
  //     console.error(e);
  //     toast.error('Failed to save');
  //   }
  // };
  // Similarly update saveProgress
  const saveProgress = async () => {
    try {
      const updatedAnswers = { ...answers };
      
      // Upload files that haven't been uploaded yet
      for (const q of current.questions || []) {
        if (q.input_type === 'File' && answers[q.rowname] instanceof File) {
          const result = await questionnaireService.uploadFile(
            current.id,
            q.rowname,
            answers[q.rowname]
          );
          updatedAnswers[q.rowname] = result.file_url;
        }
      }
      
      await questionnaireService.submitAnswers({
        id: current.id,
        answers: updatedAnswers,
        message: 'Saved progress',
        action: null
      });
      
      // Update local state with file URLs
      setAnswers(updatedAnswers);
      toast.success('Progress saved');
      fetchList();
    } catch (e) {
      console.error(e);
      toast.error('Failed to save');
    }
  };

  // const completeAndSend = async () => {
  //   try {
  //     await questionnaireService.submitAnswers({ id: current.id, answers, message: 'Completed', action: 'complete' });
  //     toast.success('Submitted');
  //     setFillOpen(false);
  //     fetchList();
  //   } catch (e) {
  //     console.error(e);
  //     toast.warn('Server returned an error, reloading status…');
  //     setFillOpen(false);
  //     fetchList();
  //   }
  // };
  // In the completeAndSend function
  const completeAndSend = async () => {
    try {
      // First, upload any files
      const updatedAnswers = { ...answers };
      
      for (const q of current.questions || []) {
        if (q.input_type === 'File' && answers[q.rowname] instanceof File) {
          // Upload the file first
          const result = await questionnaireService.uploadFile(
            current.id,
            q.rowname,
            answers[q.rowname]
          );
          // Replace File object with the returned file_url
          updatedAnswers[q.rowname] = result.file_url;
        }
      }
      
      // Then submit all answers
      await questionnaireService.submitAnswers({
        id: current.id,
        answers: updatedAnswers,
        message: 'Completed',
        action: 'complete'
      });
      
      toast.success('Submitted');
      setFillOpen(false);
      fetchList();
    } catch (e) {
      console.error(e);
      toast.error('Failed to submit');
    }
  };

  const deny = async (id) => {
    try {
      await questionnaireService.submitAnswers({ id, answers: {}, message: 'Denied by supplier', action: 'deny' });
      toast.info('Questionnaire denied');
      fetchList();
    } catch (e) {
      console.error(e);
      toast.error('Failed to deny');
    }
  };

  // ---- UI ----
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Questionnaires</Typography>
        {customerMode && (
          <Button variant="contained" startIcon={<QuestionnaireIcon />} onClick={() => setCreateOpen(true)}>
            New Questionnaire
          </Button>
        )}
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>{customerMode ? 'Supplier' : 'Customer'}</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rows || []).map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{q.title}</TableCell>
                  <TableCell>{customerMode ? q.supplier : q.customer}</TableCell>
                  <TableCell><Chip label={q.status} color={statusColor(q.status)} size="small" /></TableCell>
                  <TableCell>{q.creation ? new Date(q.creation).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>{q.due_date || '—'}</TableCell>
                  <TableCell>
                    {!customerMode && q.status === 'Pending' && (
                      <>
                        <Button size="small" variant="contained" sx={{ mr: 1 }} onClick={() => openFill(q.id)}>Start</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => deny(q.id)}>Deny</Button>
                      </>
                    )}
                    {customerMode && (
                      <Button size="small" variant="outlined" onClick={() => openFill(q.id)}>
                        {q.status === 'Pending' ? 'Preview' : 'View'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center"><Alert severity="info">No questionnaires found.</Alert></TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create questionnaire (customer) */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Questionnaire</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Due Date" type="date" InputLabelProps={{ shrink: true }}
                         value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Supplier</InputLabel>
              <Select fullWidth value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                {suppliers.map((s) => (
                  <MenuItem key={s._id || s.name || s.id} value={s._id || s.name || s.id}>
                    {s.companyName || s.supplier_name || s.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12}><Typography variant="h6" sx={{ mb: 1 }}>Questions</Typography></Grid>
            {qList.map((q, idx) => (
              <Box key={idx} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: '#fafafa' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      fullWidth
                      label={`Question ${idx + 1}`}
                      value={q.question}
                      onChange={(e) => updateQuestion(idx, { question: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel>Answer Type</InputLabel>
                      <Select
                        value={q.input_type}
                        label="Answer Type"
                        onChange={(e) => updateQuestion(idx, { input_type: e.target.value })}
                      >
                        <MenuItem value="Text">Text</MenuItem>
                        <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                        <MenuItem value="File">File Upload</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!q.required}
                          onChange={(e) => updateQuestion(idx, { required: e.target.checked ? 1 : 0 })}
                        />
                      }
                      label="Required"
                    />
                  </Grid>

                  {q.input_type === 'Multiple Choice' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Options (comma-separated)"
                        value={Array.isArray(q.options) ? q.options.join(', ') : q.options || ''}
                        onChange={(e) => updateQuestion(idx, { options: e.target.value })}
                        onBlur={(e) =>
                          updateQuestion(idx, {
                            options: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Button size="small" color="error" onClick={() => removeQuestion(idx)}>Remove</Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Grid item xs={12}>
              <Button variant="outlined" onClick={addQuestion}>Add Question</Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={createQ}>Create & Send</Button>
        </DialogActions>
      </Dialog>

      {/* Fill / View (supplier answers) */}
      {/* <Dialog open={fillOpen} onClose={() => setFillOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{current?.title || 'Questionnaire'}</DialogTitle>
        <DialogContent>
          {!current ? (
            <Alert severity="info">Loading…</Alert>
          ) : (
            <Box sx={{ mt: 1 }}>
              {(current.questions || []).map((q) => (
                <Box key={q.rowname} sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 600 }}>{q.question}{q.required ? ' *' : ''}</Typography>
                  {q.input_type === 'Multiple Choice' ? (
                    <RadioGroup
                      value={answers[q.rowname] || ''}
                      onChange={(e) => setAns(q.rowname, e.target.value)}
                    >
                      {(q.options || []).map((opt) => (
                        <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                      ))}
                    </RadioGroup>
                  ) : q.input_type === 'File' ? (
                    <>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{ mt: 1 }}
                      >
                        Upload File
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setAns(q.rowname, f);
                          }}
                        />
                      </Button>
                      {answers[q.rowname] && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {answers[q.rowname].name || 'File selected'}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <TextField
                      fullWidth
                      value={answers[q.rowname] || ''}
                      onChange={(e) => setAns(q.rowname, e.target.value)}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {!customerMode && (
            <>
              <Button onClick={saveProgress}>Save Progress</Button>
              <Button color="error" onClick={() => deny(current.id)}>Deny</Button>
              <Button variant="contained" onClick={completeAndSend}>Complete & Send</Button>
            </>
          )}
          {customerMode && <Button onClick={() => setFillOpen(false)}>Close</Button>}
        </DialogActions>
      </Dialog> */}
      {/* Fill / View (supplier answers) */}
<Dialog open={fillOpen} onClose={() => setFillOpen(false)} maxWidth="md" fullWidth>
  <DialogTitle>{current?.title || 'Questionnaire'}</DialogTitle>
  <DialogContent>
    {!current ? (
      <Alert severity="info">Loading…</Alert>
    ) : (
      (() => {
        // Calculate if fields should be disabled BEFORE mapping
        const isDisabled = customerMode || current.status !== 'Pending';
        
        return (
          <Box sx={{ mt: 1 }}>
            {(current.questions || []).map((q) => (
              <Box key={q.rowname} sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {q.question}
                  {q.required ? ' *' : ''}
                </Typography>
                
                {q.input_type === 'Multiple Choice' ? (
                  <RadioGroup
                    value={answers[q.rowname] || ''}
                    onChange={(e) => !isDisabled && setAns(q.rowname, e.target.value)}
                  >
                    {(q.options || []).map((opt) => (
                      <FormControlLabel 
                        key={opt} 
                        value={opt} 
                        control={<Radio disabled={isDisabled} />} 
                        label={opt}
                        disabled={isDisabled}
                      />
                    ))}
                  </RadioGroup>
                ) : q.input_type === 'File' ? (
                  <Box>
                    {!isDisabled ? (
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={uploadingFiles[q.rowname] ? <CircularProgress size={20} /> : <UploadIcon />}
                        disabled={uploadingFiles[q.rowname]}
                        sx={{ mt: 1 }}
                      >
                        {uploadedFiles[q.rowname] ? 'Change File' : 'Upload File'}
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileSelect(q.rowname, f);
                          }}
                        />
                      </Button>
                    ) : null}
                    
                    {uploadedFiles[q.rowname] && (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FileIcon color="primary" />
                        {uploadedFiles[q.rowname].url ? (
                          <Link href={uploadedFiles[q.rowname].url} target="_blank" rel="noopener">
                            {uploadedFiles[q.rowname].name}
                          </Link>
                        ) : (
                          <Typography variant="body2">{uploadedFiles[q.rowname].name}</Typography>
                        )}
                        {!isDisabled && (
                          <IconButton size="small" color="error" onClick={() => handleFileRemove(q.rowname)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    )}
                    
                    {!uploadedFiles[q.rowname] && isDisabled && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        No file uploaded
                      </Typography>
                    )}
                    
                    {uploadingFiles[q.rowname] && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Uploading...
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={answers[q.rowname] || ''}
                    onChange={(e) => setAns(q.rowname, e.target.value)}
                    disabled={isDisabled}
                    placeholder={isDisabled ? 'No answer provided' : 'Enter your answer'}
                    InputProps={{
                      readOnly: isDisabled
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        );
      })()
    )}
  </DialogContent>
  <DialogActions>
    {!customerMode && current?.status === 'Pending' && (
      <>
        <Button onClick={saveProgress}>Save Progress</Button>
        <Button color="error" onClick={() => { setFillOpen(false); deny(current.id); }}>
          Deny
        </Button>
        <Button variant="contained" onClick={completeAndSend}>
          Complete & Send
        </Button>
      </>
    )}
    {(customerMode || (current && current.status !== 'Pending')) && (
      <Button onClick={() => setFillOpen(false)}>Close</Button>
    )}
  </DialogActions>
</Dialog>


    </Box>
  );
};

export default Questionnaires;
