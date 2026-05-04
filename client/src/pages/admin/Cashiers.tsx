import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { mockCashiers } from '../../data/mockData';
import { Cashier } from '../../types';
import { Modal } from '../../components/ui/Modal';
export function AdminCashiers() {
  const [cashiers, setCashiers] = useState<Cashier[]>(mockCashiers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCashier, setEditingCashier] = useState<Cashier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
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
        email: cashier.email
      });
    } else {
      setEditingCashier(null);
      setFormData({
        name: '',
        phone: '',
        email: ''
      });
    }
    setIsModalOpen(true);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCashier) {
      setCashiers(
        cashiers.map((c) =>
        c.id === editingCashier.id ?
        {
          ...formData,
          id: c.id
        } :
        c
        )
      );
    } else {
      setCashiers([
      ...cashiers,
      {
        ...formData,
        id: `c${Date.now()}`
      }]
      );
    }
    setIsModalOpen(false);
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this cashier?')) {
      setCashiers(cashiers.filter((c) => c.id !== id));
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