// import API from './api';

// export const customerService = {
//   /* Supplier & product master */
//   getSuppliers : () => API.get('/data/suppliers'),
//   // after getSuppliers
//   getSupplierProducts : (supplierId)=>API.get(`/data/supplier/${supplierId}/products`),
//   createSupplier: data => API.post('/importer/supplier', data),
//   createItem    : data => API.post('/importer/item', data),

//   /* Batches */
//   createBatch : data => API.post('/importer/batch', data),
//   listBatches : itemCode => API.get(`/importer/batches/${itemCode}`),

//   /* Risk analysis */
//   runRisk      : () => API.post('/importer/run-risk')
// };

import axios from 'axios';

export const customerService = {
  getSuppliers: () =>
    axios.get('/api/method/farmportal.api.risk_dashboard.get_suppliers_with_risk')
};