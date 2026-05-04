import { Request, Response } from 'express';
import argon2 from 'argon2';
import pool from '../config/connection';

export const createDoctor = async (req: Request, res: Response): Promise<any> => {
    const { fullname, email, password, specialization, phone } = req.body;

    if (!fullname || !email || !password || !specialization || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Check if user exists
        const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Insert into users
        const userResult = await client.query(
            "INSERT INTO users (fullname, email, password, role) VALUES ($1, $2, $3, 'doctor') RETURNING id, fullname, email, role",
            [fullname, email, hashedPassword]
        );
        const newUser = userResult.rows[0];

        // Insert into doctors
        const doctorResult = await client.query(
            "INSERT INTO doctors (specialization, phone, user_id) VALUES ($1, $2, $3) RETURNING id, specialization, phone",
            [specialization, phone, newUser.id]
        );
        const newDoctor = doctorResult.rows[0];

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Doctor created successfully',
            doctor: { ...newUser, ...newDoctor }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};

export const createCashier = async (req: Request, res: Response): Promise<any> => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user exists
        const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Insert into users
        const result = await pool.query(
            "INSERT INTO users (fullname, email, password, role) VALUES ($1, $2, $3, 'cashier') RETURNING id, fullname, email, role",
            [fullname, email, hashedPassword]
        );

        res.status(201).json({
            message: 'Cashier created successfully',
            cashier: result.rows[0]
        });
    } catch (error) {
        console.error('Create cashier error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
