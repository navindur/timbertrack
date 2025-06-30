import axios from 'axios';
import { Supplier } from '../types/supplier';

const BASE_URL = 'http://localhost:5000/api/suppliers';

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createSupplier = async (supplier: Supplier): Promise<Supplier> => {
  const response = await axios.post(BASE_URL, supplier);
  return response.data;
};

export const updateSupplier = async (id: number, supplier: Supplier): Promise<Supplier> => {
  const response = await axios.put(`${BASE_URL}/${id}`, supplier);
  return response.data;
};

export const deleteSupplier = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};