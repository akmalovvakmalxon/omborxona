"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cashier_controller_1 = require("../controllers/cashier.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Cashier - Patients
 *     description: Operations for Patients managed by Cashier
 *   - name: Cashier - Appointments
 *     description: Operations for Appointments managed by Cashier
 *   - name: Cashier - Payments
 *     description: Operations for Payments managed by Cashier
 *   - name: Cashier - Doctors
 *     description: Get doctors list for appointment scheduling
 */
/**
 * @swagger
 * /api/cashier/patients:
 *   post:
 *     summary: Create a new patient (Cashier only)
 *     tags: [Cashier - Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not a cashier)
 */
router.post('/patients', auth_middleware_1.authenticateToken, role_middleware_1.authorizeCashier, cashier_controller_1.createPatient);
/**
 * @swagger
 * /api/cashier/patients:
 *   get:
 *     summary: Get list of all patients (Cashier only)
 *     tags: [Cashier - Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of patients
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/patients', auth_middleware_1.authenticateToken, role_middleware_1.authorizeCashier, cashier_controller_1.getPatients);
/**
 * @swagger
 * /api/cashier/doctors:
 *   get:
 *     summary: Get list of all doctors for scheduling (Cashier only)
 *     tags: [Cashier - Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of doctors
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/doctors', auth_middleware_1.authenticateToken, role_middleware_1.authorizeCashier, cashier_controller_1.getDoctorsList);
/**
 * @swagger
 * /api/cashier/doctors/{id}/schedule:
 *   get:
 *     summary: Get schedule for a specific doctor (Cashier only)
 *     tags: [Cashier - Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor schedule
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/doctors/:id/schedule', auth_middleware_1.authenticateToken, role_middleware_1.authorizeCashier, cashier_controller_1.getDoctorSchedule);
/**
 * @swagger
 * /api/cashier/appointments:
 *   post:
 *     summary: Create a new appointment (Cashier only)
 *     tags: [Cashier - Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor_id
 *               - patient_id
 *               - appointment_time
 *             properties:
 *               doctor_id:
 *                 type: integer
 *               patient_id:
 *                 type: integer
 *               appointment_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Doctor or Patient not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not a cashier)
 */
router.post('/appointments', auth_middleware_1.authenticateToken, role_middleware_1.authorizeCashier, cashier_controller_1.createAppointment);
/**
 * @swagger
 * /api/cashier/payments:
 *   post:
 *     summary: Record a new payment for an appointment (Cashier only)
 *     tags: [Cashier - Payments]
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
 *               - amount
 *               - status
 *             properties:
 *               appointment_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 format: float
 *               status:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Appointment not found
 *       409:
 *         description: Payment already exists for this appointment
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not a cashier)
 */
router.post('/payments', auth_middleware_1.authenticateToken, role_middleware_1.authorizeCashier, cashier_controller_1.createPayment);
/**
 * @swagger
 * /api/cashier/payments:
 *   get:
 *     summary: Get list of all payments recorded (Cashier only)
 *     tags: [Cashier - Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of payments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/payments', auth_middleware_1.authenticateToken, role_middleware_1.authorizeCashier, cashier_controller_1.getPayments);
exports.default = router;
