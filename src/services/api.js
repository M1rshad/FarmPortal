// // services/api.js
// import axios from 'axios';

// const isFrappe = (import.meta.env.VITE_BACKEND || 'frappe') === 'frappe';

// const API = axios.create({
//   baseURL: isFrappe
//     ? (import.meta.env.VITE_FRAPPE_URL || 'http://localhost:8000')   // Frappe
//     : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'), // Old JWT API
//   withCredentials: isFrappe, // cookies only needed for Frappe
// });

// // ----- Request interceptor
// API.interceptors.request.use(
//   (config) => {
//     if (!isFrappe) {
//       // Old JWT mode (kept for backward-compat)
//       const token = localStorage.getItem('token');
//       if (token) config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ----- Response interceptor
// API.interceptors.response.use(
//   (response) => {
//     // If this is Frappe, cache CSRF token for future writes
//     if (isFrappe) {
//       const csrf = response.headers?.['x-frappe-csrf-token'];
//       if (csrf) API.defaults.headers.common['X-Frappe-CSRF-Token'] = csrf;
//     }
//     return response;
//   },
//   (error) => {
//     // JWT mode: keep your 401 logic
//     if (!isFrappe && error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;
// services/api.js
// services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',          // via Vite proxy to http://localhost:8000
  withCredentials: true,
  timeout: 75000,
});

// 1) Always attach CSRF token from cookie on requests
API.interceptors.request.use((config) => {
  // Only needed for non-GETs, but safe to attach always
  const m = document.cookie.match(/csrf_token=([^;]+)/);
  if (m) config.headers['X-Frappe-CSRF-Token'] = decodeURIComponent(m[1]);
  return config;
});

// 2) Also learn CSRF from response headers (nice-to-have)
API.interceptors.response.use(
  (resp) => {
    const csrf = resp.headers?.['x-frappe-csrf-token'];
    if (csrf) API.defaults.headers.common['X-Frappe-CSRF-Token'] = csrf;
    return resp;
  },
  (err) => {
    console.error('[API error]', err?.response ?? err);
    return Promise.reject(err);
  }
);

export default API;
