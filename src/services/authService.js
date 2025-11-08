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
//     // After login, load the rich me payload
//     const me = await authService.getMe();
//     return { success: !!me?.user?.name, user: me };
//   },

//   logout: () => API.post('/method/logout'),

//   getMe: async () => {
//     const { data } = await API.get('/method/farmportal.api.me.me');
//     return unwrap(data); // { user, display_name, account_type, profile, ... }
//   },

//   // Still available if your Profile page calls them directly
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
import API from './api';

const unwrap = (data) => (data?.message ?? data ?? null);

export const authService = {
  login: async ({ email, password }) => {
    try {
      console.log('[authService.login] Starting login process');
      console.log('[authService.login] Credentials:', { usr: email, pwd: '***' });
      
      // Send login request as JSON (not form-encoded)
      const loginResponse = await API.post('/method/login', {
        usr: email,
        pwd: password
      });
      
      console.log('[authService.login] Login successful:', loginResponse.data);
      
      // Check if CSRF token was set
      const csrfInCookie = document.cookie.includes('csrf_token');
      console.log('[authService.login] CSRF token in cookies:', csrfInCookie);
      console.log('[authService.login] Cookies:', document.cookie);
      
      // Small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // After login, load the user info
      console.log('[authService.login] Fetching user info...');
      const me = await authService.getMe();
      
      console.log('[authService.login] User info loaded:', me);
      
      return { 
        success: !!me?.user?.name, 
        user: me 
      };
      
    } catch (error) {
      console.error('[authService.login] Login failed:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.exc || error.message
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('[authService.logout] Logging out...');
      const response = await API.post('/method/logout');
      console.log('[authService.logout] Logout successful');
      return response;
    } catch (error) {
      console.error('[authService.logout] Logout failed:', error.message);
      throw error;
    }
  },

  // getMe: async () => {
  //   try {
  //     console.log('[authService.getMe] Fetching current user info');
  //     // const { data } = await API.get('/method/farmportal.api.me.me');
  //     const { data } = await API.get('/method/farmportal.custom_api.get_current_user');
  //     const result = unwrap(data);
  //     console.log('[authService.getMe] Success:', result);
  //     return result;
  //   } catch (error) {
  //     console.error('[authService.getMe] Failed:', {
  //       status: error.response?.status,
  //       message: error.response?.data?.message,
  //       error: error.response?.data?.exc || error.message
  //     });
  //     throw error;
  //   }
  // },
  getMe: async () => {
  try {
    console.log('[authService.getMe] Fetching current user info');
    console.log('[authService.getMe] Current cookies:', document.cookie);
    
    // Use frappe.client.get_value which is definitely whitelisted
    const { data } = await API.post('/method/frappe.client.get_value', {
      doctype: 'User',
      name: 'frappe.session.user',
      fieldname: ['name', 'full_name', 'email']
    });
    
    const result = unwrap(data);
    console.log('[authService.getMe] Success:', result);
    
    return {
      user: result
    };
  } catch (error) {
    console.error('[authService.getMe] Failed:', error);
    throw error;
  }
},

  getAppProfile: async () => {
    try {
      console.log('[authService.getAppProfile] Fetching user profile');
      const { data } = await API.get('/method/farmportal.api.update_profile.get_profile');
      const result = unwrap(data) || {};
      console.log('[authService.getAppProfile] Success:', result);
      return result;
    } catch (error) {
      console.error('[authService.getAppProfile] Failed:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.exc || error.message
      });
      throw error;
    }
  },

  updateProfile: async (formData) => {
    try {
      console.log('[authService.updateProfile] Updating profile');
      const { data } = await API.post(
        '/method/farmportal.api.update_profile.update_profile',
        formData
      );
      const result = unwrap(data);
      console.log('[authService.updateProfile] Success:', result);
      return result;
    } catch (error) {
      console.error('[authService.updateProfile] Failed:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.exc || error.message
      });
      throw error;
    }
  },
};
