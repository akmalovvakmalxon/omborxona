import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Doctor } from '../../types';
import { Modal } from '../../components/ui/Modal';
import api from '../../utils/api';

export function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/admin/doctors');
        const fetchedDoctors: Doctor[] = response.data.doctors.map((d: any) => ({
          id: String(d.doctor_id),
          name: d.fullname,
          specialty: d.specialization,
          phone: d.phone,
          email: d.email,
          schedule: 'TBD'
        }));
        setDoctors(fetchedDoctors);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    password: '',
    schedule: ''
  });
  const filteredDoctors = doctors.filter(
    (d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleOpenModal = (doctor?: Doctor) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        specialty: doctor.specialty,
        phone: doctor.phone,
        email: doctor.email,
        password: '',
        schedule: doctor.schedule
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        name: '',
        specialty: '',
        phone: '',
        email: '',
        password: '',
        schedule: ''
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await api.put(`/admin/doctors/${editingDoctor.id}`, {
          fullname: formData.name,
          email: formData.email,
          password: formData.password || undefined,
          specialization: formData.specialty,
          phone: formData.phone
        });
        setDoctors(
          doctors.map((d) =>
          d.id === editingDoctor.id ?
          {
            ...d,
            name: formData.name,
            specialty: formData.specialty,
            phone: formData.phone,
            email: formData.email,
            schedule: formData.schedule
          } :
          d
          )
        );
      } else {
        const response = await api.post('/admin/doctors', {
          fullname: formData.name,
          email: formData.email,
          password: formData.password,
          specialization: formData.specialty,
          phone: formData.phone
        });
        const newDoctorData = response.data.doctor;
        setDoctors([
        ...doctors,
        {
          id: String(newDoctorData.id || `d${Date.now()}`),
          name: newDoctorData.fullname || formData.name,
          specialty: newDoctorData.specialization || formData.specialty,
          phone: newDoctorData.phone || formData.phone,
          email: newDoctorData.email || formData.email,
          schedule: formData.schedule
        }]
        );
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save doctor:', error);
      alert(error.response?.data?.message || 'Failed to save doctor');
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/admin/doctors/${id}`);
        setDoctors(doctors.filter((d) => d.id !== id));
      } catch (error: any) {
        console.error('Failed to delete doctor:', error);
        alert(error.response?.data?.message || 'Failed to delete doctor');
      }
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctors</h1>
          <p className="text-slate-500 mt-1">
            Manage clinic doctors and their schedules.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          
          <Plus className="w-4 h-4" />
          Add Doctor
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
              placeholder="Search doctors..."
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
                <th className="px-6 py-3 font-medium">Specialty</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Schedule</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDoctors.map((doctor) =>
              <tr key={doctor.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    {doctor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium">
                      {doctor.specialty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    <div className="flex flex-col">
                      <span>{doctor.email}</span>
                      <span className="text-xs text-slate-400">
                        {doctor.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {doctor.schedule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                    onClick={() => handleOpenModal(doctor)}
                    className="text-primary-600 hover:text-primary-900 mr-3">
                    
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                    onClick={() => handleDelete(doctor.id)}
                    className="text-red-600 hover:text-red-900">
                    
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}>
        
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Specialty
            </label>
            <input
              required
              type="text"
              value={formData.specialty}
              onChange={(e) =>
              setFormData({
                ...formData,
                specialty: e.target.value
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
                Email
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
              
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password {editingDoctor && "(Leave blank to keep current)"}
              </label>
              <input
                required={!editingDoctor}
                type="password"
                value={formData.password}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value
                })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Schedule
              </label>
              <input
                required
                type="text"
                placeholder="e.g., Mon-Fri, 09:00-17:00"
                value={formData.schedule}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  schedule: e.target.value
                })
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500" />
            </div>
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
              
              {editingDoctor ? 'Save Changes' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>);

}