// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Tabs,
//   Tab,
//   MenuItem,
// } from "@mui/material";
// import { toast } from "react-toastify";

// // services
// import {
//   saveProfile,
//   getProfileForUser,
//   uploadFile,
//   addCertificate,
// } from "../services/organizationProfileService";

// const OrganizationProfile = () => {
//   const [tabIndex, setTabIndex] = useState(0);
//   const [saving, setSaving] = useState(false);
//   const [docname, setDocname] = useState("");

//   // General info
//   const [generalInfo, setGeneralInfo] = useState({
//     organizationName: '',
//     website: '',
//     phone: '',
//     street: '',
//     houseNumber: '',
//     postalCode: '',
//     city: '',
//     country: '',
//     operatorType: '',
//   });

//   // Certificate info
//   const [certification, setCertification] = useState({
//     certificateName: "",
//     evidenceType: "",
//     validFrom: "",
//     validTo: "",
//     certificateFile: null,
//   });

//   // Load existing organization profile when page mounts
//   useEffect(() => {
//     async function loadExisting() {
//       try {
//         const profile = await getProfileForUser();
//         if (profile) {
//           console.log('Loaded organization profile:', profile);
//           setGeneralInfo({
//             organizationName: profile.organization_name || '',
//             website: profile.website || '',
//             phone: profile.phone || '',
//             street: profile.street || '',
//             houseNumber: profile.house_no || '',
//             postalCode: profile.postal_code || '',
//             city: profile.city || '',
//             country: profile.country || '',
//             operatorType: profile.type_of_market_operator || '',
//           });
//           setDocname(profile.name);
//         } else {
//           console.log('No existing organization profile found');
//         }
//       } catch (err) {
//         console.error('Error loading profile:', err);
//         toast.error('Failed to load organization profile');
//       }
//     }
//     loadExisting();
//   }, []);

  

//   // Tab control
//   const handleTabChange = (_e, newValue) => setTabIndex(newValue);

//   // Input handlers
//   const handleGeneralInfoChange = (field, value) =>
//     setGeneralInfo((prev) => ({ ...prev, [field]: value }));

//   const handleCertificationChange = (field, value) =>
//     setCertification((prev) => ({ ...prev, [field]: value }));

//   const handleLogoUpload = async (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     try {
//       const fileUrl = await uploadFile(f);
//       setGeneralInfo((prev) => ({ ...prev, logo: fileUrl }));
//       toast.success("Logo uploaded successfully!");
//     } catch (err) {
//       toast.error("Logo upload failed");
//     }
//   };

//   const handleFileUpload = (e) => {
//     const f = e.target.files?.[0] || null;
//     if (!f) return;
//     setCertification((prev) => ({ ...prev, certificateFile: f }));
//     toast.success("Certificate file selected");
//   };

//   // Validations
//   const validateGeneralInfo = () => {
//     if (!generalInfo.organizationName.trim()) {
//       toast.error("Organization Name is required");
//       return false;
//     }
//     return true;
//   };

//   const validateCertificate = () => {
//     if (!certification.certificateName.trim()) {
//       toast.error("Certificate Name is required");
//       return false;
//     }
//     if (!certification.validFrom || !certification.validTo) {
//       toast.error("Valid From and Valid To are required");
//       return false;
//     }
//     if (new Date(certification.validFrom) > new Date(certification.validTo)) {
//       toast.error("Valid From must be earlier than or equal to Valid To");
//       return false;
//     }
//     if (!certification.certificateFile) {
//       toast.error("Please upload a certificate file");
//       return false;
//     }
//     return true;
//   };

//   // Save org profile (create or update)
//   const onSaveGeneral = async () => {
//     if (!validateGeneralInfo()) return;
//     try {
//       setSaving(true);
//       const res = await saveProfile({
//         docname,
//         ...generalInfo,
//       });
//       if (res?.name) setDocname(res.name);
//       toast.success("Organization Information saved successfully!");
//     } catch (e) {
//       const msg =
//         e?.response?.data?._error_message ||
//         e?.response?.data?.message ||
//         e?.message ||
//         "Failed to save organization info";
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Save certificate child
//   const onSaveCertificate = async () => {
//     if (!validateCertificate()) return;
//     try {
//       setSaving(true);
//       let ensuredDocname = docname;

//       // Ensure parent doc exists first
//       if (!ensuredDocname) {
//         const res = await saveProfile({
//           docname: "",
//           ...generalInfo,
//           organizationName: generalInfo.organizationName || "Unnamed Organization",
//         });
//         ensuredDocname = res?.name;
//         if (!ensuredDocname) {
//           toast.error("Could not create Organization Profile");
//           setSaving(false);
//           return;
//         }
//         setDocname(ensuredDocname);
//       }

//       // Upload certificate file
//       const fileUrl = await uploadFile(certification.certificateFile, 1);
//       if (!fileUrl) {
//         toast.error("File upload failed");
//         setSaving(false);
//         return;
//       }

//       // Add certification
//       await addCertificate({
//         profileName: ensuredDocname,
//         certificateName: certification.certificateName,
//         evidenceType: certification.evidenceType,
//         validFrom: certification.validFrom,
//         validTo: certification.validTo,
//         fileUrl,
//       });

//       toast.success("Certification saved successfully!");
//     } catch (err) {
//       const msg =
//         err?.response?.data?._error_message ||
//         err?.response?.data?.message ||
//         err?.message ||
//         "Failed to save certificate";
//       toast.error(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleSave = () => (tabIndex === 0 ? onSaveGeneral() : onSaveCertificate());

//   // UI
//   return (
//     <Box>
//       <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
//         Organization Profile
//       </Typography>

//       <Paper sx={{ p: 4 }}>
//         <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 4 }}>
//           <Tab label="General Information" />
//           <Tab label="Certification" />
//         </Tabs>

//         {tabIndex === 0 && (
//           <Box>
//             <Grid container spacing={3}>
//               {/* Organization Name */}
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Organization Name *"
//                   value={generalInfo.organizationName}
//                   onChange={(e) =>
//                     handleGeneralInfoChange("organizationName", e.target.value)
//                   }
//                 />
//               </Grid>

//               {/* Website + Phone */}
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Website"
//                   value={generalInfo.website}
//                   onChange={(e) =>
//                     handleGeneralInfoChange("website", e.target.value)
//                   }
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Phone"
//                   value={generalInfo.phone}
//                   onChange={(e) =>
//                     handleGeneralInfoChange("phone", e.target.value)
//                   }
//                 />
//               </Grid>

//               {/* Address */}
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Street"
//                   value={generalInfo.street}
//                   onChange={(e) =>
//                     handleGeneralInfoChange("street", e.target.value)
//                   }
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="House Number"
//                   value={generalInfo.houseNumber}
//                   onChange={(e) =>
//                     handleGeneralInfoChange("houseNumber", e.target.value)
//                   }
//                 />
//               </Grid>

//               {/* City / Postal / Country */}
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Postal Code"
//                   value={generalInfo.postalCode}
//                   onChange={(e) =>
//                     handleGeneralInfoChange("postalCode", e.target.value)
//                   }
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="City"
//                   value={generalInfo.city}
//                   onChange={(e) =>
//                     handleGeneralInfoChange("city", e.target.value)
//                   }
//                 />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <TextField
//                   fullWidth
//                   label="Country"
//                   value={generalInfo.country}
//                   onChange={(e) =>
//                     handleGeneralInfoChange("country", e.target.value)
//                   }
//                 />
//               </Grid>

//               {/* Operator Type */}
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Type of Market Operator"
//                   value={generalInfo.operatorType}
//                   onChange={(e) =>
//                     handleGeneralInfoChange("operatorType", e.target.value)
//                   }
//                 >
//                   <MenuItem value="EU Market Operator">EU Market Operator</MenuItem>
//                   <MenuItem value="Non-EU Market Operator">
//                     Non-EU Market Operator
//                   </MenuItem>
//                 </TextField>
//               </Grid>

//               {/* Logo Upload */}
//               <Grid item xs={12} md={6}>
//                 <Button variant="contained" component="label" sx={{ mt: 1 }}>
//                   Upload Logo
//                   <input type="file" hidden onChange={handleLogoUpload} />
//                 </Button>
//                 {generalInfo.logo && (
//                   <Typography variant="body2" sx={{ mt: 1 }}>
//                     Current: {generalInfo.logo}
//                   </Typography>
//                 )}
//               </Grid>

//               {/* Save Button */}
//               <Grid item xs={12}>
//                 <Button
//                   variant="contained"
//                   onClick={handleSave}
//                   disabled={saving}
//                   sx={{ mt: 2 }}
//                 >
//                   {saving ? "Saving..." : "Save"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         )}

//         {/* Certification Tab */}
//         {tabIndex === 1 && (
//           <Box>
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Certificate Name *"
//                   value={certification.certificateName}
//                   onChange={(e) =>
//                     handleCertificationChange("certificateName", e.target.value)
//                   }
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Evidence Type"
//                   value={certification.evidenceType}
//                   onChange={(e) =>
//                     handleCertificationChange("evidenceType", e.target.value)
//                   }
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   type="date"
//                   label="Valid From *"
//                   InputLabelProps={{ shrink: true }}
//                   value={certification.validFrom}
//                   onChange={(e) =>
//                     handleCertificationChange("validFrom", e.target.value)
//                   }
//                 />
//               </Grid>

//               <Grid item xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   type="date"
//                   label="Valid To *"
//                   InputLabelProps={{ shrink: true }}
//                   value={certification.validTo}
//                   onChange={(e) =>
//                     handleCertificationChange("validTo", e.target.value)
//                   }
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <Button variant="contained" component="label" sx={{ mb: 1 }}>
//                   Upload Certificate
//                   <input type="file" hidden onChange={(e) => handleFileUpload(e)} />
//                 </Button>
//                 <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
//                   {certification.certificateFile?.name || "No file selected"}
//                 </Typography>
//               </Grid>

//               <Grid item xs={12}>
//                 <Button
//                   variant="contained"
//                   onClick={handleSave}
//                   disabled={saving}
//                   sx={{ mt: 2 }}
//                 >
//                   {saving ? "Saving..." : "Save"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default OrganizationProfile;
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import { toast } from "react-toastify";

// services
import {
  saveProfile,
  getProfileForUser,
  uploadFile,
  addCertificate,  
  deleteCertificate,
} from "../services/organizationProfileService";

const OrganizationProfile = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [docname, setDocname] = useState("");
  const [certificates, setCertificates] = useState([]);

  // General info
  const [generalInfo, setGeneralInfo] = useState({
    organizationName: "",
    website: "",
    phone: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "",
    operatorType: "",
    logo: "",
  });

  // Certificate info (form inputs)
  const [certification, setCertification] = useState({
    certificateName: "",
    evidenceType: "",
    validFrom: "",
    validTo: "",
    certificateFile: null,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);


  // -----------------------------
  // Load existing organization profile
  // -----------------------------
  useEffect(() => {
    async function loadExisting() {
      try {
        const profile = await getProfileForUser();
        if (profile) {
          console.log("Loaded organization profile:", profile);
          setGeneralInfo({
            organizationName: profile.organization_name || "",
            website: profile.website || "",
            phone: profile.phone || "",
            street: profile.street || "",
            houseNumber: profile.house_no || "",
            postalCode: profile.postal_code || "",
            city: profile.city || "",
            country: profile.country || "",
            operatorType: profile.type_of_market_operator || "",
            logo: profile.logo || "",
          });
          setDocname(profile.name);
          setCertificates(profile.certificates || []);
        } else {
          console.log("No existing organization profile found");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        toast.error("Failed to load organization profile");
      }
    }
    loadExisting();
  }, []);

  // -----------------------------
  // Tab control
  // -----------------------------
  const handleTabChange = (_e, newValue) => setTabIndex(newValue);

  // -----------------------------
  // Input handlers
  // -----------------------------
  const handleGeneralInfoChange = (field, value) =>
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));

  const handleCertificationChange = (field, value) =>
    setCertification((prev) => ({ ...prev, [field]: value }));

  const handleLogoUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const fileUrl = await uploadFile(f);
      setGeneralInfo((prev) => ({ ...prev, logo: fileUrl }));
      toast.success("Logo uploaded successfully!");
    } catch (err) {
      toast.error("Logo upload failed");
    }
  };

  const handleFileUpload = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    setCertification((prev) => ({ ...prev, certificateFile: f }));
    toast.success("Certificate file selected");
  };

  // -----------------------------
  // Validations
  // -----------------------------
  const validateGeneralInfo = () => {
    if (!generalInfo.organizationName.trim()) {
      toast.error("Organization Name is required");
      return false;
    }
    return true;
  };

  const validateCertificate = () => {
    if (!certification.certificateName.trim()) {
      toast.error("Certificate Name is required");
      return false;
    }
    if (!certification.validFrom || !certification.validTo) {
      toast.error("Valid From and Valid To are required");
      return false;
    }
    if (new Date(certification.validFrom) > new Date(certification.validTo)) {
      toast.error("Valid From must be earlier than or equal to Valid To");
      return false;
    }
    if (!certification.certificateFile) {
      toast.error("Please upload a certificate file");
      return false;
    }
    return true;
  };

  // -----------------------------
  // Save Organization Info
  // -----------------------------
  const onSaveGeneral = async () => {
    if (!validateGeneralInfo()) return;
    try {
      setSaving(true);
      const res = await saveProfile({
        docname,
        ...generalInfo,
      });
      if (res?.name) setDocname(res.name);
      toast.success("Organization Information saved successfully!");
    } catch (e) {
      const msg =
        e?.response?.data?._error_message ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to save organization info";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Save Certificate (child table)
  // -----------------------------
  const onSaveCertificate = async () => {
    if (!validateCertificate()) return;
    try {
      setSaving(true);
      let ensuredDocname = docname;

      // Ensure parent doc exists first
      if (!ensuredDocname) {
        const res = await saveProfile({
          docname: "",
          ...generalInfo,
          organizationName: generalInfo.organizationName || "Unnamed Organization",
        });
        ensuredDocname = res?.name;
        if (!ensuredDocname) {
          toast.error("Could not create Organization Profile");
          setSaving(false);
          return;
        }
        setDocname(ensuredDocname);
      }

      // Upload certificate file
      const fileUrl = await uploadFile(certification.certificateFile, 1);
      if (!fileUrl) {
        toast.error("File upload failed");
        setSaving(false);
        return;
      }

      // Add certification
      const res = await addCertificate({
        profileName: ensuredDocname,
        certificateName: certification.certificateName,
        evidenceType: certification.evidenceType,
        validFrom: certification.validFrom,
        validTo: certification.validTo,
        fileUrl,
      });

      // Update local certificates list
      setCertificates((prev) => [
        ...prev,
        {
          certificate_name: certification.certificateName,
          evidence_type: certification.evidenceType,
          valid_from: certification.validFrom,
          valid_to: certification.validTo,
          attachment: fileUrl,
        },
      ]);

      // Reset form
      setCertification({
        certificateName: "",
        evidenceType: "",
        validFrom: "",
        validTo: "",
        certificateFile: null,
      });

      toast.success("Certification saved successfully!");
    } catch (err) {
      const msg =
        err?.response?.data?._error_message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save certificate";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () =>
    tabIndex === 0 ? onSaveGeneral() : onSaveCertificate();

  const handleDeleteCertificate = async (certificateName) => {
  try {
    await deleteCertificate(docname, certificateName);
    setCertificates((prev) =>
      prev.filter((cert) => cert.certificate_name !== certificateName)
    );
    toast.success(`Certificate "${certificateName}" deleted successfully`);
  } catch (err) {
    toast.error("Failed to delete certificate");
    console.error(err);
  }
};


  // -----------------------------
  // UI
  // -----------------------------
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Organization Profile
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="General Information" />
          <Tab label="Certification" />
        </Tabs>

        {/* ---------------- General Info Tab ---------------- */}
        {tabIndex === 0 && (
          <Box>
            <Grid container spacing={3}>
              {/* Organization Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Name *"
                  value={generalInfo.organizationName}
                  onChange={(e) =>
                    handleGeneralInfoChange("organizationName", e.target.value)
                  }
                />
              </Grid>

              {/* Website + Phone */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={generalInfo.website}
                  onChange={(e) =>
                    handleGeneralInfoChange("website", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={generalInfo.phone}
                  onChange={(e) =>
                    handleGeneralInfoChange("phone", e.target.value)
                  }
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Street"
                  value={generalInfo.street}
                  onChange={(e) =>
                    handleGeneralInfoChange("street", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="House Number"
                  value={generalInfo.houseNumber}
                  onChange={(e) =>
                    handleGeneralInfoChange("houseNumber", e.target.value)
                  }
                />
              </Grid>

              {/* City / Postal / Country */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={generalInfo.postalCode}
                  onChange={(e) =>
                    handleGeneralInfoChange("postalCode", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={generalInfo.city}
                  onChange={(e) =>
                    handleGeneralInfoChange("city", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Country"
                  value={generalInfo.country}
                  onChange={(e) =>
                    handleGeneralInfoChange("country", e.target.value)
                  }
                />
              </Grid>

              {/* Operator Type */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Type of Market Operator"
                  value={generalInfo.operatorType}
                  onChange={(e) =>
                    handleGeneralInfoChange("operatorType", e.target.value)
                  }
                >
                  <MenuItem value="EU Market Operator">EU Market Operator</MenuItem>
                  <MenuItem value="Non-EU Market Operator">
                    Non-EU Market Operator
                  </MenuItem>
                </TextField>
              </Grid>

              {/* Logo Upload */}
              <Grid item xs={12} md={6}>
                <Button variant="contained" component="label" sx={{ mt: 1 }}>
                  Upload Logo
                  <input type="file" hidden onChange={handleLogoUpload} />
                </Button>
                {generalInfo.logo && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Current: {generalInfo.logo}
                  </Typography>
                )}
              </Grid>

              {/* Save Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ mt: 2 }}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ---------------- Certificates Tab ---------------- */}
        {tabIndex === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Certificate Name *"
                  value={certification.certificateName}
                  onChange={(e) =>
                    handleCertificationChange("certificateName", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Evidence Type"
                  value={certification.evidenceType}
                  onChange={(e) =>
                    handleCertificationChange("evidenceType", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Valid From *"
                  InputLabelProps={{ shrink: true }}
                  value={certification.validFrom}
                  onChange={(e) =>
                    handleCertificationChange("validFrom", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Valid To *"
                  InputLabelProps={{ shrink: true }}
                  value={certification.validTo}
                  onChange={(e) =>
                    handleCertificationChange("validTo", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" component="label" sx={{ mb: 1 }}>
                  Upload Certificate
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>
                <Typography variant="body2" sx={{ ml: 2, display: "inline" }}>
                  {certification.certificateFile?.name || "No file selected"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={onSaveCertificate}
                  disabled={saving}
                  sx={{ mt: 2 }}
                >
                  {saving ? "Saving..." : "Save Certificate"}
                </Button>
              </Grid>

              {/* Existing Certificates */}
              {certificates?.length > 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6">Uploaded Certificates</Typography>
                  <List>
                    {certificates.map((c, idx) => (
                      <ListItem key={idx} divider>
                        <ListItemText
                          primary={`${c.certificate_name} (${c.evidence_type || "N/A"})`}
                          secondary={`Valid: ${c.valid_from} → ${c.valid_to}`}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            setSelectedCert(c);
                            setConfirmOpen(true);
                          }}
                        >
                          Delete
                        </Button>

                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Paper>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Certificate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{selectedCert?.certificate_name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (selectedCert) {
                await handleDeleteCertificate(selectedCert.certificate_name);
              }
              setConfirmOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default OrganizationProfile;