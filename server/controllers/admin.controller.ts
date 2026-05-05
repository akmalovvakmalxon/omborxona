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

// --- DOCTORS CRUD ---

export const getDoctors = async (req: Request, res: Response): Promise<any> => {
    try {
        const query = `
            SELECT d.id as doctor_id, d.specialization, d.phone, u.id as user_id, u.fullname, u.email, u.role
            FROM doctors d
            JOIN users u ON d.user_id = u.id
        `;
        const result = await pool.query(query);
        res.status(200).json({ doctors: result.rows });
    } catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateDoctor = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; // doctor_id
    const { fullname, email, password, specialization, phone } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if doctor exists and get user_id
        const doctorCheck = await client.query('SELECT user_id FROM doctors WHERE id = $1', [id]);
        if (doctorCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const userId = doctorCheck.rows[0].user_id;

        // Update users table
        if (fullname || email || password) {
            let updateQueries = [];
            let values = [];
            let index = 1;

            if (fullname) { updateQueries.push(`fullname = $${index++}`); values.push(fullname); }
            if (email) { updateQueries.push(`email = $${index++}`); values.push(email); }
            if (password) {
                const hashedPassword = await argon2.hash(password);
                updateQueries.push(`password = $${index++}`); values.push(hashedPassword);
            }

            if (updateQueries.length > 0) {
                values.push(userId);
                await client.query(
                    `UPDATE users SET ${updateQueries.join(', ')} WHERE id = $${index}`,
                    values
                );
            }
        }

        // Update doctors table
        if (specialization || phone) {
            let updateQueries = [];
            let values = [];
            let index = 1;

            if (specialization) { updateQueries.push(`specialization = $${index++}`); values.push(specialization); }
            if (phone) { updateQueries.push(`phone = $${index++}`); values.push(phone); }

            if (updateQueries.length > 0) {
                values.push(id);
                await client.query(
                    `UPDATE doctors SET ${updateQueries.join(', ')} WHERE id = $${index}`,
                    values
                );
            }
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'Doctor updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Update doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};

export const deleteDoctor = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; // doctor_id

    try {
        // Get user_id first
        const doctorCheck = await pool.query('SELECT user_id FROM doctors WHERE id = $1', [id]);
        if (doctorCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        const userId = doctorCheck.rows[0].user_id;
        
        // Deleting the user will cascade and delete the doctor because of ON DELETE CASCADE
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);

        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error('Delete doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// --- CASHIERS CRUD ---

export const getCashiers = async (req: Request, res: Response): Promise<any> => {
    try {
        const result = await pool.query("SELECT id, fullname, email, role FROM users WHERE role = 'cashier'");
        res.status(200).json({ cashiers: result.rows });
    } catch (error) {
        console.error('Get cashiers error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCashier = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; // user_id
    const { fullname, email, password } = req.body;

    try {
        // Check if cashier exists
        const check = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'cashier'", [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ message: 'Cashier not found' });
        }

        let updateQueries = [];
        let values = [];
        let index = 1;

        if (fullname) { updateQueries.push(`fullname = $${index++}`); values.push(fullname); }
        if (email) { updateQueries.push(`email = $${index++}`); values.push(email); }
        if (password) {
            const hashedPassword = await argon2.hash(password);
            updateQueries.push(`password = $${index++}`); values.push(hashedPassword);
        }

        if (updateQueries.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        values.push(id);
        const result = await pool.query(
            `UPDATE users SET ${updateQueries.join(', ')} WHERE id = $${index} RETURNING id, fullname, email, role`,
            values
        );

        res.status(200).json({
            message: 'Cashier updated successfully',
            cashier: result.rows[0]
        });
    } catch (error) {
        console.error('Update cashier error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteCashier = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; // user_id

    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1 AND role = 'cashier' RETURNING id", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cashier not found' });
        }

        res.status(200).json({ message: 'Cashier deleted successfully' });
    } catch (error) {
        console.error('Delete cashier error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
