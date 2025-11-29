// import axios from 'axios';

// // Production Master Router
// const ROUTER_API = 'http://127.0.0.1:8000/api/method/farmportal.api.router.lookup_tenant';

// // Local Dev Configuration
// const DEV_CONFIG = {
//   code: 'LOCAL',
//   backendUrl: 'http://127.0.0.1:8000', // Your local bench URL
//   companyName: 'Local Dev Environment'
// };

// export const resolveCompanyCode = async (code) => {
//   try {
//     if (!code) throw new Error("No Company Code provided");

//     const cleanCode = String(code).trim().toUpperCase();
//     console.log(`[tenantService] Resolving code: ${cleanCode}`);

//     // --- 1. LOCALHOST OVERRIDE ---
//     // If code is LOCAL or DEV, return immediately. Do NOT call Axios.
//     if (cleanCode === 'LOCAL' || cleanCode === 'DEV') {
//       console.log('[tenantService] Using Local Config');
//       localStorage.setItem('tenant_config', JSON.stringify(DEV_CONFIG));
//       return DEV_CONFIG; // <--- Crucial Return Statement
//     }

//     // --- 2. Production Lookup ---
//     console.log('[tenantService] Calling Master Router...');
//     const response = await axios.get(ROUTER_API, {
//       params: { code: cleanCode }
//     });

//     if (response.data.message) {
//       const { url, name } = response.data.message;
//       const config = {
//         code: cleanCode,
//         backendUrl: url,
//         companyName: name
//       };
//       localStorage.setItem('tenant_config', JSON.stringify(config));
//       return config;
//     } else {
//       throw new Error('Invalid Company Code');
//     }

//   } catch (error) {
//     console.error('Tenant Lookup Error:', error);
//     // Provide a clearer error message
//     if (error.code === 'ERR_NETWORK') {
//         throw new Error('Could not connect to the server. Please check your internet connection.');
//     }
//     throw new Error('Could not find a workspace with that Company Code.');
//   }
// };

// export const getTenantConfig = () => {
//   const conf = localStorage.getItem('tenant_config');
//   return conf ? JSON.parse(conf) : null;
// };
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";

// Local Dev Override (Still useful!)
const DEV_CONFIG = {
  code: 'LOCAL',
  backendUrl: 'http://127.0.0.1:8000',
  companyName: 'Local Dev Environment'
};

export const resolveCompanyCode = async (code) => {
  try {
    if (!code) throw new Error("No Company Code provided");

    const cleanCode = String(code).trim().toUpperCase();
    console.log(`[tenantService] Resolving code: ${cleanCode}`);

    // --- 1. LOCALHOST OVERRIDE ---
    if (cleanCode === 'LOCAL' || cleanCode === 'DEV') {
      console.log('[tenantService] Using Local Config');
      localStorage.setItem('tenant_config', JSON.stringify(DEV_CONFIG));
      return DEV_CONFIG;
    }

    // --- 2. FIREBASE LOOKUP ---
    console.log('[tenantService] Querying Firestore...');
    
    const tenantsRef = collection(db, "tenants");
    // Create a query against the collection where code == cleanCode
    const q = query(tenantsRef, where("code", "==", cleanCode));
    
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Get the first matching document
      const docData = querySnapshot.docs[0].data();
      console.log('[tenantService] Found tenant:', docData);

      const config = {
        code: cleanCode,
        backendUrl: docData.url, // Ensure Firestore doc has 'url' field
        companyName: docData.name // Ensure Firestore doc has 'name' field
      };
      
      localStorage.setItem('tenant_config', JSON.stringify(config));
      return config;
    } else {
      console.warn('[tenantService] No matching tenant found in Firestore');
      throw new Error('Invalid Company Code');
    }

  } catch (error) {
    console.error('Tenant Lookup Error:', error);
    // Check for common Firebase network/permission errors
    if (error.code === 'permission-denied') {
       throw new Error('Access denied. Check Firebase security rules.');
    }
    throw new Error('Could not find a workspace with that Company Code.');
  }
};

export const getTenantConfig = () => {
  const conf = localStorage.getItem('tenant_config');
  return conf ? JSON.parse(conf) : null;
};
