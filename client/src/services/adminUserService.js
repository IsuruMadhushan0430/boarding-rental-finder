
import API from "./api";

export const getAdminUsers = async (params = {}) => {
  const response = await API.get("/api/admin/users", { params });
  return response.data;
};

export const getAdminUserStats = async () => {
  const response = await API.get("/api/admin/users/stats");
  return response.data;
};

export const updateAdminUserStatus = async (userId, isActive) => {
  const response = await API.patch(
    `/api/admin/users/${userId}/status`,
    { isActive }
  );

  return response.data;
};
