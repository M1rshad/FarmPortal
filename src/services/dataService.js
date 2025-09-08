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
    const { data } = await API.get('/method/farmportal.api.data.get_suppliers', {
      params: { search, limit }
    });
    return unwrap(data) || { suppliers: [] };
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
