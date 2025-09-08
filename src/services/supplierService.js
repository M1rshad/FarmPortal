// frontend/src/services/supplierService.js
import API from './api';

export const supplierService = {
  /* Land-plots */
  listLandPlots  : ()          => API.get ('/data/land-plots'),
  createLandPlot : data        => API.post('/data/land-plots', data),
  updateLandPlot : (id, data)  => API.put (`/data/land-plots/${id}`, data),
  deleteLandPlot : id          => API.delete(`/data/land-plots/${id}`),

  /* Batches */
  listBatches  : ()         => API.get ('/data/batches'),
  createBatch  : data       => API.post('/data/batches', data),
  updateBatch  : (id, data) => API.put (`/data/batches/${id}`, data),
  deleteBatch  : id         => API.delete(`/data/batches/${id}`),

  /* Supplier-side sync *//* Products */
  listProducts  : ()          => API.get ('/data/products'),
  createProduct : data        => API.post('/data/products', data),
  updateProduct : (id,data)   => API.put (`/data/products/${id}`, data),
  deleteProduct : id          => API.delete(`/data/products/${id}`),
  // Add this method:
  getTemplate: () => API.get('/data/template/land-plots'),
  /* Sync with ERPNext (for suppliers that connect) */
  syncLandPlots : () => API.post('/data/sync/land-plots'),
  syncProducts  : () => API.post('/data/sync/products'),

  /* Answer product / PO request */
  answerRequest : (requestId, payload) =>
    API.post(`/data/requests/${requestId}/answer`, payload)
};