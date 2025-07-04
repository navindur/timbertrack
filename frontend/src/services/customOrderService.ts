import axios from "axios";

const API_URL = "/api/custom-orders";

//helper to get auth headers from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};
//create a new custom order
export const createCustomOrder = async (
  customerId: number,
  details: string,
  imageFile?: File
) => {
  const formData = new FormData();
  formData.append("customer_id", customerId.toString());
  formData.append("details", details);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await axios.post(API_URL, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
//for shop owner
export const getAllCustomOrders = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
//for specific customer
export const getMyCustomOrders = async (customerId: number) => {
  const response = await axios.get(`${API_URL}/my/${customerId}`, {
    headers: getAuthHeaders(),
    params: { _: new Date().getTime() } 
  });
  return response.data;
};

export const acceptCustomOrder = async (orderId: number, estimatedPrice: number) => {
  const response = await axios.put(
    `${API_URL}/${orderId}/accept`,
    { estimated_price: estimatedPrice },
    { headers: getAuthHeaders() }
  );
  
  return response.data;
};

export const rejectCustomOrder = async (orderId: number) => {
  const response = await axios.put(
    `${API_URL}/${orderId}/reject`,
    {},
    { headers: getAuthHeaders() }
  );
  
  return response.data;
};

export const markCustomOrderAsPaid = async (orderId: number) => {
  const response = await axios.put(
    `${API_URL}/${orderId}/mark-paid`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const updateProductionStatus = async (
  orderId: number,
  status: 'not_started' | 'in_progress' | 'finished' | 'shipped' | 'delivered'
) => {
  const response = await axios.put(
    `${API_URL}/${orderId}/update-status`,
    { status },
    { headers: getAuthHeaders() }
  );
  return response.data;
};