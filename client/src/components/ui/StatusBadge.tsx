import React from 'react';
interface StatusBadgeProps {
  status: string;
}
export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (s: string) => {
    switch (s.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyles(status)}`}>
      
      {status}
    </span>);

}