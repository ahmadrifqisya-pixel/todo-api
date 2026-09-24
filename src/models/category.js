const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *       properties: 
 *         _id:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *         name:
 *           type: string
 *           example: Pekerjaan
 *         description: 
 *           type: string
 *           example: Kategori tugas kantor
 *         owner: 
 *           type: string 
 *           example:  60d0fe4f5311236168a109b8
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = mongoose.model ("Category", categorySchema);