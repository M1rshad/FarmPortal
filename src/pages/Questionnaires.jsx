// import React, { useState, useEffect } from 'react';
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
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Stepper,
//   Step,
//   StepLabel,
//   TextField,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Checkbox,
//   Alert
// } from '@mui/material';
// import { 
//   Assignment as QuestionnaireIcon,
//   Check as CheckIcon,
//   Close as CloseIcon
// } from '@mui/icons-material';
// import { toast } from 'react-toastify';

// const Questionnaires = () => {
//   const [questionnaires, setQuestionnaires] = useState([
//     {
//       id: 1,
//       title: 'EUDR Compliance Assessment',
//       customer: 'ABC Importers EU',
//       status: 'pending',
//       createdDate: '2024-01-15',
//       questions: [
//         {
//           section: 'General Information',
//           items: [
//             { id: 'q1', question: 'Is your company certified for sustainable practices?', type: 'radio' },
//                         { id: 'q2', question: 'Do you have deforestation-free supply chain documentation?', type: 'radio' },
//             { id: 'q3', question: 'Year of last third-party audit', type: 'text' }
//           ]
//         },
//         {
//           section: 'Land Use',
//           items: [
//             { id: 'q4', question: 'Total hectares under cultivation', type: 'number' },
//             { id: 'q5', question: 'Percentage of land converted after 2020', type: 'number' },
//             { id: 'q6', question: 'Types of certifications held', type: 'checkbox', 
//               options: ['Rainforest Alliance', 'Fair Trade', 'Organic', 'UTZ', 'Other'] }
//           ]
//         }
//       ]
//     }
//   ]);
  
//   const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
//   const [activeStep, setActiveStep] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const handleStartQuestionnaire = (questionnaire) => {
//     setSelectedQuestionnaire(questionnaire);
//     setDialogOpen(true);
//     setActiveStep(0);
//     setAnswers({});
//   };

//   const handleAnswer = (questionId, value) => {
//     setAnswers({
//       ...answers,
//       [questionId]: value
//     });
//   };

//   const handleNext = () => {
//     setActiveStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prev) => prev - 1);
//   };

//   const handleSubmit = () => {
//     // Submit questionnaire
//     toast.success('Questionnaire submitted successfully');
//     setDialogOpen(false);
    
//     // Update questionnaire status
//     setQuestionnaires(questionnaires.map(q => 
//       q.id === selectedQuestionnaire.id 
//         ? { ...q, status: 'completed' }
//         : q
//     ));
//   };

//   const handleDeny = (questionnaireId) => {
//     setQuestionnaires(questionnaires.map(q => 
//       q.id === questionnaireId 
//         ? { ...q, status: 'denied' }
//         : q
//     ));
//     toast.info('Questionnaire denied');
//   };

//   const renderQuestionInput = (item) => {
//     switch (item.type) {
//       case 'radio':
//         return (
//           <RadioGroup
//             value={answers[item.id] || ''}
//             onChange={(e) => handleAnswer(item.id, e.target.value)}
//           >
//             <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//             <FormControlLabel value="no" control={<Radio />} label="No" />
//           </RadioGroup>
//         );
      
//       case 'text':
//       case 'number':
//         return (
//           <TextField
//             fullWidth
//             type={item.type}
//             value={answers[item.id] || ''}
//             onChange={(e) => handleAnswer(item.id, e.target.value)}
//             margin="normal"
//           />
//         );
      
//       case 'checkbox':
//         return (
//           <Box>
//             {item.options.map(option => (
//                             <FormControlLabel
//                 key={option}
//                 control={
//                   <Checkbox
//                     checked={answers[item.id]?.includes(option) || false}
//                     onChange={(e) => {
//                       const current = answers[item.id] || [];
//                       if (e.target.checked) {
//                         handleAnswer(item.id, [...current, option]);
//                       } else {
//                         handleAnswer(item.id, current.filter(o => o !== option));
//                       }
//                     }}
//                   />
//                 }
//                 label={option}
//               />
//             ))}
//           </Box>
//         );
      
//       default:
//         return null;
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
//         Questionnaires
//       </Typography>

//       <Typography variant="h6" sx={{ mb: 2 }}>
//         Open Questionnaires
//       </Typography>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Title</TableCell>
//               <TableCell>Customer</TableCell>
//               <TableCell>Date</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {questionnaires.filter(q => q.status === 'pending').map((q) => (
//               <TableRow key={q.id}>
//                 <TableCell>{q.title}</TableCell>
//                 <TableCell>{q.customer}</TableCell>
//                 <TableCell>{q.createdDate}</TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={q.status} 
//                     color="warning" 
//                     size="small" 
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     size="small"
//                     variant="contained"
//                     onClick={() => handleStartQuestionnaire(q)}
//                     sx={{ mr: 1 }}
//                   >
//                     Start
//                   </Button>
//                   <Button
//                     size="small"
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDeny(q.id)}
//                   >
//                     Deny
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Questionnaire Dialog */}
//       <Dialog 
//         open={dialogOpen} 
//         onClose={() => setDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>
//           {selectedQuestionnaire?.title}
//         </DialogTitle>
//         <DialogContent>
//           <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//             {selectedQuestionnaire?.questions.map((section) => (
//               <Step key={section.section}>
//                 <StepLabel>{section.section}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>

//           {selectedQuestionnaire && (
//             <Box>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 {selectedQuestionnaire.questions[activeStep].section}
//               </Typography>
//               {selectedQuestionnaire.questions[activeStep].items.map((item) => (
//                 <Box key={item.id} sx={{ mb: 3 }}>
//                   <FormLabel>{item.question}</FormLabel>
//                   {renderQuestionInput(item)}
//                 </Box>
//               ))}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Save & Continue Later</Button>
//           <Button 
//             disabled={activeStep === 0} 
//             onClick={handleBack}
//           >
//             Back
//           </Button>
//           {activeStep === (selectedQuestionnaire?.questions.length - 1) ? (
//             <Button variant="contained" onClick={handleSubmit}>
//               Complete & Send
//             </Button>
//           ) : (
//             <Button variant="contained" onClick={handleNext}>
//               Next
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Questionnaires;

// // import React, { useState, useEffect } from 'react';
// // import {
// //   Box,
// //   Paper,
// //   Typography,
// //   Button,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Chip,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   TextField,
// //   FormControl,
// //   FormLabel,
// //   RadioGroup,
// //   FormControlLabel,
// //   Radio,
// //   Checkbox,
// //   Alert,
// //   Grid,
// //   CircularProgress
// // } from '@mui/material';
// // import { 
// //   Assignment as QuestionnaireIcon,
// //   Check as CheckIcon,
// //   Close as CloseIcon,
// //   Upload as UploadIcon
// // } from '@mui/icons-material';
// // import { toast } from 'react-toastify';
// // import { requestService } from '../services/requestService';

// // const Questionnaires = () => {
// //   const [requests, setRequests] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedRequest, setSelectedRequest] = useState(null);
// //   const [dialogOpen, setDialogOpen] = useState(false);
// //   const [answers, setAnswers] = useState({});
// //   const [evidenceFile, setEvidenceFile] = useState(null);

// //   useEffect(() => {
// //     fetchProductDataRequests();
// //   }, []);

// //   const fetchProductDataRequests = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await requestService.getSupplierRequests();
// //       // Filter only product_data requests that are pending
// //       const productDataRequests = response.data.requests.filter(
// //         req => req.requestType === 'product_data' && req.status === 'pending'
// //       );
// //       setRequests(productDataRequests);
// //     } catch (error) {
// //       toast.error('Failed to fetch requests');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleStartQuestionnaire = (request) => {
// //     setSelectedRequest(request);
// //     setDialogOpen(true);
// //     setAnswers({});
// //     setEvidenceFile(null);
// //   };

// //   const handleAnswer = (questionId, value) => {
// //     setAnswers({
// //       ...answers,
// //       [questionId]: value
// //     });
// //   };

// //   const handleFileUpload = (event) => {
// //     setEvidenceFile(event.target.files[0]);
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       // Prepare EUDR compliance data
// //       const eudrCompliance = {
// //         deforestationFree: answers.deforestationFree || '',
// //         legalCompliance: answers.legalCompliance || '',
// //         certifications: answers.certifications || [],
// //         sustainabilityMeasures: answers.sustainabilityMeasures || '',
// //         riskAssessment: answers.riskAssessment || '',
// //         complianceMeasures: answers.complianceMeasures || {},
// //         physicalSegregation: answers.physicalSegregation || '',
// //         supplierCompliance: answers.supplierCompliance || '',
// //         productCompliance: answers.productCompliance || {},
// //         questionnaireFilled: true,
// //         filledDate: new Date().toISOString()
// //       };

// //       // Create FormData for file upload
// //       const formData = new FormData();
// //       formData.append('message', 'EUDR questionnaire completed');
// //       formData.append('status', 'completed');
// //       formData.append('eudrCompliance', JSON.stringify(eudrCompliance));
      
// //       if (evidenceFile) {
// //         formData.append('evidence', evidenceFile);
// //       }

// //       // Submit response
// //       await requestService.respondToRequest(selectedRequest._id, {
// //         message: 'EUDR questionnaire completed',
// //         status: 'completed',
// //         eudrCompliance: eudrCompliance
// //       });

// //       toast.success('Questionnaire submitted successfully');
// //       setDialogOpen(false);
// //       fetchProductDataRequests(); // Refresh the list
// //     } catch (error) {
// //       toast.error('Failed to submit questionnaire');
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <Box display="flex" justifyContent="center" alignItems="center" height="400px">
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Box>
// //       <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
// //         EUDR Compliance Requests
// //       </Typography>

// //       {requests.length === 0 ? (
// //         <Alert severity="info">
// //           No pending EUDR compliance requests at this time.
// //         </Alert>
// //       ) : (
// //         <>
// //           <Typography variant="h6" sx={{ mb: 2 }}>
// //             Pending Compliance Requests
// //           </Typography>

// //           <TableContainer component={Paper}>
// //             <Table>
// //               <TableHead>
// //                 <TableRow>
// //                   <TableCell>Request ID</TableCell>
// //                   <TableCell>Customer</TableCell>
// //                   <TableCell>Product</TableCell>
// //                   <TableCell>Date</TableCell>
// //                   <TableCell>Status</TableCell>
// //                   <TableCell>Actions</TableCell>
// //                 </TableRow>
// //               </TableHead>
// //               <TableBody>
// //                 {requests.map((request) => (
// //                   <TableRow key={request._id}>
// //                     <TableCell>{request._id.slice(-8)}</TableCell>
// //                     <TableCell>{request.customer?.companyName}</TableCell>
// //                     <TableCell>
// //                       {request.requestedProducts?.[0]?.productId?.name || 
// //                        request.requestedProducts?.[0]?.productName || '-'}
// //                     </TableCell>
// //                     <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
// //                     <TableCell>
// //                       <Chip 
// //                         label="Pending" 
// //                         color="warning" 
// //                         size="small" 
// //                       />
// //                     </TableCell>
// //                     <TableCell>
// //                       <Button
// //                         size="small"
// //                         variant="contained"
// //                         onClick={() => handleStartQuestionnaire(request)}
// //                       >
// //                         Start Assessment
// //                       </Button>
// //                     </TableCell>
// //                   </TableRow>
// //                 ))}
// //               </TableBody>
// //             </Table>
// //           </TableContainer>
// //         </>
// //       )}

// //       {/* EUDR Assessment Dialog */}
// //       <Dialog 
// //         open={dialogOpen} 
// //         onClose={() => setDialogOpen(false)}
// //         maxWidth="md"
// //         fullWidth
// //       >
// //         <DialogTitle>
// //           EUDR Compliance Assessment for {selectedRequest?.customer?.companyName}
// //         </DialogTitle>
// //         <DialogContent>
// //           <Alert severity="info" sx={{ mb: 2 }}>
// //             Product: {selectedRequest?.requestedProducts?.[0]?.productId?.name || 'Product'}
// //           </Alert>

// //           <Grid container spacing={3}>
// //             {/* Question 1 */}
// //             <Grid item xs={12}>
// //               <Typography variant="h6">
// //                 1. Is this product deforestation-free?
// //               </Typography>
// //               <RadioGroup
// //                 value={answers.deforestationFree || ''}
// //                 onChange={(e) => handleAnswer('deforestationFree', e.target.value)}
// //               >
// //                 <FormControlLabel 
// //                   value="yes" 
// //                   control={<Radio />} 
// //                   label="Yes, verified deforestation-free since Dec 31, 2020" 
// //                 />
// //                 <FormControlLabel 
// //                   value="no" 
// //                   control={<Radio />} 
// //                   label="No / Cannot verify" 
// //                 />
// //               </RadioGroup>
// //             </Grid>

// //             {/* Question 2 */}
// //             <Grid item xs={12}>
// //               <Typography variant="h6">
// //                 2. Legal compliance status
// //               </Typography>
// //               <RadioGroup
// //                 value={answers.legalCompliance || ''}
// //                 onChange={(e) => handleAnswer('legalCompliance', e.target.value)}
// //               >
// //                 <FormControlLabel value="compliant" control={<Radio />} label="Fully compliant with local laws" />
// //                 <FormControlLabel value="partial" control={<Radio />} label="Partially compliant" />
// //                 <FormControlLabel value="non-compliant" control={<Radio />} label="Non-compliant" />
// //               </RadioGroup>
// //             </Grid>

// //             {/* Question 3 */}
// //             <Grid item xs={12}>
// //               <Typography variant="h6">
// //                 3. Certifications held
// //               </Typography>
// //               {['Rainforest Alliance', 'Fair Trade', 'Organic', 'UTZ', 'RSPO', 'FSC'].map(cert => (
// //                 <FormControlLabel
// //                   key={cert}
// //                   control={
// //                     <Checkbox
// //                       checked={answers.certifications?.includes(cert) || false}
// //                       onChange={(e) => {
// //                         const current = answers.certifications || [];
// //                         if (e.target.checked) {
// //                           handleAnswer('certifications', [...current, cert]);
// //                         } else {
// //                           handleAnswer('certifications', current.filter(c => c !== cert));
// //                         }
// //                       }}
// //                     />
// //                   }
// //                   label={cert}
// //                 />
// //               ))}
// //             </Grid>

// //             {/* Question 4 */}
// //             <Grid item xs={12}>
// //               <Typography variant="h6">
// //                 4. Has your company implemented EUDR-specific risk assessment procedures?
// //               </Typography>
// //               <RadioGroup
// //                 value={answers.riskAssessment || ''}
// //                 onChange={(e) => handleAnswer('riskAssessment', e.target.value)}
// //                               >
// //                 <FormControlLabel value="yes" control={<Radio />} label="Yes, we have established procedures" />
// //                 <FormControlLabel value="no" control={<Radio />} label="No, we have not yet implemented EUDR-specific procedures" />
// //               </RadioGroup>
// //             </Grid>

// //             {/* Question 5 */}
// //             <Grid item xs={12}>
// //               <Typography variant="h6">
// //                 5. Do you maintain physical segregation between EUDR-compliant and non-compliant products?
// //               </Typography>
// //               <RadioGroup
// //                 value={answers.physicalSegregation || ''}
// //                 onChange={(e) => handleAnswer('physicalSegregation', e.target.value)}
// //               >
// //                 <FormControlLabel value="yes" control={<Radio />} label="Yes, we have established procedures and controls" />
// //                 <FormControlLabel value="no" control={<Radio />} label="No, we do not currently segregate products" />
// //                 <FormControlLabel value="notApplicable" control={<Radio />} label="Not applicable - we only have EUDR-compliant products" />
// //               </RadioGroup>
// //             </Grid>

// //             {/* Question 6 */}
// //             <Grid item xs={12}>
// //               <Typography variant="h6">
// //                 6. Sustainability measures description
// //               </Typography>
// //               <TextField
// //                 fullWidth
// //                 multiline
// //                 rows={3}
// //                 placeholder="Describe your sustainability practices..."
// //                 value={answers.sustainabilityMeasures || ''}
// //                 onChange={(e) => handleAnswer('sustainabilityMeasures', e.target.value)}
// //               />
// //             </Grid>

// //             {/* Evidence Upload */}
// //             <Grid item xs={12}>
// //               <Typography variant="h6">
// //                 7. Upload Evidence (Certificates, Documents, etc.)
// //               </Typography>
// //               <Button
// //                 variant="outlined"
// //                 component="label"
// //                 startIcon={<UploadIcon />}
// //                 fullWidth
// //               >
// //                 {evidenceFile ? evidenceFile.name : 'Choose File'}
// //                 <input
// //                   type="file"
// //                   hidden
// //                   onChange={handleFileUpload}
// //                   accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
// //                 />
// //               </Button>
// //             </Grid>
// //           </Grid>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
// //           <Button 
// //             variant="contained" 
// //             onClick={handleSubmit}
// //             disabled={!answers.deforestationFree || !answers.legalCompliance}
// //           >
// //             Submit Assessment
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // };

// // export default Questionnaires;

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControlLabel, Radio, RadioGroup, Checkbox, Alert, Grid, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Assignment as QuestionnaireIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { questionnaireService } from '../services/questionnaireService';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

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
    { question: 'Is your company certified for sustainable practices?', input_type: 'Radio', options: ['Yes','No'], required: 1 },
    { question: 'Provide the year of your last third-party audit', input_type: 'Text', required: 0 },
  ]);

  // Fill (supplier)
  const [fillOpen, setFillOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [answers, setAnswers] = useState({}); // { [rowname]: value }

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
  const updateQuestion = (idx, patch) => setQList((arr) => arr.map((q, i) => (i === idx ? { ...q, ...patch } : q)));

  const createQ = async () => {
    if (!supplierId || !title || qList.length === 0) {
      toast.error('Fill supplier, title, and add at least one question'); return;
    }
    // validate radios have options
    for (const q of qList) {
      if ((q.input_type || '').toLowerCase() === 'radio' && (!q.options || q.options.length === 0)) {
        toast.error('Radio question requires options'); return;
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
  const openFill = async (id) => {
    try {
      const doc = await questionnaireService.getOne(id);
      setCurrent(doc);
      const init = {};
      for (const q of doc.questions || []) init[q.rowname] = q.answer || '';
      setAnswers(init);
      setFillOpen(true);
    } catch (e) {
      console.error(e);
      toast.error('Unable to open questionnaire');
    }
  };

  const setAns = (rowname, value) => setAnswers((prev) => ({ ...prev, [rowname]: value }));

  const saveProgress = async () => {
    try {
      await questionnaireService.submitAnswers({ id: current.id, answers, message: 'Saved progress', action: null });
      toast.success('Progress saved');
      fetchList();
    } catch (e) {
      console.error(e);
      toast.error('Failed to save');
    }
  };

  // const completeAndSend = async () => {
  //   // simple required check
  //   const requiredMissing = (current?.questions || []).some((q) => q.required && !String(answers[q.rowname] || '').trim());
  //   if (requiredMissing) {
  //     toast.error('Please answer all required questions'); return;
  //   }
  //   try {
  //     await questionnaireService.submitAnswers({ id: current.id, answers, message: 'Completed', action: 'complete' });
  //     toast.success('Submitted');
  //     setFillOpen(false);
  //     fetchList();
  //   } catch (e) {
  //     console.error(e);
  //     toast.error('Submit failed');
  //   }
  // };
  const completeAndSend = async () => {
  try {
    await questionnaireService.submitAnswers({ id: current.id, answers, message: 'Completed', action: 'complete' });
    toast.success('Submitted');
    setFillOpen(false);
    fetchList();
  } catch (e) {
    console.error(e);
    // Temporary: server probably saved but response failed → refresh anyway
    toast.warn('Server returned an error, reloading status…');
    setFillOpen(false);
    fetchList();
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

            <Grid item xs={12}><Typography variant="h6">Questions</Typography></Grid>
            {qList.map((q, idx) => (
              <Grid container spacing={1} key={idx} sx={{ px: 2, mb: 1 }}>
                <Grid item xs={12} sm={7}>
                  <TextField fullWidth label={`Question ${idx + 1}`} value={q.question}
                             onChange={(e) => updateQuestion(idx, { question: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Select fullWidth value={q.input_type}
                          onChange={(e) => updateQuestion(idx, { input_type: e.target.value })}>
                    <MenuItem value="Text">Text</MenuItem>
                    <MenuItem value="Radio">Radio</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={<Checkbox checked={!!q.required} onChange={(e) => updateQuestion(idx, { required: e.target.checked ? 1 : 0 })} />}
                    label="Required"
                  />
                </Grid>
                {q.input_type === 'Radio' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Options (comma-separated)"
                      value={(q.options || []).join(', ')}
                      onChange={(e) => updateQuestion(idx, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button size="small" color="error" onClick={() => removeQuestion(idx)}>Remove</Button>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={addQuestion}>Add Question</Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={createQ}>Create & Send</Button>
        </DialogActions>
      </Dialog>

      {/* Fill / View (supplier answers actual questions) */}
      <Dialog open={fillOpen} onClose={() => setFillOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{current?.title || 'Questionnaire'}</DialogTitle>
        <DialogContent>
          {!current ? (
            <Alert severity="info">Loading…</Alert>
          ) : (
            <Box sx={{ mt: 1 }}>
              {(current.questions || []).map((q) => (
                <Box key={q.rowname} sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: 600 }}>{q.question}{q.required ? ' *' : ''}</Typography>
                  {q.input_type === 'Radio' ? (
                    <RadioGroup value={answers[q.rowname] || ''} onChange={(e) => setAns(q.rowname, e.target.value)}>
                      {(q.options || []).map((opt) => (
                        <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                      ))}
                    </RadioGroup>
                  ) : (
                    <TextField fullWidth value={answers[q.rowname] || ''} onChange={(e) => setAns(q.rowname, e.target.value)} />
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
      </Dialog>
    </Box>
  );
};

export default Questionnaires;
