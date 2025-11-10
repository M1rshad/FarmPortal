// import API from './api';

// const unwrap = (data) => (data?.message ?? data ?? null);

// export const authService = {
//   login: async ({ email, password }) => {
//     try {
//       console.log('[authService.login] Starting login process');
//       console.log('[authService.login] Credentials:', { usr: email, pwd: '***' });
      
//       // Send login request as JSON (not form-encoded)
//       const loginResponse = await API.post('/method/login', {
//         usr: email,
//         pwd: password
//       });
      
//       console.log('[authService.login] Login successful:', loginResponse.data);
      
//       // Check if CSRF token was set
//       const csrfInCookie = document.cookie.includes('csrf_token');
//       console.log('[authService.login] CSRF token in cookies:', csrfInCookie);
//       console.log('[authService.login] Cookies:', document.cookie);
      
//       // Small delay to ensure session is fully established
//       await new Promise(resolve => setTimeout(resolve, 200));
      
//       // After login, load the user info
//       console.log('[authService.login] Fetching user info...');
//       const me = await authService.getMe();
      
//       console.log('[authService.login] User info loaded:', me);
      
//       return { 
//         success: !!me?.user?.name, 
//         user: me 
//       };
      
//     } catch (error) {
//       console.error('[authService.login] Login failed:', {
//         status: error.response?.status,
//         message: error.response?.data?.message,
//         error: error.response?.data?.exc || error.message
//       });
//       throw error;
//     }
//   },

//   logout: async () => {
//     try {
//       console.log('[authService.logout] Logging out...');
//       const response = await API.post('/method/logout');
//       console.log('[authService.logout] Logout successful');
//       return response;
//     } catch (error) {
//       console.error('[authService.logout] Logout failed:', error.message);
//       throw error;
//     }
//   },

//   // getMe: async () => {
//   //   try {
//   //     console.log('[authService.getMe] Fetching current user info');
//   //     // const { data } = await API.get('/method/farmportal.api.me.me');
//   //     const { data } = await API.get('/method/farmportal.custom_api.get_current_user');
//   //     const result = unwrap(data);
//   //     console.log('[authService.getMe] Success:', result);
//   //     return result;
//   //   } catch (error) {
//   //     console.error('[authService.getMe] Failed:', {
//   //       status: error.response?.status,
//   //       message: error.response?.data?.message,
//   //       error: error.response?.data?.exc || error.message
//   //     });
//   //     throw error;
//   //   }
//   // },
//   getMe: async () => {
//   try {
//     console.log('[authService.getMe] Fetching current user info');
//     console.log('[authService.getMe] Current cookies:', document.cookie);
    
//     // Use frappe.client.get_value which is definitely whitelisted
//     const { data } = await API.post('/method/frappe.client.get_value', {
//       doctype: 'User',
//       name: 'frappe.session.user',
//       fieldname: ['name', 'full_name', 'email']
//     });
    
//     const result = unwrap(data);
//     console.log('[authService.getMe] Success:', result);
    
//     return {
//       user: result
//     };
//   } catch (error) {
//     console.error('[authService.getMe] Failed:', error);
//     throw error;
//   }
// },

//   getAppProfile: async () => {
//     try {
//       console.log('[authService.getAppProfile] Fetching user profile');
//       const { data } = await API.get('/method/farmportal.api.update_profile.get_profile');
//       const result = unwrap(data) || {};
//       console.log('[authService.getAppProfile] Success:', result);
//       return result;
//     } catch (error) {
//       console.error('[authService.getAppProfile] Failed:', {
//         status: error.response?.status,
//         message: error.response?.data?.message,
//         error: error.response?.data?.exc || error.message
//       });
//       throw error;
//     }
//   },

//   updateProfile: async (formData) => {
//     try {
//       console.log('[authService.updateProfile] Updating profile');
//       const { data } = await API.post(
//         '/method/farmportal.api.update_profile.update_profile',
//         formData
//       );
//       const result = unwrap(data);
//       console.log('[authService.updateProfile] Success:', result);
//       return result;
//     } catch (error) {
//       console.error('[authService.updateProfile] Failed:', {
//         status: error.response?.status,
//         message: error.response?.data?.message,
//         error: error.response?.data?.exc || error.message
//       });
//       throw error;
//     }
//   },
// };

import API from './api';

const unwrap = (data) => (data?.message ?? data ?? null);

export const authService = {
  login: async ({ email, password }) => {
    try {
      console.log('[authService.login] Starting login process');
      console.log('[authService.login] Email:', email);
      
      // Login and get auto-generated API keys
      const { data } = await API.post('/method/farmportal.auth_helper.login_and_get_api_keys', {
        usr: email,
        pwd: password
      });
      
      const result = unwrap(data);
      console.log('[authService.login] Login response:', { success: result.success, user: result.user });
      
      if (!result.success || !result.api_key || !result.api_secret) {
        throw new Error('Failed to get API credentials');
      }
      
      // Store the API keys in localStorage
      localStorage.setItem('api_key', result.api_key);
      localStorage.setItem('api_secret', result.api_secret);
      localStorage.setItem('user_email', email);
      
      console.log('[authService.login] API credentials stored');
      
      // Fetch complete user info using the API keys
      const me = await authService.getMe();
      
      console.log('[authService.login] User info loaded:', me);
      
      return { 
        success: true, 
        user: me 
      };
      
    } catch (error) {
      // Clear any stored credentials on error
      localStorage.removeItem('api_key');
      localStorage.removeItem('api_secret');
      localStorage.removeItem('user_email');
      
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
      
      // Clear all stored credentials
      localStorage.removeItem('api_key');
      localStorage.removeItem('api_secret');
      localStorage.removeItem('user_email');
      
      console.log('[authService.logout] Logout successful');
      return { success: true };
    } catch (error) {
      console.error('[authService.logout] Logout failed:', error.message);
      throw error;
    }
  },

  getMe: async () => {
    try {
      console.log('[authService.getMe] Fetching current user info');
      
      const { data } = await API.get('/method/farmportal.custom_api.get_current_user');
      const result = unwrap(data);
      
      console.log('[authService.getMe] Success:', result);
      return result;
    } catch (error) {
      console.error('[authService.getMe] Failed:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.response?.data?.exc || error.message
      });
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
  
  // Helper to check if user is authenticated
  isAuthenticated: () => {
    const hasKeys = !!(localStorage.getItem('api_key') && localStorage.getItem('api_secret'));
    console.log('[authService.isAuthenticated]', hasKeys);
    return hasKeys;
  },
  
  // Optional: Allow users to regenerate their keys
  regenerateKeys: async () => {
    try {
      console.log('[authService.regenerateKeys] Regenerating API keys');
      
      const { data } = await API.post('/method/farmportal.auth_helper.regenerate_api_keys');
      const result = unwrap(data);
      
      if (result.success) {
        // Update stored keys
        localStorage.setItem('api_key', result.api_key);
        localStorage.setItem('api_secret', result.api_secret);
        console.log('[authService.regenerateKeys] Keys regenerated successfully');
      }
      
      return result;
    } catch (error) {
      console.error('[authService.regenerateKeys] Failed:', error);
      throw error;
    }
  }
};