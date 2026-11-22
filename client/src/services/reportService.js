import API from "./api";

// Submit a property report
export const submitReport = async (propertyId, data) => {
  const response = await API.post(
    `/api/reports/property/${propertyId}`,
    data
  );

  return response.data;
};

// Admin: get all reports
export const getAllReports = async () => {
  const response = await API.get("/api/reports");
  return response.data;
};

// Admin: update report status
export const updateReportStatus = async (id, data) => {
  const response = await API.put(
    `/api/reports/${id}/status`,
    data
  );

  return response.data;
};