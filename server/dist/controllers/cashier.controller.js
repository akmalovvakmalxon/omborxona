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
exports.getPayments = exports.getDoctorSchedule = exports.getDoctorsList = exports.getPatients = exports.createPayment = exports.createAppointment = exports.createPatient = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const createPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, age, phone } = req.body;
    if (!name || !age || !phone) {
        return res.status(400).json({ message: 'All fields (name, age, phone) are required' });
    }
    try {
        const result = yield connection_1.default.query('INSERT INTO patients (name, age, phone) VALUES ($1, $2, $3) RETURNING id, name, age, phone', [name, age, phone]);
        res.status(201).json({
            message: 'Patient created successfully',
            patient: result.rows[0]
        });
    }
    catch (error) {
        console.error('Create patient error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createPatient = createPatient;
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctor_id, patient_id, appointment_time } = req.body;
    if (!doctor_id || !patient_id || !appointment_time) {
        return res.status(400).json({ message: 'doctor_id, patient_id, and appointment_time are required' });
    }
    try {
        // Validate if doctor exists
        const doctorCheck = yield connection_1.default.query('SELECT id FROM doctors WHERE id = $1', [doctor_id]);
        if (doctorCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Validate if patient exists
        const patientCheck = yield connection_1.default.query('SELECT id FROM patients WHERE id = $1', [patient_id]);
        if (patientCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        // Insert appointment
        const result = yield connection_1.default.query('INSERT INTO appointment (doctor_id, patient_id, appointment_time) VALUES ($1, $2, $3) RETURNING id, doctor_id, patient_id, appointment_time', [doctor_id, patient_id, appointment_time]);
        res.status(201).json({
            message: 'Appointment created successfully',
            appointment: result.rows[0]
        });
    }
    catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createAppointment = createAppointment;
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointment_id, amount, status } = req.body;
    if (!appointment_id || amount === undefined || !status) {
        return res.status(400).json({ message: 'appointment_id, amount, and status are required' });
    }
    try {
        // Validate if appointment exists
        const appointmentCheck = yield connection_1.default.query('SELECT id FROM appointment WHERE id = $1', [appointment_id]);
        if (appointmentCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        // Check if a payment already exists for this appointment (One-to-One rule)
        const paymentCheck = yield connection_1.default.query('SELECT id FROM payment WHERE appointment_id = $1', [appointment_id]);
        if (paymentCheck.rows.length > 0) {
            return res.status(409).json({ message: 'Payment already exists for this appointment' });
        }
        const result = yield connection_1.default.query('INSERT INTO payment (appointment_id, amount, status) VALUES ($1, $2, $3) RETURNING id, appointment_id, amount, status', [appointment_id, amount, status]);
        res.status(201).json({
            message: 'Payment recorded successfully',
            payment: result.rows[0]
        });
    }
    catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createPayment = createPayment;
// Helpful endpoints for Cashier to get lists when creating appointments
const getPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.query('SELECT * FROM patients ORDER BY id DESC');
        res.status(200).json({ patients: result.rows });
    }
    catch (error) {
        console.error('Get patients error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getPatients = getPatients;
const getDoctorsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
            SELECT d.id as doctor_id, u.fullname as doctor_name, d.specialization 
            FROM doctors d
            JOIN users u ON d.user_id = u.id
        `;
        const result = yield connection_1.default.query(query);
        res.status(200).json({ doctors: result.rows });
    }
    catch (error) {
        console.error('Get doctors list error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getDoctorsList = getDoctorsList;
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
const getPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
            SELECT 
                pay.id, 
                pay.appointment_id, 
                pay.amount, 
                pay.status, 
                p.name as patient_name,
                u.fullname as doctor_name
            FROM payment pay
            JOIN appointment a ON pay.appointment_id = a.id
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            ORDER BY pay.id DESC
        `;
        const result = yield connection_1.default.query(query);
        res.status(200).json({ payments: result.rows });
    }
    catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getPayments = getPayments;
