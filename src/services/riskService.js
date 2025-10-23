// // frontend/src/services/riskService.js
// import API from './api';

// export const riskService = {
//   trigger : () => API.post('/importer/run-risk'),
//   // extend later with endpoints that return detailed results
// };

// frontend/src/services/riskService.js
import API from './api';

const unwrap = (d) => d?.message ?? d ?? null;

export const riskService = {
  // Get risk dashboard data
  getRiskDashboardData: async () => {
    const { data } = await API.get('/method/farmportal.api.requests.get_risk_dashboard_data');
    return unwrap(data) || { suppliers: [], summary: {} };
  },

  // Trigger risk analysis
  trigger: async () => {
    const { data } = await API.post('/method/farmportal.api.requests.trigger_risk_analysis');
    return unwrap(data);
  }
};
