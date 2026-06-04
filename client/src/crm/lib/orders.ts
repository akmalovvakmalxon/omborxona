// src/crm/lib/orders.ts
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export async function fetchOrders() {
  const res = await axios.get(`${baseURL}/crm/orders`);
  return res.data;
}

export async function createOrderWithItems(customerId: number, status: string, items: any[]) {
  const res = await axios.post(`${baseURL}/crm/orders`, {
    customer_id: customerId,
    status,
    items
  });
  return res.data;
}

export async function updateOrderStatus(id: number, status: string) {
  const res = await axios.put(`${baseURL}/crm/orders/${id}/status`, { status });
  return res.data;
}

export async function deleteOrder(id: number) {
  const res = await axios.delete(`${baseURL}/crm/orders/${id}`);
  return res.data;
}

// Yordamchi hisoblash
export function calculateOrderTotal(orderItems: any[]) {
  if (!orderItems) return 0;
  return orderItems.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
}
