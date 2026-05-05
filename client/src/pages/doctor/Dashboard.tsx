import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { StatsCard } from '../../components/ui/StatsCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Calendar, Users, Clock } from 'lucide-react';
import {
  mockAppointments,
  mockPatients,
  mockDoctors } from
'../../data/mockData';
export function DoctorDashboard() {
  const { user } = useAuthStore();
  // In a real app, we'd fetch the doctor ID based on the logged-in user.
  // For mock purposes, we'll assume the doctor is 'd1' (Dr. Sarah Jenkins)
  const doctorId = 'd1';
  const doctorInfo = mockDoctors.find((d) => d.id === doctorId);
  const today = new Date().toISOString().split('T')[0];
  const myAppointments = mockAppointments.filter((a) => a.doctorId === doctorId);
  const todayAppointments = myAppointments.filter((a) => a.date === today);
  const pendingAppointments = myAppointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed'
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {doctorInfo?.name}
        </h1>
        <p className="text-slate-500 mt-1">
          Here is your schedule and patient overview for today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar} />
        
        <StatsCard
          title="Upcoming/Pending"
          value={pendingAppointments.length}
          icon={Clock} />
        
        <StatsCard
          title="Total Patients Seen"
          value={new Set(myAppointments.map((a) => a.patientId)).size}
          icon={Users} />
        
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Today's Schedule
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {todayAppointments.length > 0 ?
              todayAppointments.
              sort((a, b) => a.time.localeCompare(b.time)).
              map((apt) => {
                const patient = mockPatients.find(
                  (p) => p.id === apt.patientId
                );
                return (
                  <tr key={apt.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                          {apt.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                          {patient?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={apt.status} />
                        </td>
                      </tr>);

              }) :

              <tr>
                  <td
                  colSpan={3}
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