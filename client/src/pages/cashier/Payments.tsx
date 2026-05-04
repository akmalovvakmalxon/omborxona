import React, { useState } from 'react';
import { mockPayments, mockPatients } from '../../data/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Payment } from '../../types';
export function CashierPayments() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const handleMarkAsPaid = (paymentId: string) => {
    setPayments(
      payments.map((p) =>
      p.id === paymentId ?
      {
        ...p,
        status: 'paid'
      } :
      p
      )
    );
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="text-slate-500 mt-1">
          Manage patient payments and billing.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.map((payment) => {
                const patient = mockPatients.find(
                  (p) => p.id === payment.patientId
                );
                return (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                      {patient?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                      ${payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {payment.status === 'pending' &&
                      <button
                        onClick={() => handleMarkAsPaid(payment.id)}
                        className="text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1 rounded-md transition-colors">
                        
                          Mark as Paid
                        </button>
                      }
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}