// src/crm/lib/products.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export async function fetchProducts(searchQuery = '') {
  const url = searchQuery ? `${baseURL}/crm/products?search=${searchQuery}` : `${baseURL}/crm/products`;
  const res = await axios.get(url);
  return res.data;
}

export async function createProduct(product: any) {
  const res = await axios.post(`${baseURL}/crm/products`, product);
  return res.data;
}

export async function updateProduct(id: number, product: any) {
  const res = await axios.put(`${baseURL}/crm/products/${id}`, product);
  return res.data;
}

export async function deleteProduct(id: number) {
  const res = await axios.delete(`${baseURL}/crm/products/${id}`);
  return res.data;
}
