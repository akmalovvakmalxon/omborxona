"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_controller_1 = require("../controllers/doctor.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Doctor - Appointments
 *     description: Operations for doctors to view their appointments and add diagnosis
 */
/**
 * @swagger
 * /api/doctor/appointments:
 *   get:
 *     summary: Get appointments for the logged-in doctor
 *     tags: [Doctor - Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/appointments', auth_middleware_1.authenticateToken, role_middleware_1.authorizeDoctor, doctor_controller_1.getDoctorAppointments);
/**
 * @swagger
 * /api/doctor/diagnosis:
 *   post:
 *     summary: Add diagnosis and prescription for an appointment
 *     tags: [Doctor - Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointment_id
 *               - description
 *             properties:
 *               appointment_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               medicine:
 *                 type: string
 *               instructions:
 *                 type: string
 *     responses:
 *       201:
 *         description: Diagnosis and prescription added
 */
router.post('/diagnosis', auth_middleware_1.authenticateToken, role_middleware_1.authorizeDoctor, doctor_controller_1.addDiagnosisAndPrescription);
exports.default = router;
