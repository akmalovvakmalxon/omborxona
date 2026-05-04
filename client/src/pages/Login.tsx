import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Stethoscope, Lock, Mail } from 'lucide-react';
import { Role } from '../types';
export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Mock authentication logic
    if (email === 'admin@clinic.com' && password === 'admin123') {
      login(email, 'admin');
      navigate('/admin');
    } else if (email === 'doctor@clinic.com' && password === 'doctor123') {
      login(email, 'doctor');
      navigate('/doctor');
    } else if (email === 'cashier@clinic.com' && password === 'cashier123') {
      login(email, 'cashier');
      navigate('/cashier');
    } else {
      setError('Invalid email or password');
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary-600">
          <div className="p-3 bg-primary-100 rounded-full">
            <Stethoscope className="w-10 h-10" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Clinic CRM
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error &&
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            }

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700">
                
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2.5 border"
                  placeholder="admin@clinic.com" />
                
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700">
                
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-2.5 border"
                  placeholder="••••••••" />
                
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Demo Accounts
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-2 text-xs text-slate-500">
              <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                <span>Admin: admin@clinic.com</span>
                <span className="font-mono">admin123</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                <span>Doctor: doctor@clinic.com</span>
                <span className="font-mono">doctor123</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                <span>Cashier: cashier@clinic.com</span>
                <span className="font-mono">cashier123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}