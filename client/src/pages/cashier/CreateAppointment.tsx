import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  mockDoctors,
  mockPatients,
  mockAppointments } from
'../../data/mockData';
import { TimeSlotPicker } from '../../components/ui/TimeSlotPicker';
import { Calendar, User, Stethoscope } from 'lucide-react';
const ALL_TIME_SLOTS = [
'09:00',
'09:30',
'10:00',
'10:30',
'11:00',
'11:30',
'13:00',
'13:30',
'14:00',
'14:30',
'15:00',
'15:30',
'16:00',
'16:30'];

export function CreateAppointment() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string | null>(null);
  // Calculate booked slots for selected doctor and date
  const bookedSlots = useMemo(() => {
    if (!doctorId || !date) return [];
    return mockAppointments.
    filter(
      (apt) =>
      apt.doctorId === doctorId &&
      apt.date === date &&
      apt.status !== 'cancelled'
    ).
    map((apt) => apt.time);
  }, [doctorId, date]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !date || !time) {
      alert('Please fill in all fields');
      return;
    }
    // In a real app, we would save this to the backend
    console.log('Creating appointment:', {
      patientId,
      doctorId,
      date,
      time
    });
    alert('Appointment created successfully!');
    navigate('/cashier');
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Create Appointment
        </h1>
        <p className="text-slate-500 mt-1">
          Schedule a new visit for a patient.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900 mb-2">
              <User className="w-4 h-4 text-slate-500" />
              Select Patient
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 bg-white"
              required>
              
              <option value="" disabled>
                Choose a patient...
              </option>
              {mockPatients.map((p) =>
              <option key={p.id} value={p.id}>
                  {p.name} ({p.phone})
                </option>
              )}
            </select>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900 mb-2">
              <Stethoscope className="w-4 h-4 text-slate-500" />
              Select Doctor
            </label>
            <select
              value={doctorId}
              onChange={(e) => {
                setDoctorId(e.target.value);
                setTime(null); // Reset time when doctor changes
              }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 bg-white"
              required>
              
              <option value="" disabled>
                Choose a doctor...
              </option>
              {mockDoctors.map((d) =>
              <option key={d.id} value={d.id}>
                  {d.name} - {d.specialty}
                </option>
              )}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-900 mb-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Select Date
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setDate(e.target.value);
                setTime(null); // Reset time when date changes
              }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-primary-500 focus:border-primary-500"
              required />
            
          </div>

          {/* Time Slot Selection */}
          {doctorId && date &&
          <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-medium text-slate-900 mb-3">
                Available Time Slots
              </label>
              <TimeSlotPicker
              availableSlots={ALL_TIME_SLOTS}
              bookedSlots={bookedSlots}
              selectedSlot={time}
              onSelectSlot={setTime} />
            
              {!time &&
            <p className="text-sm text-red-500 mt-2">
                  Please select a time slot.
                </p>
            }
            </div>
          }

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/cashier')}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              
              Cancel
            </button>
            <button
              type="submit"
              disabled={!patientId || !doctorId || !date || !time}
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
              
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>);

}