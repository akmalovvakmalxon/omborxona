import { Request, Response } from 'express';
import pool from '../config/connection';

export const createPatient = async (req: Request, res: Response): Promise<any> => {
    const { name, age, phone } = req.body;

    if (!name || !age || !phone) {
        return res.status(400).json({ message: 'All fields (name, age, phone) are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO patients (name, age, phone) VALUES ($1, $2, $3) RETURNING id, name, age, phone',
            [name, age, phone]
        );

        res.status(201).json({
            message: 'Patient created successfully',
            patient: result.rows[0]
        });
    } catch (error) {
        console.error('Create patient error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createAppointment = async (req: Request, res: Response): Promise<any> => {
    const { doctor_id, patient_id, appointment_time } = req.body;

    if (!doctor_id || !patient_id || !appointment_time) {
        return res.status(400).json({ message: 'doctor_id, patient_id, and appointment_time are required' });
    }

    try {
        // Validate if doctor exists
        const doctorCheck = await pool.query('SELECT id FROM doctors WHERE id = $1', [doctor_id]);
        if (doctorCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Validate if patient exists
        const patientCheck = await pool.query('SELECT id FROM patients WHERE id = $1', [patient_id]);
        if (patientCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Insert appointment
        const result = await pool.query(
            'INSERT INTO appointment (doctor_id, patient_id, appointment_time) VALUES ($1, $2, $3) RETURNING id, doctor_id, patient_id, appointment_time',
            [doctor_id, patient_id, appointment_time]
        );

        res.status(201).json({
            message: 'Appointment created successfully',
            appointment: result.rows[0]
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createPayment = async (req: Request, res: Response): Promise<any> => {
    const { appointment_id, amount, status } = req.body;

    if (!appointment_id || amount === undefined || !status) {
        return res.status(400).json({ message: 'appointment_id, amount, and status are required' });
    }

    try {
        // Validate if appointment exists
        const appointmentCheck = await pool.query('SELECT id FROM appointment WHERE id = $1', [appointment_id]);
        if (appointmentCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if a payment already exists for this appointment (One-to-One rule)
        const paymentCheck = await pool.query('SELECT id FROM payment WHERE appointment_id = $1', [appointment_id]);
        if (paymentCheck.rows.length > 0) {
            return res.status(409).json({ message: 'Payment already exists for this appointment' });
        }

        const result = await pool.query(
            'INSERT INTO payment (appointment_id, amount, status) VALUES ($1, $2, $3) RETURNING id, appointment_id, amount, status',
            [appointment_id, amount, status]
        );

        res.status(201).json({
            message: 'Payment recorded successfully',
            payment: result.rows[0]
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Helpful endpoints for Cashier to get lists when creating appointments
export const getPatients = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await pool.query('SELECT * FROM patients ORDER BY id DESC');
        res.status(200).json({ patients: result.rows });
    } catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getDoctorsList = async (req: Request, res: Response): Promise<any> => {
    try {
        const query = `
            SELECT d.id as doctor_id, u.fullname as doctor_name, d.specialization 
            FROM doctors d
            JOIN users u ON d.user_id = u.id
        `;
        const result = await pool.query(query);
        res.status(200).json({ doctors: result.rows });
    } catch (error) {
        console.error('Get doctors list error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
