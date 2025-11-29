// / import axios from 'axios';

// const API = axios.create({
//   // baseURL: 'http://127.0.0.1:8000/api',
//   // baseURL: 'https://faircodelab.frappe.cloud/api',
//   baseURL: import.meta.env.VITE_API_URL
//     ? `${import.meta.env.VITE_API_URL}/api`
//     : '/api',  // still works via Vite proxy in local dev
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
//   withCredentials: false, // No cookies needed with API key auth
// });

// // Add API Key authentication to each request
// API.interceptors.request.use(
//   (config) => {
//     const apiKey = localStorage.getItem('api_key');
//     const apiSecret = localStorage.getItem('api_secret');
    
//     if (apiKey && apiSecret) {
//       // Frappe expects "token api_key:api_secret" format
//       const token = `${apiKey}:${apiSecret}`;
//       config.headers['Authorization'] = `token ${token}`;
//       console.log('[API] Using API key authentication');
//     } else {
//       console.log('[API] No API credentials found');
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// API.interceptors.response.use(
//   (response) => {
//     console.log('[API] Response success:', response.config.url);
//     return response;
//   },
//   (error) => {
//     console.error('[API] Request failed:', {
//       url: error.config?.url,
//       status: error.response?.status,
//       message: error.response?.data?.message || error.message
//     });
    
//     // Only clear credentials on 401 (invalid/expired token)
//     // Don't clear on 403 (permissions issue) - token may still be valid
//     if (error.response?.status === 401) {
//       localStorage.removeItem('api_key');
//       localStorage.removeItem('api_secret');
//       console.log('[API] Credentials cleared due to 401');
//     }
    
//     return Promise.reject(error);
//   }
// );


// export default API;
import axios from 'axios';
import { getTenantConfig } from './tenantService'; // Import the helper

// Your existing variable name is API, so we will use that
const API = axios.create({
  // REMOVED: No static baseURL here
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Update your request interceptor
API.interceptors.request.use(
  (config) => {
    // 1. Set dynamic BaseURL
    const tenant = getTenantConfig();
    if (tenant && tenant.backendUrl) {
      config.baseURL = `${tenant.backendUrl}/api`;
    } else {
      // Allow requests to the Master Router to pass through if needed,
      // but most app-specific API calls will fail without a tenant, which is correct.
      console.warn('[API] Tenant not yet resolved. Request may fail.');
    }
    
    // 2. Keep your existing Token Auth logic
    const apiKey = localStorage.getItem('api_key');
    const apiSecret = localStorage.getItem('api_secret');
    
    if (apiKey && apiSecret) {
      const token = `${apiKey}:${apiSecret}`;
      config.headers['Authorization'] = `token ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Your existing response interceptor remains the same - it's already perfect.
API.interceptors.response.use(
  (response) => {
    console.log('[API] Response success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('[API] Request failed:', { /* ... */ });
    if (error.response?.status === 401) {
      localStorage.removeItem('api_key');
      localStorage.removeItem('api_secret');
      // Also clear tenant config so user must re-enter company code
      localStorage.removeItem('tenant_config');
    }
    return Promise.reject(error);
  }
);

export default API;
