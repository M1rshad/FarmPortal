// import API from './api';
// const unwrap = (d) => d?.message ?? d ?? null;

// export const landPlotService = {
//   beginImport: async () => {
//     const { data } = await API.post('/method/farmportal.api.landplots.begin_import', {});
//     return unwrap(data); // { name }
//   },

//   // Upload CSV file and attach it to the Land Plot Import doc
//   uploadImportFile: async ({ name, file }) => {
//     const form = new FormData();
//     form.append('file', file);
//     form.append('is_private', 1);
//     form.append('doctype', 'Land Plot Import');
//     form.append('docname', name);
//     form.append('fieldname', 'source_file');
//     const { data } = await API.post('/method/upload_file', form, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     // data.message.file_url will hold the saved path
//     return data?.message || data;
//   },

//   finalizeImport: async ({ name, total_plots, log, status }) => {
//     const { data } = await API.post('/method/farmportal.api.landplots.finalize_import', {
//       name,
//       total_plots,
//       log,
//       status, // 'Imported' or 'Failed'
//     });
//     return unwrap(data);
//   },
// };
// import API from './api';

// const unwrap = (d) => d?.message ?? d ?? null;

// export const landPlotService = {
//   // Get all land plots for current supplier
//   getLandPlots: async () => {
//     const { data } = await API.get('/method/farmportal.api.landplots.get_land_plots');
//     return unwrap(data);
//   },

//   // Create a single land plot
//   createLandPlot: async (plotData) => {
//     const { data } = await API.post('/method/farmportal.api.landplots.create_land_plot', {
//       plot_data: JSON.stringify(plotData)
//     });
//     return unwrap(data);
//   },

//   // Update a land plot
//   updateLandPlot: async (name, plotData) => {
//     const { data } = await API.post('/method/farmportal.api.landplots.update_land_plot', {
//       name,
//       plot_data: JSON.stringify(plotData)
//     });
//     return unwrap(data);
//   },

//   // Delete a land plot
//   deleteLandPlot: async (name) => {
//     const { data } = await API.post('/method/farmportal.api.landplots.delete_land_plot', {
//       name
//     });
//     return unwrap(data);
//   },

//   // Bulk create from CSV
//   bulkCreateLandPlots: async (plotsData) => {
//     const { data } = await API.post('/method/farmportal.api.landplots.bulk_create_land_plots', {
//       plots_data: JSON.stringify(plotsData)
//     });
//     return unwrap(data);
//   },

//   // Existing import methods for file handling
//   beginImport: async () => {
//     const { data } = await API.post('/method/farmportal.api.landplots.begin_import', {});
//     return unwrap(data);
//   },

//   uploadImportFile: async ({ name, file }) => {
//     const form = new FormData();
//     form.append('file', file);
//     form.append('is_private', 1);
//     form.append('doctype', 'Land Plot Import');
//     form.append('docname', name);
//     form.append('fieldname', 'source_file');
//     const { data } = await API.post('/method/upload_file', form, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return data?.message || data;
//   },

//   finalizeImport: async ({ name, total_plots, log, status }) => {
//     const { data } = await API.post('/method/farmportal.api.landplots.finalize_import', {
//       name,
//       total_plots,
//       log,
//       status,
//     });
//     return unwrap(data);
//   },
// };

import API from './api';

const unwrap = (d) => d?.message ?? d ?? null;

export const landPlotService = {
  // Get all land plots for current supplier
  getLandPlots: async () => {
    const { data } = await API.get('/method/farmportal.api.landplots.get_land_plots');
    return unwrap(data);
  },

  // Create a single land plot with deforestation calculation
  createLandPlot: async (plotData, calculateDeforestation = true) => {
    const { data } = await API.post('/method/farmportal.api.landplots.create_land_plot', {
      plot_data: JSON.stringify(plotData),
      calculate_deforestation: calculateDeforestation
    });
    return unwrap(data);
  },

  // Update a land plot with optional deforestation recalculation
  updateLandPlot: async (name, plotData, recalculateDeforestation = false) => {
    const { data } = await API.post('/method/farmportal.api.landplots.update_land_plot', {
      name,
      plot_data: JSON.stringify(plotData),
      recalculate_deforestation: recalculateDeforestation
    });
    return unwrap(data);
  },

  // Delete a land plot
  deleteLandPlot: async (name) => {
    const { data } = await API.post('/method/farmportal.api.landplots.delete_land_plot', {
      name
    });
    return unwrap(data);
  },

  // Bulk create from CSV with deforestation calculation
  bulkCreateLandPlots: async (plotsData, calculateDeforestation = true) => {
    const { data } = await API.post('/method/farmportal.api.landplots.bulk_create_land_plots', {
      plots_data: JSON.stringify(plotsData),
      calculate_deforestation: calculateDeforestation
    });
    return unwrap(data);
  },

  // Manually recalculate deforestation for a plot
  recalculateDeforestation: async (plotName) => {
    const { data } = await API.post('/method/farmportal.api.landplots.recalculate_deforestation', {
      plot_name: plotName
    });
    return unwrap(data);
  },

  // Existing import methods
  beginImport: async () => {
    const { data } = await API.post('/method/farmportal.api.landplots.begin_import', {});
    return unwrap(data);
  },

  // uploadImportFile: async ({ name, file }) => {
  //   const form = new FormData();
  //   form.append('file', file);
  //   form.append('is_private', 1);
  //   form.append('doctype', 'Land Plot Import');
  //   form.append('docname', name);
  //   form.append('fieldname', 'source_file');
  //   const { data } = await API.post('/method/upload_file', form, {
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //   });
  //   return data?.message || data;
  // },
  uploadImportFile: async ({ name, file }) => {
  const form = new FormData();
  form.append('file', file);
  form.append('is_private', 1);
  form.append('doctype', 'Land Plot Import');
  form.append('docname', name);
  form.append('fieldname', 'source_file');
  
  // Remove the headers config entirely - axios handles it automatically
  const { data } = await API.post('/method/upload_file', form);
  return data?.message || data;
},

  finalizeImport: async ({ name, total_plots, log, status }) => {
    const { data } = await API.post('/method/farmportal.api.landplots.finalize_import', {
      name,
      total_plots,
      log,
      status,
    });
    return unwrap(data);
  },
  
  // Get deforestation tiles for specific coordinates
  getDeforestationTiles: async (coordinates) => {
    const { data } = await API.get('/method/farmportal.api.landplots.get_deforestation_tiles', {
      params: { coordinates_json: JSON.stringify(coordinates) }
    });
    return unwrap(data);
  },

  // Get global deforestation tiles
  getGlobalDeforestationTiles: async () => {
    const { data } = await API.get('/method/farmportal.api.landplots.get_global_deforestation_tiles');
    return unwrap(data);
  },
};
