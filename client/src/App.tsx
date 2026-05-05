import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminDoctors } from './pages/admin/Doctors';
import { AdminCashiers } from './pages/admin/Cashiers';
import { AdminAppointments } from './pages/admin/Appointments';
// Cashier Pages
import { CashierDashboard } from './pages/cashier/Dashboard';
import { CashierPatients } from './pages/cashier/Patients';
import { CreateAppointment } from './pages/cashier/CreateAppointment';
import { CashierPayments } from './pages/cashier/Payments';
// Doctor Pages
import { DoctorDashboard } from './pages/doctor/Dashboard';
import { DoctorAppointments } from './pages/doctor/MyAppointments';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRole="admin">
              <Layout>
                <AdminDoctors />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cashiers"
          element={
            <ProtectedRoute allowedRole="admin">
              <Layout>
                <AdminCashiers />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRole="admin">
              <Layout>
                <AdminAppointments />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* Cashier Routes */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute allowedRole="cashier">
              <Layout>
                <CashierDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cashier/patients"
          element={
            <ProtectedRoute allowedRole="cashier">
              <Layout>
                <CashierPatients />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cashier/appointment"
          element={
            <ProtectedRoute allowedRole="cashier">
              <Layout>
                <CreateAppointment />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cashier/payments"
          element={
            <ProtectedRoute allowedRole="cashier">
              <Layout>
                <CashierPayments />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRole="doctor">
              <Layout>
                <DoctorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRole="doctor">
              <Layout>
                <DoctorAppointments />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}