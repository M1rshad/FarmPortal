// services/api.js
// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'https://faircodelab.frappe.cloud/api',          // via Vite proxy to http://localhost:8000
//   withCredentials: true,
//   timeout: 75000,
// });

// // 1) Always attach CSRF token from cookie on requests
// API.interceptors.request.use((config) => {
//   // Only needed for non-GETs, but safe to attach always
//   const m = document.cookie.match(/csrf_token=([^;]+)/);
//   if (m) config.headers['X-Frappe-CSRF-Token'] = decodeURIComponent(m[1]);
//   return config;
// });

// // 2) Also learn CSRF from response headers (nice-to-have)
// API.interceptors.response.use(
//   (resp) => {
//     const csrf = resp.headers?.['x-frappe-csrf-token'];
//     if (csrf) API.defaults.headers.common['X-Frappe-CSRF-Token'] = csrf;
//     return resp;
//   },
//   (err) => {
//     console.error('[API error]', err?.response ?? err);
//     return Promise.reject(err);
//   }
// );

// export default API;
// import axios from 'axios';

// const API = axios.create({
//   // Prefer env var (VITE_API_URL), fallback to local dev URL
//   baseURL: import.meta.env.VITE_API_URL
//     ? `${import.meta.env.VITE_API_URL}/api`
//     : '/api',  // still works via Vite proxy in local dev
//   withCredentials: true,
//   timeout: 75000,
// });

// // 1) Attach CSRF token from cookies (for Frappe)
// API.interceptors.request.use((config) => {
//   const m = document.cookie.match(/csrf_token=([^;]+)/);
//   if (m) config.headers['X-Frappe-CSRF-Token'] = decodeURIComponent(m[1]);
//   return config;
// });

// // 2) Learn CSRF from response headers
// API.interceptors.response.use(
//   (resp) => {
//     const csrf = resp.headers?.['x-frappe-csrf-token'];
//     if (csrf) API.defaults.headers.common['X-Frappe-CSRF-Token'] = csrf;
//     return resp;
//   },
//   (err) => {
//     console.error('[API error]', err?.response ?? err);
//     return Promise.reject(err);
//   }
// );

// export default API;


// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'https://faircodelab.frappe.cloud/api',
//   withCredentials: true,
//   timeout: 75000,
// });

// // ✅ Request interceptor: attach CSRF token for POST/PUT/DELETE/PATCH
// API.interceptors.request.use((config) => {
//   // For mutating requests, attach CSRF token
//   if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
//     const m = document.cookie.match(/csrf_token=([^;]+)/);
//     if (m) {
//       const token = decodeURIComponent(m[1]);
//       config.headers['X-Frappe-CSRF-Token'] = token;
//       console.log(`[API] CSRF token attached for ${config.method.toUpperCase()}`);
//     } else {
//       console.warn(`[API] No CSRF token found for ${config.method.toUpperCase()}`);
//     }
//   }
//   return config;
// });

// // ✅ Response interceptor: learn CSRF from headers and handle errors
// API.interceptors.response.use(
//   (resp) => {
//     // Learn CSRF token from response headers (especially after login)
//     const csrf = resp.headers?.['x-frappe-csrf-token'];
//     if (csrf) {
//       API.defaults.headers.common['X-Frappe-CSRF-Token'] = csrf;
//       console.log('[API] Learned CSRF token from response header');
//     }
//     return resp;
//   },
//   (err) => {
//     // Better error logging
//     const errorMsg = err.response?.data?.message 
//       || err.response?.data?.exc 
//       || err.message 
//       || 'Unknown error';
//     console.error(`[API error] Status: ${err.response?.status}, Message: ${errorMsg}`);
//     return Promise.reject(err);
//   }
// );

// export default API;
// import axios from 'axios';

// const API = axios.create({
//   baseURL: 'https://faircodelab.frappe.cloud/api',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // CRITICAL: This must be true
// });

// // Add response interceptor to handle cookies
// API.interceptors.response.use(
//   (response) => {
//     // Log cookies after each response for debugging
//     console.log('[API] Response cookies:', document.cookie);
//     return response;
//   },
//   (error) => {
//     console.error('[API] Request failed:', error);
//     return Promise.reject(error);
//   }
// );

// // Add request interceptor
// API.interceptors.request.use(
//   (config) => {
//     // Get CSRF token from cookies
//     const csrfToken = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('csrf_token='))
//       ?.split('=')[1];
    
//     if (csrfToken) {
//       config.headers['X-Frappe-CSRF-Token'] = csrfToken;
//       console.log('[API] Added CSRF token:', csrfToken);
//     } else {
//       console.log('[API] No CSRF token found for', config.method.toUpperCase());
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default API;

import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  baseURL: 'https://faircodelab.frappe.cloud/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false, // No cookies needed with API key auth
});

// Add API Key authentication to each request
API.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('api_key');
    const apiSecret = localStorage.getItem('api_secret');
    
    if (apiKey && apiSecret) {
      // Frappe expects "token api_key:api_secret" format
      const token = `${apiKey}:${apiSecret}`;
      config.headers['Authorization'] = `token ${token}`;
      console.log('[API] Using API key authentication');
    } else {
      console.log('[API] No API credentials found');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log('[API] Response success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('[API] Request failed:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    // If unauthorized, clear stored credentials
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('api_key');
      localStorage.removeItem('api_secret');
    }
    
    return Promise.reject(error);
  }
);

export default API;