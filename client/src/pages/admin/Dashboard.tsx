import React, { useState } from 'react';
import { StatsCard } from '../../components/ui/StatsCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Users, Stethoscope, Calendar, UserPlus } from 'lucide-react';
import {
  mockDoctors,
  mockCashiers,
  mockAppointments,
  mockPatients } from
'../../data/mockData';
export function AdminDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = mockAppointments.filter((a) => a.date === today);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overview of clinic operations and staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Doctors"
          value={mockDoctors.length}
          icon={Stethoscope} />
        
        <StatsCard
          title="Total Cashiers"
          value={mockCashiers.length}
          icon={Users} />
        
        <StatsCard
          title="Appointments Today"
          value={todayAppointments.length}
          icon={Calendar} />
        
        <StatsCard
          title="Total Patients"
          value={mockPatients.length}
          icon={UserPlus} />
        
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Today's Appointments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Doctor</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {todayAppointments.length > 0 ?
              todayAppointments.map((apt) => {
                const patient = mockPatients.find(
                  (p) => p.id === apt.patientId
                );
                const doctor = mockDoctors.find((d) => d.id === apt.doctorId);
                return (
                  <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                        {apt.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {patient?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {doctor?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={apt.status} />
                      </td>
                    </tr>);

              }) :

              <tr>
                  <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500">
                  
                    No appointments scheduled for today.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}