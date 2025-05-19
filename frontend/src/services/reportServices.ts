// src/services/reportApi.ts
import axios from 'axios';

const API_BASE_URL = '/api/reports'; // Using proxy in development

// Sales Reports
export const fetchSalesSummary = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/sales-summary`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

export const fetchSalesByProduct = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/sales-by-product`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

export const fetchSalesByCategory = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/sales-by-category`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

// Inventory Reports
export const fetchLowStock = async () => {
  const response = await axios.get(`${API_BASE_URL}/inventory/low-stock`);
  return response.data;
};

export const fetchInventoryValuation = async () => {
  const response = await axios.get(`${API_BASE_URL}/inventory/valuation`);
  return response.data;
};

// Customer Reports
export const fetchTopCustomers = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/customers/top`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

// Add more API functions as needed for other reports
// Sales by Payment Method
export const fetchSalesByPaymentMethod = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/sales-by-payment`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

// Customer Order History
export const fetchCustomerOrderHistory = async (customerId: string) => {
  const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/orders`);
  return response.data;
};

// Orders by Status
export const fetchOrdersByStatus = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/orders/status`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

// Fetch custom orders by status
export const fetchCustomOrdersByStatus = async (startDate: string, endDate: string) => {
  const response = await axios.get(`${API_BASE_URL}/customorders/status`, {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

// Order Details
export const fetchOrderDetails = async (orderId: string) => {
  const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
  return response.data;
};