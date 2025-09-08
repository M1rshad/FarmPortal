// // frontend/src/services/riskService.js
// import API from './api';

// export const riskService = {
//   trigger : () => API.post('/importer/run-risk'),
//   // extend later with endpoints that return detailed results
// };

// frontend/src/services/riskService.js
import axios from 'axios';

export const riskService = {
  trigger: () =>
    axios.get('/api/method/farmportal.api.risk_dashboard.trigger'),
  getTreeTiles: (coordinates) =>
    axios.get('/api/method/farmportal.api.risk_dashboard.get_tree_loss_tile_url', {
      params: { coordinates_json: JSON.stringify(coordinates) }
    })
};
