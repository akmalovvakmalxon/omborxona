// src/crm/lib/suppliers.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export async function fetchSuppliers() {
  const res = await axios.get(`${baseURL}/crm/suppliers`);
  return res.data;
}

export async function createSupplier(supplier: any) {
  const res = await axios.post(`${baseURL}/crm/suppliers`, supplier);
  return res.data;
}

export async function updateSupplier(id: number, supplier: any) {
  const res = await axios.put(`${baseURL}/crm/suppliers/${id}`, supplier);
  return res.data;
}

export async function deleteSupplier(id: number) {
  const res = await axios.delete(`${baseURL}/crm/suppliers/${id}`);
  return res.data;
}
