"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorSchedule = exports.addDoctorSchedule = exports.getAppointments = exports.deleteCashier = exports.updateCashier = exports.getCashiers = exports.deleteDoctor = exports.updateDoctor = exports.getDoctors = exports.createCashier = exports.createDoctor = void 0;
const argon2_1 = __importDefault(require("argon2"));
const connection_1 = __importDefault(require("../config/connection"));
const createDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, specialization, phone } = req.body;
    if (!fullname || !email || !password || !specialization || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const client = yield connection_1.default.connect();
    try {
        yield client.query('BEGIN');
        // Check if user exists
        const userCheck = yield client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            yield client.query('ROLLBACK');
            return res.status(409).json({ message: 'User with this email already exists' });
        }
        // Hash password
        const hashedPassword = yield argon2_1.default.hash(password);
        // Insert into users
        const userResult = yield client.query("INSERT INTO users (fullname, email, password, role) VALUES ($1, $2, $3, 'doctor') RETURNING id, fullname, email, role", [fullname, email, hashedPassword]);
        const newUser = userResult.rows[0];
        // Insert into doctors
        const doctorResult = yield client.query("INSERT INTO doctors (specialization, phone, user_id) VALUES ($1, $2, $3) RETURNING id, specialization, phone", [specialization, phone, newUser.id]);
        const newDoctor = doctorResult.rows[0];
        yield client.query('COMMIT');
        res.status(201).json({
            message: 'Doctor created successfully',
            doctor: Object.assign(Object.assign({}, newUser), newDoctor)
        });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Create doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
exports.createDoctor = createDoctor;
const createCashier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // Check if user exists
        const userCheck = yield connection_1.default.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }
        // Hash password
        const hashedPassword = yield argon2_1.default.hash(password);
        // Insert into users
        const result = yield connection_1.default.query("INSERT INTO users (fullname, email, password, role) VALUES ($1, $2, $3, 'cashier') RETURNING id, fullname, email, role", [fullname, email, hashedPassword]);
        res.status(201).json({
            message: 'Cashier created successfully',
            cashier: result.rows[0]
        });
    }
    catch (error) {
        console.error('Create cashier error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createCashier = createCashier;
// --- DOCTORS CRUD ---
const getDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
            SELECT d.id as doctor_id, d.specialization, d.phone, u.id as user_id, u.fullname, u.email, u.role
            FROM doctors d
            JOIN users u ON d.user_id = u.id
        `;
        const result = yield connection_1.default.query(query);
        res.status(200).json({ doctors: result.rows });
    }
    catch (error) {
        console.error('Get doctors error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getDoctors = getDoctors;
const updateDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // doctor_id
    const { fullname, email, password, specialization, phone } = req.body;
    const client = yield connection_1.default.connect();
    try {
        yield client.query('BEGIN');
        // Check if doctor exists and get user_id
        const doctorCheck = yield client.query('SELECT user_id FROM doctors WHERE id = $1', [id]);
        if (doctorCheck.rows.length === 0) {
            yield client.query('ROLLBACK');
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const userId = doctorCheck.rows[0].user_id;
        // Update users table
        if (fullname || email || password) {
            let updateQueries = [];
            let values = [];
            let index = 1;
            if (fullname) {
                updateQueries.push(`fullname = $${index++}`);
                values.push(fullname);
            }
            if (email) {
                updateQueries.push(`email = $${index++}`);
                values.push(email);
            }
            if (password) {
                const hashedPassword = yield argon2_1.default.hash(password);
                updateQueries.push(`password = $${index++}`);
                values.push(hashedPassword);
            }
            if (updateQueries.length > 0) {
                values.push(userId);
                yield client.query(`UPDATE users SET ${updateQueries.join(', ')} WHERE id = $${index}`, values);
            }
        }
        // Update doctors table
        if (specialization || phone) {
            let updateQueries = [];
            let values = [];
            let index = 1;
            if (specialization) {
                updateQueries.push(`specialization = $${index++}`);
                values.push(specialization);
            }
            if (phone) {
                updateQueries.push(`phone = $${index++}`);
                values.push(phone);
            }
            if (updateQueries.length > 0) {
                values.push(id);
                yield client.query(`UPDATE doctors SET ${updateQueries.join(', ')} WHERE id = $${index}`, values);
            }
        }
        yield client.query('COMMIT');
        res.status(200).json({ message: 'Doctor updated successfully' });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Update doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
exports.updateDoctor = updateDoctor;
const deleteDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // doctor_id
    try {
        // Get user_id first
        const doctorCheck = yield connection_1.default.query('SELECT user_id FROM doctors WHERE id = $1', [id]);
        if (doctorCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const userId = doctorCheck.rows[0].user_id;
        // Deleting the user will cascade and delete the doctor because of ON DELETE CASCADE
        yield connection_1.default.query('DELETE FROM users WHERE id = $1', [userId]);
        res.status(200).json({ message: 'Doctor deleted successfully' });
    }
    catch (error) {
        console.error('Delete doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteDoctor = deleteDoctor;
// --- CASHIERS CRUD ---
const getCashiers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.query("SELECT id, fullname, email, role FROM users WHERE role = 'cashier'");
        res.status(200).json({ cashiers: result.rows });
    }
    catch (error) {
        console.error('Get cashiers error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getCashiers = getCashiers;
const updateCashier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // user_id
    const { fullname, email, password } = req.body;
    try {
        // Check if cashier exists
        const check = yield connection_1.default.query("SELECT id FROM users WHERE id = $1 AND role = 'cashier'", [id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ message: 'Cashier not found' });
        }
        let updateQueries = [];
        let values = [];
        let index = 1;
        if (fullname) {
            updateQueries.push(`fullname = $${index++}`);
            values.push(fullname);
        }
        if (email) {
            updateQueries.push(`email = $${index++}`);
            values.push(email);
        }
        if (password) {
            const hashedPassword = yield argon2_1.default.hash(password);
            updateQueries.push(`password = $${index++}`);
            values.push(hashedPassword);
        }
        if (updateQueries.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }
        values.push(id);
        const result = yield connection_1.default.query(`UPDATE users SET ${updateQueries.join(', ')} WHERE id = $${index} RETURNING id, fullname, email, role`, values);
        res.status(200).json({
            message: 'Cashier updated successfully',
            cashier: result.rows[0]
        });
    }
    catch (error) {
        console.error('Update cashier error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateCashier = updateCashier;
const deleteCashier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // user_id
    try {
        const result = yield connection_1.default.query("DELETE FROM users WHERE id = $1 AND role = 'cashier' RETURNING id", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cashier not found' });
        }
        res.status(200).json({ message: 'Cashier deleted successfully' });
    }
    catch (error) {
        console.error('Delete cashier error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteCashier = deleteCashier;
// --- APPOINTMENTS ---
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
            SELECT 
                a.id as appointment_id,
                a.appointment_time,
                p.id as patient_id,
                p.name as patient_name,
                p.phone as patient_phone,
                d.id as doctor_id,
                u.fullname as doctor_name,
                d.specialization as doctor_specialization
            FROM appointment a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            ORDER BY a.appointment_time DESC
        `;
        const result = yield connection_1.default.query(query);
        res.status(200).json({ appointments: result.rows });
    }
    catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAppointments = getAppointments;
// --- DOCTOR SCHEDULE ---
const addDoctorSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctor_id, slots } = req.body; // slots: Array of strings (ISO format)
    if (!doctor_id || !slots || !Array.isArray(slots)) {
        return res.status(400).json({ message: 'doctor_id and an array of slots are required' });
    }
    try {
        // Check if doctor exists
        const doctorCheck = yield connection_1.default.query('SELECT id FROM doctors WHERE id = $1', [doctor_id]);
        if (doctorCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Insert slots
        if (slots.length > 0) {
            // Using parameterized query for security
            // Constructing the query carefully
            const placeholders = slots.map((_, i) => `($1, $${i + 2})`).join(', ');
            const query = `INSERT INTO doctor_schedule (doctor_id, available_time) VALUES ${placeholders} ON CONFLICT DO NOTHING`;
            yield connection_1.default.query(query, [doctor_id, ...slots]);
        }
        res.status(201).json({ message: 'Schedule updated successfully' });
    }
    catch (error) {
        console.error('Add schedule error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addDoctorSchedule = addDoctorSchedule;
const getDoctorSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // doctor_id
    try {
        const query = `
            SELECT id, available_time, is_booked 
            FROM doctor_schedule 
            WHERE doctor_id = $1 
            ORDER BY available_time ASC
        `;
        const result = yield connection_1.default.query(query, [id]);
        res.status(200).json({ schedule: result.rows });
    }
    catch (error) {
        console.error('Get schedule error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getDoctorSchedule = getDoctorSchedule;
