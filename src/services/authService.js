// // services/authService.js
// import API from './api';
// import qs from 'qs';

// const isFrappe = (import.meta.env.VITE_BACKEND || 'frappe') === 'frappe';

// export const authService = isFrappe
//   ? {
//       // Frappe session auth
//       login: ({ email, password }) =>
//         API.post(
//           '/api/method/login',
//           qs.stringify({ usr: email, pwd: password }),
//           { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//         ),

//       getProfile: () => API.get('/api/method/farmportal.api.me'),
//       updateProfile: (data) => API.post('/api/method/frappe.client.set_value', data), // customize as needed
//       logout: () => API.post('/api/method/logout'),

//       // Frappe typically handles registration via invite/web form.
//       register: async () => {
//         return Promise.reject({ response: { data: { error: 'Registration not supported from UI' } } });
//       },
//     }
//   : {
//       // === Old JWT API (kept for compatibility) ===
//       login: (credentials) => API.post('/auth/login', credentials),
//       register: (userData) => API.post('/auth/register', userData),
//       getProfile: () => API.get('/auth/profile'),
//       updateProfile: (data) => API.put('/auth/profile', data),
//       logout: () => Promise.resolve(),
//     };
// services/authService.js
// import API from './api';
// import qs from 'qs';

// const unwrap = (data) => (data?.message ?? data ?? null);

// export const authService = {
//   // Login → then ask “who am I?” → then get app profile
//   login: async ({ email, password }) => {
//     await API.post(
//       '/method/login',
//       qs.stringify({ usr: email, pwd: password }),
//       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//     );

//     const whoRes = await API.get('/method/frappe.auth.get_logged_user');
//     const userId = unwrap(whoRes.data); // usually the user email/id

//     const profileRes = await API.get('/method/farmportal.api.update_profile.get_profile');
//     const profile = unwrap(profileRes.data) || {};

//     return { success: !!userId, user: userId, profile };
//   },

//   logout: () => API.post('/method/logout'),

//   getProfile: async () => {
//     const { data } = await API.get('/method/farmportal.api.update_profile.get_profile');
//     return unwrap(data) || {};
//   },

//   updateProfile: async (formData) => {
//     const { data } = await API.post(
//       '/method/farmportal.api.update_profile.update_profile',
//       formData
//     );
//     return unwrap(data);
//   },
// };

// services/authService.js
// import API from './api';
// import qs from 'qs';

// const unwrap = (data) => (data?.message ?? data ?? null);

// export const authService = {
//   login: async ({ email, password }) => {
//     await API.post(
//       '/method/login',
//       qs.stringify({ usr: email, pwd: password }),
//       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
//     );

//     const whoRes = await API.get('/method/frappe.auth.get_logged_user');
//     const userId = unwrap(whoRes.data);

//     const profileRes = await API.get('/method/farmportal.api.update_profile.get_profile');
//     const profile = unwrap(profileRes.data) || {};

//     return { success: !!userId, user: userId, profile };
//   },

//   logout: () => API.post('/method/logout'),

//   // who am I?
//   getLoggedUser: async () => {
//     const { data } = await API.get('/method/frappe.auth.get_logged_user');
//     return unwrap(data);
//   },

//   // your app's Update Profile doc
//   getAppProfile: async () => {
//     const { data } = await API.get('/method/farmportal.api.update_profile.get_profile');
//     return unwrap(data) || {};
//   },

//   updateProfile: async (formData) => {
//     const { data } = await API.post(
//       '/method/farmportal.api.update_profile.update_profile',
//       formData
//     );
//     return unwrap(data);
//   },
// };

// services/authService.js
import API from './api';
import qs from 'qs';

const unwrap = (data) => (data?.message ?? data ?? null);

export const authService = {
  login: async ({ email, password }) => {
    await API.post(
      '/method/login',
      qs.stringify({ usr: email, pwd: password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    // After login, load the rich me payload
    const me = await authService.getMe();
    return { success: !!me?.user?.name, user: me };
  },

  logout: () => API.post('/method/logout'),

  getMe: async () => {
    const { data } = await API.get('/method/farmportal.api.me.me');
    return unwrap(data); // { user, display_name, account_type, profile, ... }
  },

  // Still available if your Profile page calls them directly
  getAppProfile: async () => {
    const { data } = await API.get('/method/farmportal.api.update_profile.get_profile');
    return unwrap(data) || {};
  },

  updateProfile: async (formData) => {
    const { data } = await API.post(
      '/method/farmportal.api.update_profile.update_profile',
      formData
    );
    return unwrap(data);
  },
};
