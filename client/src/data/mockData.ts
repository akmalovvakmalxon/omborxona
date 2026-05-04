import { Doctor, Cashier, Patient, Appointment, Payment } from '../types';

export const mockDoctors: Doctor[] = [
{
  id: 'd1',
  name: 'Dr. Sarah Jenkins',
  specialty: 'Cardiology',
  phone: '+1 234-567-8901',
  email: 'sarah.j@clinic.com',
  schedule: 'Mon-Fri, 09:00-17:00'
},
{
  id: 'd2',
  name: 'Dr. Michael Chen',
  specialty: 'Pediatrics',
  phone: '+1 234-567-8902',
  email: 'michael.c@clinic.com',
  schedule: 'Mon-Wed, 08:00-14:00'
},
{
  id: 'd3',
  name: 'Dr. Emily Rodriguez',
  specialty: 'Dermatology',
  phone: '+1 234-567-8903',
  email: 'emily.r@clinic.com',
  schedule: 'Tue-Thu, 10:00-18:00'
}];


export const mockCashiers: Cashier[] = [
{
  id: 'c1',
  name: 'Alice Smith',
  phone: '+1 234-567-8911',
  email: 'alice.s@clinic.com'
},
{
  id: 'c2',
  name: 'Bob Johnson',
  phone: '+1 234-567-8912',
  email: 'bob.j@clinic.com'
}];


export const mockPatients: Patient[] = [
{
  id: 'p1',
  name: 'John Doe',
  phone: '+1 987-654-3210',
  dob: '1985-04-12',
  gender: 'Male',
  address: '123 Main St, City'
},
{
  id: 'p2',
  name: 'Jane Williams',
  phone: '+1 987-654-3211',
  dob: '1992-08-25',
  gender: 'Female',
  address: '456 Oak Ave, City'
},
{
  id: 'p3',
  name: 'Robert Brown',
  phone: '+1 987-654-3212',
  dob: '1978-11-05',
  gender: 'Male',
  address: '789 Pine Rd, City'
}];


export const mockAppointments: Appointment[] = [
{
  id: 'a1',
  patientId: 'p1',
  doctorId: 'd1',
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  status: 'confirmed'
},
{
  id: 'a2',
  patientId: 'p2',
  doctorId: 'd2',
  date: new Date().toISOString().split('T')[0],
  time: '10:30',
  status: 'pending'
},
{
  id: 'a3',
  patientId: 'p3',
  doctorId: 'd1',
  date: '2026-05-05',
  time: '14:00',
  status: 'confirmed'
},
{
  id: 'a4',
  patientId: 'p1',
  doctorId: 'd3',
  date: '2026-05-03',
  time: '11:00',
  status: 'completed',
  diagnosis: 'Mild rash',
  prescription: 'Topical cream 2x daily'
}];


export const mockPayments: Payment[] = [
{
  id: 'pay1',
  appointmentId: 'a1',
  patientId: 'p1',
  amount: 150,
  date: new Date().toISOString().split('T')[0],
  status: 'paid'
},
{
  id: 'pay2',
  appointmentId: 'a2',
  patientId: 'p2',
  amount: 100,
  date: new Date().toISOString().split('T')[0],
  status: 'pending'
},
{
  id: 'pay3',
  appointmentId: 'a4',
  patientId: 'p1',
  amount: 200,
  date: '2026-05-03',
  status: 'paid'
}];