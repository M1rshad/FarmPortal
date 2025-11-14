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

  // createRequest: async ({ supplierId, requestType, message, requestedProducts, customerId }) => {
  //   const { data } = await API.post('/method/farmportal.api.requests.create_request', {
  //     supplier_id: supplierId,
  //     request_type: requestType,
  //     message,
  //     requested_products: requestedProducts,
  //     customer_id: customerId, // optional override supported by your backend
  //   });
  //   return unwrap(data);
  // },
  // createRequest: async ({ supplierId, requestType, message, purchaseOrderNumber, requestedProducts, customerId }) => {
  //   console.log('🚀 Creating request with data:', {
  //     supplier_id: supplierId,
  //     request_type: requestType,
  //     message,
  //     purchase_order_number: purchaseOrderNumber, // Make sure this matches backend parameter
  //     requested_products: requestedProducts,
  //     customer_id: customerId
  //   });
  //   const { data } = await API.post('/method/farmportal.api.requests.create_request', {
  //     supplier_id: supplierId,
  //     request_type: requestType,
  //     message,
  //     purchase_order_number: purchaseOrderNumber, // ✅ This should match backend parameter
  //     requested_products: requestedProducts,
  //     customer_id: customerId
  //   });
  //   return unwrap(data);
  // },
  createRequest: async ({ supplierId, requestType, message, purchaseOrderNumber, requestedProducts, customerId }) => {
  console.log('🚀 Creating request with data:', {
    supplier_id: supplierId,
    request_type: requestType,
    message,
    purchase_order_number: purchaseOrderNumber, // ✅ Ensure correct field name
    requested_products: requestedProducts,
    customer_id: customerId
  });

  const { data } = await API.post('/method/farmportal.api.requests.create_request', {
    supplier_id: supplierId,
    request_type: requestType,
    message,
    purchase_order_number: purchaseOrderNumber, // ✅ This should match backend parameter
    requested_products: requestedProducts,
    customer_id: customerId
  });
  return unwrap(data);
},
  getPurchaseOrderResponse: async (requestId) => {
    const { data } = await API.get('/method/farmportal.api.requests.get_purchase_order_response', {
      params: { request_id: requestId }
    });
    return unwrap(data) || {};
  },
   // Customer-safe endpoint to view purchase order plots
  getCustomerPurchaseOrderPlots: async (requestId) => {
    const { data } = await API.get('/method/farmportal.api.requests.get_customer_purchase_order_plots', {
      params: { request_id: requestId }
    });
    return unwrap(data) || { plots: [], message: '' };
  },
  // respondToRequest: async (requestId, payload) => {
  //   const { action, status, message, sharedPlots } = payload || {};
  //   const { data } = await API.post('/method/farmportal.api.requests.respond_to_request', {
  //     request_id: requestId,
  //     action,
  //     status,
  //     message,
  //     shared_plots: sharedPlots,
  //   });
  //   return unwrap(data);
  // },
  // FIXED VERSION:
respondToRequest: async (requestId, payload) => {
  const { action, status, message, shared_plots } = payload || {}; // ✅ Use shared_plots, not sharedPlots
  
  // Debug what we're sending
  console.log('🚀 Service: Sending payload:', payload);
  console.log('🚀 Service: Extracted shared_plots:', shared_plots);
  
  const requestData = {
    request_id: requestId,
    action,
    status,
    message,
    shared_plots // ✅ Now this will be sent correctly
  };
  
  console.log('🚀 Service: Final request data:', requestData);
  
  const { data } = await API.post('/method/farmportal.api.requests.respond_to_request', requestData);
  return unwrap(data);
},

  // Get land plots for supplier to share
  getSupplierLandPlots: async () => {
    const { data } = await API.get('/method/farmportal.api.requests.get_supplier_land_plots');
    return unwrap(data) || { plots: [] };
  },

  // Get shared plots for a specific request
  // getSharedPlots: async (requestId) => {
  //   const { data } = await API.get('/method/farmportal.api.requests.get_shared_plots', {
  //     params: { request_id: requestId }
  //   });
  //   console.log(data)
  //   return unwrap(data) || { plots: [], request: null };
  // },
  getSharedPlots: async (requestId) => {
    const { data } = await API.get('/method/farmportal.api.requests.get_shared_plots', {
      params: { request_id: requestId }
    });
    
    // ✅ FIX: Frappe wraps response in 'message' object
    const unwrappedData = unwrap(data);
    
    console.log('🔍 Raw API data:', data);
    console.log('🔍 Unwrapped data:', unwrappedData);
    
    // ✅ Handle both response formats
    if (unwrappedData) {
      return {
        plots: unwrappedData.plots || [],
        request: unwrappedData.request || null
      };
    }
    
    // Fallback
    return { plots: [], request: null };
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
},// Get purchase order details for supplier response
  getPurchaseOrderDetails: async (requestId) => {
    const { data } = await API.get('/method/farmportal.api.requests.get_purchase_order_details', {
      params: { request_id: requestId }
    });
    return unwrap(data) || {};
  },

  // Submit purchase order data
  submitPurchaseOrderData: async (requestId, poData) => {
    const { data } = await API.post('/method/farmportal.api.requests.submit_purchase_order_data', {
      request_id: requestId,
      po_data: JSON.stringify(poData)
    });
    return unwrap(data) || {};
  }
};
