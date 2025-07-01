import axios from 'axios';

interface CustomerResponse {
  customers: any[];
  total: number;
  page: number;
  totalPages: number;
}

export const fetchCustomers = async (
  page: number,
  limit: number,
  search: string = ''
): Promise<CustomerResponse> => {
  const response = await axios.get('/api/customerinfo', {
    params: { page, limit, search }
  });
  return response.data;
};

//fetch a single customer by ID
export const getCustomer = async (id: number): Promise<any> => {
  const response = await axios.get(`/api/customerinfo/${id}`);
  return response.data;
};