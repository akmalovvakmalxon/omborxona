import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  LogOut,
  Stethoscope,
  UserCircle } from
'lucide-react';
interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const getNavItems = () => {
    if (!user) return [];
    switch (user.role) {
      case 'admin':
        return [
        {
          name: 'Dashboard',
          path: '/admin',
          icon: LayoutDashboard
        },
        {
          name: 'Doctors',
          path: '/admin/doctors',
          icon: Stethoscope
        },
        {
          name: 'Cashiers',
          path: '/admin/cashiers',
          icon: Users
        },
        {
          name: 'Appointments',
          path: '/admin/appointments',
          icon: Calendar
        }];

      case 'cashier':
        return [
        {
          name: 'Dashboard',
          path: '/cashier',
          icon: LayoutDashboard
        },
        {
          name: 'Patients',
          path: '/cashier/patients',
          icon: Users
        },
        {
          name: 'Create Appointment',
          path: '/cashier/appointment',
          icon: Calendar
        },
        {
          name: 'Payments',
          path: '/cashier/payments',
          icon: CreditCard
        }];

      case 'doctor':
        return [
        {
          name: 'Dashboard',
          path: '/doctor',
          icon: LayoutDashboard
        },
        {
          name: 'My Appointments',
          path: '/doctor/appointments',
          icon: Calendar
        }];

      default:
        return [];
    }
  };
  const navItems = getNavItems();
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Stethoscope className="w-6 h-6" />
            <span>ClinicCRM</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
            location.pathname === item.path ||
            item.path !== `/${user?.role}` &&
            location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                
                {item.name}
              </Link>);

          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <UserCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 truncate capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-primary-600 font-bold text-lg">
            <Stethoscope className="w-5 h-5" />
            <span>ClinicCRM</span>
          </div>
          <button onClick={handleLogout} className="text-slate-500">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </main>
    </div>);

}