import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Cashier } from '../../types';
import { Modal } from '../../components/ui/Modal';
import api from '../../utils/api';

export function AdminCashiers() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCashier, setEditingCashier] = useState<Cashier | null>(null);

  useEffect(() => {
    const fetchCashiers = async () => {
      try {
        const response = await api.get('/admin/cashiers');
        const fetchedCashiers: Cashier[] = response.data.cashiers.map((c: any) => ({
          id: String(c.id),
          name: c.fullname,
          email: c.email,
          phone: c.phone || 'N/A'
        }));
        setCashiers(fetchedCashiers);
      } catch (error) {
        console.error('Failed to fetch cashiers:', error);
      }
    };
    fetchCashiers();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const filteredCashiers = cashiers.filter((c) =>
  c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleOpenModal = (cashier?: Cashier) => {
    if (cashier) {
      setEditingCashier(cashier);
      setFormData({
        name: cashier.name,
        phone: cashier.phone,
        email: cashier.email,
        password: ''
      });
    } else {
      setEditingCashier(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        password: ''
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCashier) {
        await api.put(`/admin/cashiers/${editingCashier.id}`, {
          fullname: formData.name,
          email: formData.email,
          password: formData.password || undefined
        });
        setCashiers(
          cashiers.map((c) =>
          c.id === editingCashier.id ?
          {
            ...c,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          } :
          c
          )
        );
      } else {
        const response = await api.post('/admin/cashiers', {
          fullname: formData.name,
          email: formData.email,
          password: formData.password
        });
        const newCashierData = response.data.cashier;
        setCashiers([
        ...cashiers,
        {
          id: String(newCashierData.id || `c${Date.now()}`),
          name: newCashierData.fullname || formData.name,
          email: newCashierData.email || formData.email,
          phone: formData.phone
        }]
        );
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save cashier:', error);
      alert(error.response?.data?.message || 'Failed to save cashier');
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this cashier?')) {
      try {
        await api.delete(`/admin/cashiers/${id}`);
        setCashiers(cashiers.filter((c) => c.id !== id));
      } catch (error: any) {
        console.error('Failed to delete cashier:', error);
        alert(error.response?.data?.message || 'Failed to delete cashier');
      }
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cashiers</h1>
          <p className="text-slate-500 mt-1">
            Manage clinic cashiers and receptionists.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
          
          <Plus className="w-4 h-4" />
          Add Cashier
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
              placeholder="Search cashiers..."
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
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCashiers.map((cashier) =>
              <tr key={cashier.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    {cashier.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {cashier.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {cashier.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                    onClick={() => handleOpenModal(cashier)}
                    className="text-primary-600 hover:text-primary-900 mr-3">
                    
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                    onClick={() => handleDelete(cashier.id)}
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
        title={editingCashier ? 'Edit Cashier' : 'Add New Cashier'}>
        
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
              Password {editingCashier && "(Leave blank to keep current)"}
            </label>
            <input
              required={!editingCashier}
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
              
              {editingCashier ? 'Save Changes' : 'Add Cashier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>);

}