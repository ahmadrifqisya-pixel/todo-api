const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller.js");
const { protect } = require("../middlewares/auth.middleware.js");
const validate = require("../middlewares/validate.middleware.js");
const {
    createCategoryRules,
    updateCategoryRules,
    getCategoryByIdRules,
} = require("../validators/category.validator.js");

router.use(protect);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Membuat kategori baru (wajib login)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pekerjaan
 *               description:
 *                 type: string
 *                 example: Kategori tugas-tugas kantor
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category created successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasi gagal (misal name kosong atau kurang dari 3 karakter)
 *       401:
 *         description: Belum login / token tidak valid
 */

router.post("/", createCategoryRules, validate, categoryController.createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Mengambil daftar kategori milik user yang sedang Login
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Categories retrieved successfully }
 *                 data: 
 *                   $ref: '#/components/schemas/Category'
 *       401: 
 *         description: Belum login / token tidak valid
 */

router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Mengambil satu kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori (format ObjectId MongoDB)
 *     responses:
 *       200:
 *         description: Kategori berhasil ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category retrieved successfully } 
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Format ID tidak valid
 *       401:
 *         description: Belum login / token tidak valid
 *       403:
 *         description: Kategori ini bukan milik user yang sedang login
 *       404:
 *         description: Kategori tidak ditemukan
 */

router.get("/:id", getCategoryByIdRules, validate, categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Mengupdate kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters: 
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori (format ObjectId MongoDB)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Pekerjaan (revisi)
 *               description:
 *                 type: string
 *                 example: Kategori tugas kantor dan projek freelance
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category updated successfully }
 *                 data: 
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasi gagal atau format ID tidak valid
 *       401:
 *         description: Belum login / token tidak valid
 *       403: 
 *         description: Kategori ini bukan milik user yang sedang login
 *       404:
 *         description: Kategori tidak ditemukan
 */

router.put("/:id", updateCategoryRules, validate, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Menghapus kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: 
 *           type: string
 *         description: ID kategori (format ObjectId MongoDB)
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Category deleted successfully }
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Format ID tidak valid
 *       401:
 *         description: Belum login / token tidak valid
 *       403:
 *         description: Kategori ini bukan milik user yang sedang login
 *       404:
 *         description: Kategori tidak ditemukan
 */

router.delete("/:id", getCategoryByIdRules, validate, categoryController.deleteCategory);

module.exports = router;