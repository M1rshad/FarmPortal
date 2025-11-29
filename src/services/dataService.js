// import API from './api';

// export const dataService = {
//   // Supplier data sync
//   syncLandPlots: () => API.post('/data/sync/land-plots'),
//   syncProducts: () => API.post('/data/sync/products'),
  
//   // Get suppliers list
//   getSuppliers: () => API.get('/data/suppliers'),
// };

// services/dataService.js
import API from './api';
import axios from 'axios';

const unwrap = (d) => d?.message ?? d ?? null;

const erp = axios.create({
  baseURL: import.meta.env.VITE_ERP_BASE_URL, // e.g. "https://erp.example.com"
  timeout: 30000,
});

export const dataService = {
  getSuppliers: async (params = {}) => {
    const { search, limit } = params;
    const { data } = await API.get('/method/farmportal.api.supplier.get_suppliers', {
      params: { search, limit }
    });
    return unwrap(data) || { suppliers: [] };
  },

  addSupplier: async (data) => {
    // data = { name, email, country }
    const response = await API.post('/method/farmportal.api.supplier.create_supplier_with_user', {
      name: data.name,
      email: data.email,
      country: data.country
    });
    return response.data;
  },  
  toggleSupplierAccess: async (supplierId, enable) => {
    // Using 'supplier_name' param to match backend arg, but passing ID value
    const response = await API.post('/method/farmportal.api.supplier.toggle_supplier_access', {
      supplier_name: supplierId, 
      enable: enable
    });
    return response.data;
  },

  // Use API (already points to /api) and UNWRAP the result
  async syncProducts({ search, start = 0, pageLen = 200 } = {}) {
    const { data } = await API.get('/method/farmportal.api.products.get_products', {
      params: {
        search: search || undefined,
        limit_start: start,
        limit_page_length: pageLen,
      },
      // withCredentials: true, // enable if using session auth & same-site cookies
    });
    // Frappe method returns { message: { message, data, meta } }
    return unwrap(data); // => { message, data, meta }
  },
};



// src/services/dataService.js



// If you use token auth (recommended for SPA):
// erp.interceptors.request.use((config) => {
//   config.headers.Authorization = `token ${import.meta.env.VITE_ERP_KEY}:${import.meta.env.VITE_ERP_SECRET}`;
//   return config;
// });

// export const dataService = {
//   async syncProducts({ search, start = 0, pageLen = 200 } = {}) {
//     const { data } = await erp.get('/api/method/my_app.api.products.get_products', {
//       params: {
//         search: search || undefined,
//         limit_start: start,
//         limit_page_length: pageLen,
//       },
//       // If using logged-in session cookies on same domain, you may also need:
//       // withCredentials: true,
//     });
//     return { data };
//   },
// };
