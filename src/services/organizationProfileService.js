// services/organizationProfileService.js
import axios from "axios";
import API from './api';


/** =======================
 * Axios instance
 * ======================= */

/** =======================
 * Backend API wrappers
 * ======================= */

// Create/Update Organization Profile
export async function saveProfile({
  docname,
  organizationName,
  website,
  phone,
  street,
  houseNumber,
  postalCode,
  city,
  country,
  operatorType,
  customer,
  supplier,
}) {
  const payload = {
    ...(docname ? { name: docname } : {}),
    name1: organizationName,
    website,
    phone,
    street,
    house_number: houseNumber,
    postal_code: postalCode,
    city,
    country,
    type_of_market_operator: operatorType,
    customer,
    supplier,
  };

  const { data } = await API.post(
    "/method/farmportal.api.organization_profile.save_profile",
    payload
  );
  return data.message; // { name }
}

// Upload file -> returns file_url
export async function uploadFile(file, isPrivate = 1) {
  if (!file) return null;
  const form = new FormData();
  form.append("file", file);
  form.append("is_private", String(isPrivate));

  const { data } = await API.post("/method/upload_file", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.message?.file_url || null;
}

// Append certificate child row
export async function addCertificate({
  profileName,
  certificateName,
  evidenceType,
  validFrom,
  validTo,
  fileUrl,
}) {
  const payload = {
    profile_name: profileName,
    certificate_name: certificateName || "",
    evidence_type: evidenceType || "",
    valid_from: validFrom || "",
    valid_to: validTo || "",
    file_url: fileUrl || null,
  };

  const { data } = await API.post(
    "/method/farmportal.api.organization_profile.add_certificate",
    payload
  );
  return data.message; // { row_name, file_url }
}

// (Optional) Fetch a profile with children to pre-fill form
export async function getProfile(name) {
  const { data } = await API.get(
    `/resource/Organization Profile/${encodeURIComponent(
      name
    )}?fields=["*"]&children=1`
  );
  return data?.data;
}
