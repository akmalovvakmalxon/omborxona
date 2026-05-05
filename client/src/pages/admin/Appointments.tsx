import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Filter } from 'lucide-react';
import api from '../../utils/api';

interface FetchedAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  doctorId: string;
  date: string;
  time: string;
  status: any;
}
export function AdminAppointments() {
  const [appointments, setAppointments] = useState<FetchedAppointment[]>([]);
  const [doctors, setDoctors] = useState<{id: string, name: string}[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/appointments');
        const fetched = res.data.appointments.map((a: any) => {
          const dt = new Date(a.appointment_time);
          return {
            id: String(a.appointment_id),
            patientName: a.patient_name,
            doctorName: a.doctor_name,
            doctorId: String(a.doctor_id),
            date: dt.toLocaleDateString(),
            time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'confirmed'
          };
        });
        setAppointments(fetched);

        const docRes = await api.get('/admin/doctors');
        setDoctors(docRes.data.doctors.map((d: any) => ({
          id: String(d.doctor_id),
          name: d.fullname
        })));
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };
    fetchData();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === 'all' || apt.doctorId === doctorFilter;
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
            {doctors.map((d) =>
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
                return (
                  <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        <div className="font-medium text-slate-900">
                          {apt.date}
                        </div>
                        <div className="text-xs">{apt.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {apt.patientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {apt.doctorName}
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