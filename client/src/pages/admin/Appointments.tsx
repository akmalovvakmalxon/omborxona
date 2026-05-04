import React, { useState } from 'react';
import {
  mockAppointments,
  mockDoctors,
  mockPatients } from
'../../data/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Filter } from 'lucide-react';
export function AdminAppointments() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDoctor =
    doctorFilter === 'all' || apt.doctorId === doctorFilter;
    return matchesStatus && matchesDoctor;
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Appointments</h1>
        <p className="text-slate-500 mt-1">
          View and filter all clinic appointments.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <Filter className="w-4 h-4" />
            Filters:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-primary-500 focus:border-primary-500 bg-white">
            
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-primary-500 focus:border-primary-500 bg-white">
            
            <option value="all">All Doctors</option>
            {mockDoctors.map((d) =>
            <option key={d.id} value={d.id}>
                {d.name}
              </option>
            )}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Date & Time</th>
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Doctor</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAppointments.length > 0 ?
              filteredAppointments.map((apt) => {
                const patient = mockPatients.find(
                  (p) => p.id === apt.patientId
                );
                const doctor = mockDoctors.find((d) => d.id === apt.doctorId);
                return (
                  <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        <div className="font-medium text-slate-900">
                          {apt.date}
                        </div>
                        <div className="text-xs">{apt.time}</div>
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
                  
                    No appointments found matching filters.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}