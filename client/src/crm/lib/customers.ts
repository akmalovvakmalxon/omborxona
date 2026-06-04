// src/crm/lib/customers.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export async function fetchCustomers() {
  const res = await axios.get(`${baseURL}/crm/customers`);
  return res.data;
}

export async function createCustomer(customer: any) {
  const res = await axios.post(`${baseURL}/crm/customers`, customer);
  return res.data;
}

export async function updateCustomer(id: number, customer: any) {
  const res = await axios.put(`${baseURL}/crm/customers/${id}`, customer);
  return res.data;
}

export async function deleteCustomer(id: number) {
  const res = await axios.delete(`${baseURL}/crm/customers/${id}`);
  return res.data;
}
