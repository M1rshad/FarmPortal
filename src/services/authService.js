// import API from './api';

// const unwrap = (data) => (data?.message ?? data ?? null);

// export const authService = {
//   login: async ({ email, password }) => {
//     try {
//       console.log('[authService.login] Starting login process');
//       console.log('[authService.login] Email:', email);
      
//       // Login and get auto-generated API keys
//       const { data } = await API.post('/method/farmportal.auth_helper.login_and_get_api_keys', {
//         usr: email,
//         pwd: password
//       });
      
//       const result = unwrap(data);
//       console.log('[authService.login] Login response:', { success: result.success, user: result.user });
      
//       if (!result.success || !result.api_key || !result.api_secret) {
//         throw new Error('Failed to get API credentials');
//       }
      
//       // Store the API keys in localStorage
//       localStorage.setItem('api_key', result.api_key);
//       localStorage.setItem('api_secret', result.api_secret);
//       localStorage.setItem('user_email', email);
      
//       console.log('[authService.login] API credentials stored');
      
//       // Fetch complete user info using the API keys
//       const me = await authService.getMe();
      
//       console.log('[authService.login] User info loaded:', me);
      
//       return { 
//         success: true, 
//         user: me 
//       };
      
//     } catch (error) {
//       // Clear any stored credentials on error
//       localStorage.removeItem('api_key');
//       localStorage.removeItem('api_secret');
//       localStorage.removeItem('user_email');
      
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
      
//       // Clear all stored credentials
//       localStorage.removeItem('api_key');
//       localStorage.removeItem('api_secret');
//       localStorage.removeItem('user_email');
      
//       console.log('[authService.logout] Logout successful');
//       return { success: true };
//     } catch (error) {
//       console.error('[authService.logout] Logout failed:', error.message);
//       throw error;
//     }
//   },

//   getMe: async () => {
//     try {
//       console.log('[authService.getMe] Fetching current user info');
      
//       const { data } = await API.get('/method/farmportal.custom_api.get_current_user');
//       const result = unwrap(data);
      
//       console.log('[authService.getMe] Success:', result);
//       return result;
//     } catch (error) {
//       console.error('[authService.getMe] Failed:', {
//         status: error.response?.status,
//         message: error.response?.data?.message,
//         error: error.response?.data?.exc || error.message
//       });
//       throw error;
//     }
//   },

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
  
//   // Helper to check if user is authenticated
//   isAuthenticated: () => {
//     const hasKeys = !!(localStorage.getItem('api_key') && localStorage.getItem('api_secret'));
//     console.log('[authService.isAuthenticated]', hasKeys);
//     return hasKeys;
//   },
  
//   // Optional: Allow users to regenerate their keys
//   regenerateKeys: async () => {
//     try {
//       console.log('[authService.regenerateKeys] Regenerating API keys');
      
//       const { data } = await API.post('/method/farmportal.auth_helper.regenerate_api_keys');
//       const result = unwrap(data);
      
//       if (result.success) {
//         // Update stored keys
//         localStorage.setItem('api_key', result.api_key);
//         localStorage.setItem('api_secret', result.api_secret);
//         console.log('[authService.regenerateKeys] Keys regenerated successfully');
//       }
      
//       return result;
//     } catch (error) {
//       console.error('[authService.regenerateKeys] Failed:', error);
//       throw error;
//     }
//   }
// };
import API from './api';
import { resolveCompanyCode } from './tenantService'; // Import the new service

const unwrap = (data) => (data?.message ?? data ?? null);

export const authService = {
  // MODIFIED: login now takes companyCode
  login: async ({ companyCode, email, password }) => {
    try {
      // Validation
      if (!companyCode) throw new Error("Company Code is required");
      if (!email) throw new Error("Email is required");
      if (!password) throw new Error("Password is required");
      console.log(`[authService.login] Resolving company code: ${companyCode}`);
      
      // 1. Resolve tenant URL BEFORE doing anything else
      await resolveCompanyCode(companyCode);

      console.log('[authService.login] Tenant resolved. Proceeding with login...');

      // 2. The rest of your login logic now runs.
      // The API interceptor will automatically use the correct baseURL.
      const { data } = await API.post('/method/farmportal.auth_helper.login_and_get_api_keys', {
        usr: email,
        pwd: password
      });
      
      const result = unwrap(data);
      if (!result.success || !result.api_key || !result.api_secret) {
        throw new Error('Failed to get API credentials');
      }
      
      localStorage.setItem('api_key', result.api_key);
      localStorage.setItem('api_secret', result.api_secret);
      localStorage.setItem('user_email', email);
      
      const me = await authService.getMe();
      return { success: true, user: me };
      
    } catch (error) {
      // Clear all stored credentials and tenant info on error
      localStorage.removeItem('api_key');
      localStorage.removeItem('api_secret');
      localStorage.removeItem('user_email');
      localStorage.removeItem('tenant_config'); // Also clear tenant info
      
      console.error('[authService.login] Login failed:', error);
      throw error;
    }
  },

  // MODIFIED: Logout should clear tenant config too
  logout: async () => {
    try {
      localStorage.removeItem('api_key');
      localStorage.removeItem('api_secret');
      localStorage.removeItem('user_email');
      localStorage.removeItem('tenant_config'); // Clear tenant
      
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
