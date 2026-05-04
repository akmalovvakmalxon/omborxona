export type Role = 'admin' | 'doctor' | 'cashier';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  schedule: string; // e.g., "Mon-Fri, 09:00-17:00"
}

export interface Cashier {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
}

export type AppointmentStatus =
'pending' |
'confirmed' |
'completed' |
'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  diagnosis?: string;
  prescription?: string;
}

export type PaymentStatus = 'pending' | 'paid';

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}