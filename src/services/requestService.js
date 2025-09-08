// import API from './api';

// export const requestService = {
//   // For customers
//   createRequest: (data) => API.post('/requests/create', data),
//   getCustomerRequests: () => API.get('/method/farmportal.api.me.get_customer_requests'),
//   getSupplierRequests: () => API.get('/method/farmportal.api.me.get_supplier_requests'),
//   respondToRequest: (requestId, data) => API.post(`/requests/${requestId}/respond`, data),
  
//   // Shared
//   getRequestDetails: (requestId) => API.get(`/requests/${requestId}`),
// };

// services/requestService.js
// services/requestService.js
import API from './api';

const unwrap = (d) => d?.message ?? d ?? null;
const ensureArray = (v) => (Array.isArray(v) ? v : []);

// ✅ Add this constant
const DEFAULT_STATS = {
  totalRequests: 0,
  pendingRequests: 0,
  completedRequests: 0,
  landPlots: 0,
  products: 0,
  complianceRate: 0,
};

export const requestService = {
  getCustomerRequests: async () => {
    const { data } = await API.get('/method/farmportal.api.requests.get_customer_requests');
    const un = unwrap(data) || {};
    return { requests: ensureArray(un.requests) };
  },

  getSupplierRequests: async () => {
    const { data } = await API.get('/method/farmportal.api.requests.get_supplier_requests');
    const un = unwrap(data) || {};
    return { requests: ensureArray(un.requests) };
  },

  // ✅ Make sure the backend function exists & server restarted
  getDashboardStats: async () => {
    const { data } = await API.get('/method/farmportal.api.requests.get_dashboard_stats');
    const un = unwrap(data) || {};
    return {
      stats: { ...DEFAULT_STATS, ...(un.stats || {}) },
      recent: ensureArray(un.recent),
      role: un.role ?? null,
    };
  },

  createRequest: async ({ supplierId, requestType, message, requestedProducts, customerId }) => {
    const { data } = await API.post('/method/farmportal.api.requests.create_request', {
      supplier_id: supplierId,
      request_type: requestType,
      message,
      requested_products: requestedProducts,
      customer_id: customerId, // optional override supported by your backend
    });
    return unwrap(data);
  },

  respondToRequest: async (requestId, payload) => {
    const { action, status, message, sharedPlots } = payload || {};
    const { data } = await API.post('/method/farmportal.api.requests.respond_to_request', {
      request_id: requestId,
      action,
      status,
      message,
      shared_plots: sharedPlots,
    });
    return unwrap(data);
  },
  uploadRequestAttachment: async (requestId, file, opts = {}) => {
  const { isPrivate = 1, folder = 'Home' } = opts;
  const form = new FormData();
  form.append('file', file);
  form.append('is_private', isPrivate ? 1 : 0);
  form.append('doctype', 'Request');
  form.append('docname', requestId);
  form.append('folder', folder);

  // NOTE: API baseURL should already be '/api'
  const { data } = await API.post('/method/upload_file', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // Frappe returns { message: { file_url, name, ... } }
  return data?.message || data;
},
};
