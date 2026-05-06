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
exports.addDiagnosisAndPrescription = exports.getDoctorAppointments = void 0;
const connection_1 = __importDefault(require("../config/connection"));
const getDoctorAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        // First get the doctor_id from user_id
        const doctorRes = yield connection_1.default.query('SELECT id FROM doctors WHERE user_id = $1', [userId]);
        if (doctorRes.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const doctorId = doctorRes.rows[0].id;
        const query = `
            SELECT 
                a.id as appointment_id,
                a.appointment_time,
                p.id as patient_id,
                p.name as patient_name,
                p.age as patient_age,
                p.phone as patient_phone,
                d.description as diagnosis,
                pr.medicine as prescription
            FROM appointment a
            JOIN patients p ON a.patient_id = p.id
            LEFT JOIN diagnosis d ON a.id = d.appointment_id
            LEFT JOIN prescription pr ON d.id = pr.diagnosis_id
            WHERE a.doctor_id = $1
            ORDER BY a.appointment_time DESC
        `;
        const result = yield connection_1.default.query(query, [doctorId]);
        res.status(200).json({ appointments: result.rows });
    }
    catch (error) {
        console.error('Get doctor appointments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getDoctorAppointments = getDoctorAppointments;
const addDiagnosisAndPrescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointment_id, description, medicine, instructions } = req.body;
    if (!appointment_id || !description) {
        return res.status(400).json({ message: 'Appointment ID and description are required' });
    }
    const client = yield connection_1.default.connect();
    try {
        yield client.query('BEGIN');
        // 1. Create Diagnosis
        const diagRes = yield client.query('INSERT INTO diagnosis (appointment_id, description) VALUES ($1, $2) RETURNING id', [appointment_id, description]);
        const diagnosisId = diagRes.rows[0].id;
        // 2. Create Prescription (if provided)
        if (medicine) {
            yield client.query('INSERT INTO prescription (diagnosis_id, medicine, instructions) VALUES ($1, $2, $3)', [diagnosisId, medicine, instructions || '']);
        }
        yield client.query('COMMIT');
        res.status(201).json({ message: 'Diagnosis and prescription recorded successfully' });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        console.error('Add diagnosis error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
exports.addDiagnosisAndPrescription = addDiagnosisAndPrescription;
