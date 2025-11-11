// // context/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { authService } from '../services/authService';
// import { toast } from 'react-toastify';

// const AuthContext = createContext();
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
//   return ctx;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);   // { name, full_name, email, roles, employee?, supplier? }
//   const [loading, setLoading] = useState(true);

//   const normalizeMe = (resData) => {
//     const payload = resData?.message || resData; // Frappe may wrap under .message
//     if (!payload?.user) return null;
//     return {
//       ...payload.user,
//       employee: payload.employee || null,
//       supplier: payload.supplier || null,
//     };
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await authService.getProfile();
//         setUser(normalizeMe(res.data));
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       await authService.login({ email, password });
//       const me = await authService.getProfile();
//       setUser(normalizeMe(me.data));
//       toast.success('Login successful!');
//       return { success: true };
//     } catch (error) {
//       const message =
//         error.response?.data?.exception ||
//         error.response?.data?.error ||
//         'Login failed';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const res = await authService.register(userData);
//       // If you implement server-side signup that logs in, fetch profile:
//       try {
//         const me = await authService.getProfile();
//         setUser(normalizeMe(me.data));
//       } catch {}
//       toast.success('Registration successful!');
//       return { success: true };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Registration failed';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   const logout = async () => {
//     try {
//       await authService.logout();
//     } finally {
//       setUser(null);
//       toast.info('Logged out successfully');
//     }
//   };

//   const roles = user?.roles || [];
//   const isSupplier = !!user?.supplier || roles.includes('Supplier');
//   const isEmployee = !!user?.employee || roles.includes('Employee');

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading,
//     isAuthenticated: !!user,
//     isSupplier,
//     isEmployee,
//     isCustomer: roles.includes('Customer'),
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
// context/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
// import { authService } from '../services/authService';
// import { toast } from 'react-toastify';

// const AuthContext = createContext(null);

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
//   return ctx;
// };

// const normalizeMe = (resData) => {
//   // Frappe may wrap under .message; sometimes axios data is already "message"
//   const payload = resData?.message ?? resData;
//   const user = payload?.user;
//   if (!user) return null;

//   const rolesArray = Array.isArray(user.roles) ? user.roles : [];
//   const roles = new Set(rolesArray);

//   return {
//     name: user.name,
//     full_name: user.full_name,
//     email: user.email,
//     rolesArray,
//     roles,                              // Set for fast membership checks
//     employee: payload.employee || null,
//     supplier: payload.supplier || null,
//   };
// };

// export const AuthProvider = ({ children }) => {
//   // Optional: hydrate from sessionStorage for instant paint
//   const initial = (() => {
//     try {
//       const raw = sessionStorage.getItem('fp:user');
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   })();

//   const [user, setUser] = useState(initial);
//   const [loading, setLoading] = useState(true);

//   // Single source of truth to refetch profile (expose it too)
//   const refreshUser = async () => {
//     const res = await authService.getProfile();
//     const u = normalizeMe(res.data);
//     setUser(u);
//     try {
//       sessionStorage.setItem('fp:user', JSON.stringify(u));
//     } catch {}
//     return u;
//   };

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const u = await refreshUser();
//         if (cancelled) return;
//         setUser(u);
//       } catch {
//         if (!cancelled) setUser(null);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const login = async (email, password) => {
//     try {
//       await authService.login({ email, password });
//       const u = await refreshUser();
//       toast.success('Login successful!');
//       return { success: true, user: u };
//     } catch (error) {
//       const message =
//         error.response?.data?.exception ||
//         error.response?.data?.error ||
//         'Login failed';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const res = await authService.register(userData);
//       // If your server logs-in on register, refresh:
//       try { await refreshUser(); } catch {}
//       toast.success('Registration successful!');
//       return { success: true, data: res.data };
//     } catch (error) {
//       const message = error.response?.data?.error || 'Registration failed';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   const logout = async () => {
//     try {
//       await authService.logout();
//     } finally {
//       setUser(null);
//       try { sessionStorage.removeItem('fp:user'); } catch {}
//       toast.info('Logged out successfully');
//     }
//   };

//   const isEmployee = !!user?.employee || user?.roles?.has?.('Employee') || false;
//   const isSupplier = !!user?.supplier || user?.roles?.has?.('Supplier') || false;
//   const isAuthenticated = !!user;

//   const value = useMemo(() => ({
//     user,
//     loading,
//     isAuthenticated,
//     isEmployee,
//     isSupplier,
//     isCustomer: user?.roles?.has?.('Customer') || false,
//     login,
//     register,
//     logout,
//     refreshUser, // <-- handy for profile pages
//   }), [user, loading, isAuthenticated, isEmployee, isSupplier]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// context/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
// import { authService } from '../services/authService';
// import { toast } from 'react-toastify';

// const AuthContext = createContext(null);
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
//   return ctx;
// };

// const normalizeMe = (res) => {
//   const payload = res?.message ?? res ?? null;
//   if (!payload?.user) return null;

//   const rolesArray = Array.isArray(payload.user.roles) ? payload.user.roles : [];
//   const roles = new Set(rolesArray);

//   return {
//     name: payload.user.name,
//     full_name: payload.user.full_name,
//     email: payload.user.email,
//     display_name: payload.display_name || payload.user.full_name || payload.user.name,
//     account_type: payload.account_type || 'User',
//     rolesArray,
//     roles,
//     employee: payload.employee || null,
//     supplier: payload.supplier || null,
//     customer: payload.customer || null,
//     profile: payload.profile || null, // <-- Update Profile data bundled in
//   };
// };

// export const AuthProvider = ({ children }) => {
//   const initial = (() => {
//     try {
//       const raw = sessionStorage.getItem('fp:user');
//       return raw ? JSON.parse(raw) : null;
//     } catch { return null; }
//   })();

//   const [user, setUser] = useState(initial);
//   const [loading, setLoading] = useState(true);

//   const persist = (u) => {
//     try { sessionStorage.setItem('fp:user', JSON.stringify(u)); } catch {}
//   };

//   const refreshUser = async () => {
//     const me = await authService.getMe();
//     const u = normalizeMe(me);
//     setUser(u);
//     persist(u);
//     return u;
//   };

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const u = await refreshUser();
//         if (!cancelled) setUser(u);
//       } catch {
//         if (!cancelled) setUser(null);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const res = await authService.login({ email, password });
//       const u = normalizeMe(res.user);
//       setUser(u);
//       persist(u);
//       toast.success('Login successful!');
//       return { success: !!u, user: u };
//     } catch (error) {
//       const message =
//         error.response?.data?.exception ||
//         error.response?.data?.error ||
//         'Login failed';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   const logout = async () => {
//     try { await authService.logout(); } finally {
//       setUser(null);
//       try { sessionStorage.removeItem('fp:user'); } catch {}
//       toast.info('Logged out successfully');
//     }
//   };

//   const isAuthenticated = !!user;
//   const isEmployee = !!user?.employee || user?.roles?.has?.('Employee') || false;
//   const isSupplier = !!user?.supplier || user?.roles?.has?.('Supplier') || false;

//   const value = useMemo(() => ({
//     user,
//     loading,
//     isAuthenticated,
//     isEmployee,
//     isSupplier,
//     isCustomer: user?.roles?.has?.('Customer') || false,
//     login,
//     logout,
//     refreshUser,
//     setUser, // optional
//   }), [user, loading, isAuthenticated, isEmployee, isSupplier]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

const normalizeMe = (res) => {
  const payload = res?.message ?? res ?? null;
  if (!payload?.user) return null;

  const rolesArray = Array.isArray(payload.user.roles) ? payload.user.roles : [];
  const roles = new Set(rolesArray);

  return {
    name: payload.user.name,
    full_name: payload.user.full_name,
    email: payload.user.email,
    display_name: payload.display_name || payload.user.full_name || payload.user.name,
    account_type: payload.account_type || 'User',
    rolesArray,
    roles,
    employee: payload.employee || null,
    supplier: payload.supplier || null,
    customer: payload.customer || null,
    profile: payload.profile || null,
  };
};

export const AuthProvider = ({ children }) => {
  // Initialize from sessionStorage
  const initial = (() => {
    try {
      const raw = sessionStorage.getItem('fp:user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [user, setUser] = useState(initial);
  const [loading, setLoading] = useState(true);

  const persist = (u) => {
    try {
      if (u) {
        sessionStorage.setItem('fp:user', JSON.stringify(u));
      } else {
        sessionStorage.removeItem('fp:user');
      }
    } catch {}
  };

  const refreshUser = async () => {
    // Use authService helper to check credentials
    if (!authService.isAuthenticated()) {
      throw new Error('No API credentials found');
    }

    const me = await authService.getMe();
    const u = normalizeMe(me);
    setUser(u);
    persist(u);
    return u;
  };

  // Initial auth check on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const hasCredentials = authService.isAuthenticated();
      
      if (hasCredentials) {
        // We have credentials - fetch/validate user data
        try {
          const u = await refreshUser();
          if (!cancelled) setUser(u);
        } catch (err) {
          console.error('[AuthContext] Failed to load user:', err);
          if (!cancelled) {
            setUser(null);
            persist(null);
            // Don't clear credentials here - let api.js interceptor handle 401
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        // No credentials - user not authenticated
        if (!cancelled) {
          setUser(null);
          persist(null);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      // authService.login already stores credentials and fetches user data
      const res = await authService.login({ email, password });
      
      const u = normalizeMe(res.user);
      setUser(u);
      persist(u);
      
      toast.success('Login successful!');
      return { success: !!u, user: u };
    } catch (error) {
      const message =
        error.response?.data?.exception ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Login failed';
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('[AuthContext] Logout error:', err);
    } finally {
      setUser(null);
      persist(null);
      toast.info('Logged out successfully');
    }
  };

  // Use authService helper + user data for authentication check
  const isAuthenticated = !!(user && authService.isAuthenticated());
  const isEmployee = !!user?.employee || user?.roles?.has('Employee') || false;
  const isSupplier = !!user?.supplier || user?.roles?.has('Supplier') || false;

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      isEmployee,
      isSupplier,
      isCustomer: user?.roles?.has('Customer') || false,
      login,
      logout,
      refreshUser,
      setUser,
    }),
    [user, loading, isAuthenticated, isEmployee, isSupplier]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
