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


import axios from 'axios';

const API = axios.create({
  baseURL: 'https://faircodelab.frappe.cloud/api',
  withCredentials: true,
  timeout: 75000,
});

// ✅ Request interceptor: attach CSRF token for POST/PUT/DELETE/PATCH
API.interceptors.request.use((config) => {
  // For mutating requests, attach CSRF token
  if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
    const m = document.cookie.match(/csrf_token=([^;]+)/);
    if (m) {
      const token = decodeURIComponent(m[1]);
      config.headers['X-Frappe-CSRF-Token'] = token;
      console.log(`[API] CSRF token attached for ${config.method.toUpperCase()}`);
    } else {
      console.warn(`[API] No CSRF token found for ${config.method.toUpperCase()}`);
    }
  }
  return config;
});

// ✅ Response interceptor: learn CSRF from headers and handle errors
API.interceptors.response.use(
  (resp) => {
    // Learn CSRF token from response headers (especially after login)
    const csrf = resp.headers?.['x-frappe-csrf-token'];
    if (csrf) {
      API.defaults.headers.common['X-Frappe-CSRF-Token'] = csrf;
      console.log('[API] Learned CSRF token from response header');
    }
    return resp;
  },
  (err) => {
    // Better error logging
    const errorMsg = err.response?.data?.message 
      || err.response?.data?.exc 
      || err.message 
      || 'Unknown error';
    console.error(`[API error] Status: ${err.response?.status}, Message: ${errorMsg}`);
    return Promise.reject(err);
  }
);

export default API;
