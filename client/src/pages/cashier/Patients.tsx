import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { mockPatients } from '../../data/mockData';
import { Patient } from '../../types';
import { Modal } from '../../components/ui/Modal';
export function CashierPatients() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    address: ''
  });
  const filteredPatients = patients.filter(
    (p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatients([
    ...patients,
    {
      ...formData,
      id: `p${Date.now()}`
    }]
    );
    setIsModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      dob: '',
      gender: 'Male',
      address: ''
    });
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-slate-500 mt-1">
            Manage patient records and information.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          
          <Plus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500" />
            
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">DOB / Gender</th>
                <th className="px-6 py-3 font-medium">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPatients.map((patient) =>
              <tr key={patient.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {patient.dob} <span className="text-slate-400 mx-1">|</span>{' '}
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                    {patient.address}
                  </td>
                </tr>
              )}
              {filteredPatients.length === 0 &&
              <tr>
                  <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500">
                  
                    No patients found.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Patient">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value
              })
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
            
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                required
                type="text"
                value={formData.phone}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value
                })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                required
                type="date"
                value={formData.dob}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  dob: e.target.value
                })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
              
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value as any
              })
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500">
              
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <textarea
              required
              rows={2}
              value={formData.address}
              onChange={(e) =>
              setFormData({
                ...formData,
                address: e.target.value
              })
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
            
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              
              Add Patient
            </button>
          </div>
        </form>
      </Modal>
    </div>);

}