import API from "./api";

// Send an inquiry
export const sendInquiry = async (propertyId, data) => {
  const response = await API.post(
    `/api/inquiries/property/${propertyId}`,
    data
  );

  return response.data;
};

// Get inquiries sent by the seeker
export const getMyInquiries = async () => {
  const response = await API.get("/api/inquiries/my-inquiries");
  return response.data;
};

// Get inquiries received by the landlord
export const getReceivedInquiries = async () => {
  const response = await API.get("/api/inquiries/received");
  return response.data;
};

// Update inquiry status
export const updateInquiryStatus = async (id, status) => {
  const response = await API.put(
    `/api/inquiries/${id}/status`,
    { status }
  );

  return response.data;
};