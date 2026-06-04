import { Router } from 'express';
import {
    getSuppliers, createSupplier, updateSupplier, deleteSupplier,
    getCustomers, createCustomer, updateCustomer, deleteCustomer,
    getProducts, createProduct, updateProduct, deleteProduct,
    getOrders, createOrder, updateOrderStatus, deleteOrder
} from '../controllers/crm.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: CRM
 *   description: Omborxona va CRM operatsiyalari (Kiyim-kechak ulgurji kompaniyasi uchun)
 */

// ============================================================
// 🏭 SUPPLIERS ROUTES
// ============================================================

/**
 * @swagger
 * /api/crm/suppliers:
 *   get:
 *     summary: Barcha yetkazib beruvchilarni olish
 *     tags: [CRM]
 *     responses:
 *       200:
 *         description: Yetkazib beruvchilar ro'yxati
 *   post:
 *     summary: Yangi yetkazib beruvchi qo'shish
 *     tags: [CRM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Toshkent Tekstil"
 *               phone:
 *                 type: string
 *                 example: "+998901112233"
 *     responses:
 *       201:
 *         description: Yaratildi
 */
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);

/**
 * @swagger
 * /api/crm/suppliers/{id}:
 *   put:
 *     summary: Yetkazib beruvchini yangilash
 *     tags: [CRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Toshkent Tekstil Yangi"
 *               phone:
 *                 type: string
 *                 example: "+998901112234"
 *     responses:
 *       200:
 *         description: Yangilandi
 *   delete:
 *     summary: Yetkazib beruvchini o'chirish
 *     tags: [CRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: O'chirildi
 */
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);


// ============================================================
// 👥 CUSTOMERS ROUTES
// ============================================================

/**
 * @swagger
 * /api/crm/customers:
 *   get:
 *     summary: Barcha mijozlarni olish
 *     tags: [CRM]
 *     responses:
 *       200:
 *         description: Mijozlar ro'yxati
 *   post:
 *     summary: Yangi mijoz qo'shish
 *     tags: [CRM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bek Trade MChJ"
 *               phone:
 *                 type: string
 *                 example: "+998901234500"
 *               address:
 *                 type: string
 *                 example: "Toshkent, Chilonzor"
 *     responses:
 *       201:
 *         description: Yaratildi
 */
router.get('/customers', getCustomers);
router.post('/customers', createCustomer);

/**
 * @swagger
 * /api/crm/customers/{id}:
 *   put:
 *     summary: Mijoz ma'lumotlarini yangilash
 *     tags: [CRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Yangilandi
 *   delete:
 *     summary: Mijozni o'chirish
 *     tags: [CRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: O'chirildi
 */
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);


// ============================================================
// 👕 PRODUCTS ROUTES
// ============================================================

/**
 * @swagger
 * /api/crm/products:
 *   get:
 *     summary: Barcha mahsulotlarni olish
 *     tags: [CRM]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Nomi yoki kategoriya bo'yicha qidirish
 *     responses:
 *       200:
 *         description: Mahsulotlar ro'yxati
 *   post:
 *     summary: Yangi mahsulot qo'shish
 *     tags: [CRM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Erkaklar koylagi"
 *               category:
 *                 type: string
 *                 example: "Koylak"
 *               price:
 *                 type: number
 *                 example: 120000.00
 *               stock:
 *                 type: integer
 *                 example: 50
 *               supplier_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Yaratildi
 */
router.get('/products', getProducts);
router.post('/products', createProduct);

/**
 * @swagger
 * /api/crm/products/{id}:
 *   put:
 *     summary: Mahsulot ma'lumotlarini yangilash
 *     tags: [CRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               supplier_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Yangilandi
 *   delete:
 *     summary: Mahsulotni o'chirish
 *     tags: [CRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: O'chirildi
 */
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);


// ============================================================
// 🧾 ORDERS ROUTES
// ============================================================

/**
 * @swagger
 * /api/crm/orders:
 *   get:
 *     summary: Barcha buyurtmalarni olish
 *     tags: [CRM]
 *     responses:
 *       200:
 *         description: Buyurtmalar ro'yxati tarkibi bilan
 *   post:
 *     summary: Yangi buyurtma yaratish (tarkibi bilan)
 *     tags: [CRM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - items
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: "new"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                     - unit_price
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 5
 *                     unit_price:
 *                       type: number
 *                       example: 120000.00
 *     responses:
 *       201:
 *         description: Yaratildi
 */
router.get('/orders', getOrders);
router.post('/orders', createOrder);

/**
 * @swagger
 * /api/crm/orders/{id}/status:
 *   put:
 *     summary: Buyurtma statusini o'zgartirish
 *     tags: [CRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "paid"
 *     responses:
 *       200:
 *         description: Status yangilandi
 */
router.put('/orders/:id/status', updateOrderStatus);

/**
 * @swagger
 * /api/crm/orders/{id}:
 *   delete:
 *     summary: Buyurtmani o'chirish
 *     tags: [CRM]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: O'chirildi
 */
router.delete('/orders/:id', deleteOrder);

export default router;
