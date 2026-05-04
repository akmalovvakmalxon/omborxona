import React from 'react';
import { StatsCard } from '../../components/ui/StatsCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Users, Calendar, CreditCard, Clock } from 'lucide-react';
import {
  mockAppointments,
  mockPatients,
  mockPayments } from
'../../data/mockData';
export function CashierDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter((a) => a.date === today);
  const pendingPayments = mockPayments.filter((p) => p.status === 'pending');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cashier Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Manage patients, appointments, and payments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar} />
        
        <StatsCard
          title="Pending Payments"
          value={pendingPayments.length}
          icon={Clock} />
        
        <StatsCard
          title="Total Patients"
          value={mockPatients.length}
          icon={Users} />
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Pending Payments
            </h2>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-slate-200">
              {pendingPayments.slice(0, 5).map((payment) => {
                const patient = mockPatients.find(
                  (p) => p.id === payment.patientId
                );
                return (
                  <li
                    key={payment.id}
                    className="px-6 py-4 flex justify-between items-center hover:bg-slate-50">
                    
                    <div>
                      <p className="font-medium text-slate-900">
                        {patient?.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        Date: {payment.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        ${payment.amount}
                      </p>
                      <StatusBadge status={payment.status} />
                    </div>
                  </li>);

              })}
              {pendingPayments.length === 0 &&
              <li className="px-6 py-8 text-center text-slate-500">
                  No pending payments.
                </li>
              }
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Today's Schedule
            </h2>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-slate-200">
              {todayAppointments.slice(0, 5).map((apt) => {
                const patient = mockPatients.find((p) => p.id === apt.patientId);
                return (
                  <li
                    key={apt.id}
                    className="px-6 py-4 flex justify-between items-center hover:bg-slate-50">
                    
                    <div>
                      <p className="font-medium text-slate-900">
                        {patient?.name}
                      </p>
                      <p className="text-sm text-slate-500">{apt.time}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </li>);

              })}
              {todayAppointments.length === 0 &&
              <li className="px-6 py-8 text-center text-slate-500">
                  No appointments today.
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </div>);

}