import API from "./api";

export const getAdminProperties = async (params = {}) => {
  const response = await API.get("/api/admin/properties", {
    params,
  });

  return response.data;
};

export const getAdminPropertyStats = async () => {
  const response = await API.get("/api/admin/properties/stats");
  return response.data;
};

export const updateAdminPropertyStatus = async (
  propertyId,
  data
) => {
  const response = await API.put(
    `/api/admin/properties/${propertyId}/status`,
    data
  );

  return response.data;
};