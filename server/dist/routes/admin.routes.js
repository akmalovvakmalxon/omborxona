"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Admin - Doctors
 *     description: Administrative operations for Doctors
 *   - name: Admin - Cashiers
 *     description: Administrative operations for Cashiers
 *   - name: Admin - Appointments
 *     description: Administrative operations for Appointments
 *   - name: Admin - Schedule
 *     description: Doctor availability scheduling
 */
/**
 * @swagger
 * /api/admin/doctors:
 *   post:
 *     summary: Create a new doctor (Admin only)
 *     tags: [Admin - Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *               - specialization
 *               - phone
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               specialization:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not an admin)
 *       409:
 *         description: User already exists
 */
router.post('/doctors', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.createDoctor);
/**
 * @swagger
 * /api/admin/doctors:
 *   get:
 *     summary: Get all doctors (Admin only)
 *     tags: [Admin - Doctors]
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
router.get('/doctors', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.getDoctors);
/**
 * @swagger
 * /api/admin/doctors/{id}:
 *   put:
 *     summary: Update a doctor by doctor_id (Admin only)
 *     tags: [Admin - Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The doctor ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               specialization:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       404:
 *         description: Doctor not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/doctors/:id', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.updateDoctor);
/**
 * @swagger
 * /api/admin/doctors/{id}:
 *   delete:
 *     summary: Delete a doctor by doctor_id (Admin only)
 *     tags: [Admin - Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The doctor ID
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/doctors/:id', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.deleteDoctor);
/**
 * @swagger
 * /api/admin/cashiers:
 *   post:
 *     summary: Create a new cashier (Admin only)
 *     tags: [Admin - Cashiers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cashier created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not an admin)
 *       409:
 *         description: User already exists
 */
router.post('/cashiers', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.createCashier);
/**
 * @swagger
 * /api/admin/cashiers:
 *   get:
 *     summary: Get all cashiers (Admin only)
 *     tags: [Admin - Cashiers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of cashiers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/cashiers', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.getCashiers);
/**
 * @swagger
 * /api/admin/cashiers/{id}:
 *   put:
 *     summary: Update a cashier by user_id (Admin only)
 *     tags: [Admin - Cashiers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID of the cashier
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cashier updated successfully
 *       404:
 *         description: Cashier not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/cashiers/:id', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.updateCashier);
/**
 * @swagger
 * /api/admin/cashiers/{id}:
 *   delete:
 *     summary: Delete a cashier by user_id (Admin only)
 *     tags: [Admin - Cashiers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID of the cashier
 *     responses:
 *       200:
 *         description: Cashier deleted successfully
 *       404:
 *         description: Cashier not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/cashiers/:id', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.deleteCashier);
/**
 * @swagger
 * /api/admin/appointments:
 *   get:
 *     summary: Get all appointments (Admin only)
 *     description: Retrieve all appointments showing which patient is assigned to which doctor.
 *     tags: [Admin - Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of appointments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/appointments', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.getAppointments);
/**
 * @swagger
 * /api/admin/doctors/{id}/schedule:
 *   post:
 *     summary: Add time slots to a doctor's schedule (Admin only)
 *     tags: [Admin - Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slots
 *             properties:
 *               slots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date-time
 *                 description: Array of ISO date strings
 *     responses:
 *       201:
 *         description: Schedule updated successfully
 *       404:
 *         description: Doctor not found
 *       401:
 *         description: Unauthorized
 */
router.post('/doctors/:id/schedule', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.addDoctorSchedule);
/**
 * @swagger
 * /api/admin/doctors/{id}/schedule:
 *   get:
 *     summary: Get a doctor's schedule (Admin only)
 *     tags: [Admin - Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The doctor ID
 *     responses:
 *       200:
 *         description: A doctor's schedule
 *       401:
 *         description: Unauthorized
 */
router.get('/doctors/:id/schedule', auth_middleware_1.authenticateToken, role_middleware_1.authorizeAdmin, admin_controller_1.getDoctorSchedule);
exports.default = router;
