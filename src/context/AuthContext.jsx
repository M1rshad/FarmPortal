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
//     profile: payload.profile || null,
//   };
// };

// export const AuthProvider = ({ children }) => {
//   // Initialize from sessionStorage and re-hydrate roles as Set
//   const initial = (() => {
//     try {
//       const raw = sessionStorage.getItem('fp:user');
//       if (!raw) return null;
      
//       const parsed = JSON.parse(raw);
      
//       // Re-hydrate roles as Set if rolesArray exists
//       if (parsed && Array.isArray(parsed.rolesArray)) {
//         parsed.roles = new Set(parsed.rolesArray);
//       }
      
//       return parsed;
//     } catch {
//       return null;
//     }
//   })();

//   const [user, setUser] = useState(initial);
//   const [loading, setLoading] = useState(true);

//   const persist = (u) => {
//     try {
//       if (u) {
//         sessionStorage.setItem('fp:user', JSON.stringify(u));
//       } else {
//         sessionStorage.removeItem('fp:user');
//       }
//     } catch {}
//   };

//   const refreshUser = async () => {
//     if (!authService.isAuthenticated()) {
//       throw new Error('No API credentials found');
//     }

//     const me = await authService.getMe();
//     const u = normalizeMe(me);
//     setUser(u);
//     persist(u);
//     return u;
//   };

//   // Initial auth check on mount
//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       const hasCredentials = authService.isAuthenticated();
      
//       if (hasCredentials) {
//         try {
//           const u = await refreshUser();
//           if (!cancelled) setUser(u);
//         } catch (err) {
//           console.error('[AuthContext] Failed to load user:', err);
//           if (!cancelled) {
//             setUser(null);
//             persist(null);
//           }
//         } finally {
//           if (!cancelled) setLoading(false);
//         }
//       } else {
//         if (!cancelled) {
//           setUser(null);
//           persist(null);
//           setLoading(false);
//         }
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const login = async (companyCode, email, password) => {
//     try {
//       const res = await authService.login({ companyCode, email, password });
//       const u = normalizeMe(res.user);
//       setUser(u);
//       persist(u);
//       toast.success('Login successful!');
//       return { success: !!u, user: u };
//     } catch (error) {
//       const message =
//         error.response?.data?.exception ||
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         'Login failed';
//       toast.error(message);
//       return { success: false, error: message };
//     }
//   };

//   const logout = async () => {
//     try {
//       await authService.logout();
//     } catch (err) {
//       console.error('[AuthContext] Logout error:', err);
//     } finally {
//       setUser(null);
//       persist(null);
//       toast.info('Logged out successfully');
//     }
//   };

//   // ✅ Define ALL computed values BEFORE useMemo
//   const isAuthenticated = !!(user && authService.isAuthenticated());
//   const isEmployee = !!user?.employee || user?.roles?.has('Employee') || false;
//   const isSupplier = !!user?.supplier || user?.roles?.has('Supplier') || false;
//   const isCustomer = user?.roles?.has('Customer') || false;

//   // ✅ Now use them in useMemo - they're already defined above
//   const value = useMemo(
//     () => ({
//       user,
//       loading,
//       isAuthenticated,
//       isEmployee,
//       isSupplier,
//       isCustomer,
//       login,
//       logout,
//       refreshUser,
//       setUser,
//     }),
//     [user, loading, isAuthenticated, isEmployee, isSupplier, isCustomer]
//   );

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
  // 1. Initialize User from Session Storage
  const initialUser = (() => {
    try {
      const raw = sessionStorage.getItem('fp:user');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.rolesArray)) {
        parsed.roles = new Set(parsed.rolesArray);
      }
      return parsed;
    } catch {
      return null;
    }
  })();

  // 2. Initialize Auth State based on Keys existing
  // This ensures PublicRoute sees "true" immediately if keys exist
  const initialAuth = authService.isAuthenticated();

  const [user, setUser] = useState(initialUser);
  // If we have keys but no user object yet, we are loading. 
  // If we have no keys, we are definitely not loading.
  const [loading, setLoading] = useState(initialAuth && !initialUser);

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
    if (!authService.isAuthenticated()) {
      throw new Error('No API credentials found');
    }
    const me = await authService.getMe();
    const u = normalizeMe(me);
    setUser(u);
    persist(u);
    return u;
  };

  // 3. Verification Effect
  useEffect(() => {
    const checkSession = async () => {
      if (authService.isAuthenticated()) {
        try {
          // We have keys, let's verify them and get fresh user data
          const u = await refreshUser();
          setUser(u);
        } catch (err) {
          console.error('[AuthContext] Session verification failed:', err);
          // Keys were invalid or network error
          setUser(null);
          persist(null);
          // Optional: authService.logout() to clear bad keys
        } finally {
          setLoading(false);
        }
      } else {
        // No keys, definitely logged out
        setUser(null);
        persist(null);
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (companyCode, email, password) => {
    try {
      const res = await authService.login({ companyCode, email, password });
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

  // Derived state
  const isAuthenticated = !!user; 
  const isEmployee = !!user?.employee || user?.roles?.has('Employee') || false;
  const isSupplier = !!user?.supplier || user?.roles?.has('Supplier') || false;
  const isCustomer = user?.roles?.has('Customer') || false;

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated, // Use the derived boolean based on user object
      isEmployee,
      isSupplier,
      isCustomer,
      login,
      logout,
      refreshUser,
      setUser,
    }),
    [user, loading, isAuthenticated, isEmployee, isSupplier, isCustomer]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
