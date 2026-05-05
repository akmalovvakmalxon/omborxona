import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { mockAppointments, mockPatients } from '../../data/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Appointment } from '../../types';
import { FileText, CheckCircle } from 'lucide-react';
export function DoctorAppointments() {
  const { user } = useAuthStore();
  const doctorId = user?.id.toString() || 'd1'; // Use logged in doctor ID
  const [appointments, setAppointments] = useState<Appointment[]>(
    mockAppointments.filter((a) => a.doctorId === doctorId)
  );
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const handleOpenModal = (apt: Appointment) => {
    setSelectedApt(apt);
    setDiagnosis(apt.diagnosis || '');
    setPrescription(apt.prescription || '');
    setIsModalOpen(true);
  };
  const handleSaveMedicalRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApt) return;
    setAppointments(
      appointments.map((apt) =>
      apt.id === selectedApt.id ?
      {
        ...apt,
        diagnosis,
        prescription,
        status: 'completed'
      } :
      apt
      )
    );
    setIsModalOpen(false);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
        <p className="text-slate-500 mt-1">
          View your schedule and write medical records.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Date & Time</th>
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {appointments.
              sort(
                (a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
              ).
              map((apt) => {
                const patient = mockPatients.find(
                  (p) => p.id === apt.patientId
                );
                return (
                  <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        <div className="font-medium text-slate-900">
                          {apt.date}
                        </div>
                        <div className="text-xs">{apt.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        <div className="font-medium text-slate-900">
                          {patient?.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          DOB: {patient?.dob}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                        onClick={() => handleOpenModal(apt)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-md transition-colors">
                        
                          <FileText className="w-4 h-4" />
                          {apt.status === 'completed' ?
                        'View Record' :
                        'Write Record'}
                        </button>
                      </td>
                    </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Medical Record">
        
        {selectedApt &&
        <form onSubmit={handleSaveMedicalRecord} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">Patient:</span>{' '}
                {mockPatients.find((p) => p.id === selectedApt.patientId)?.name}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-900">Date:</span>{' '}
                {selectedApt.date} at {selectedApt.time}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Diagnosis
              </label>
              <textarea
              required
              rows={3}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter patient diagnosis..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
              disabled={selectedApt.status === 'completed'} />
            
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prescription
              </label>
              <textarea
              required
              rows={3}
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Enter medication and dosage instructions..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
              disabled={selectedApt.status === 'completed'} />
            
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              
                Close
              </button>
              {selectedApt.status !== 'completed' &&
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              
                  <CheckCircle className="w-4 h-4" />
                  Complete Appointment
                </button>
            }
            </div>
          </form>
        }
      </Modal>
    </div>);

}