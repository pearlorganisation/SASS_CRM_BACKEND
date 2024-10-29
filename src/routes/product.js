import express from "express";

import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";
import { addProduct, getProducts } from "../controller/product.js";

const productRouter = express.Router();
productRouter.route("/").get(verifyTokenMiddleware, getProducts).post(verifyTokenMiddleware, addProduct);


export default productRouter;


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - adminId
 *         - webinarName
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the product.
 *         name:
 *           type: string
 *           description: Name of the product.
 *         price:
 *           type: number
 *           description: Price of the product.
 *         adminId:
 *           type: string
 *           description: ID of the admin who created the product.
 *         webinarName:
 *           type: string
 *           description: Name of the associated webinar.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp.
 *
 * tags:
 *   name: Products
 *   description: API endpoints for managing products.
 *
 * /:
 *   get:
 *     summary: Retrieve a list of all products.
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved product list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized.
 *
 *   post:
 *     summary: Add a new product.
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product.
 *                 example: "Pro Plan"
 *               price:
 *                 type: number
 *                 description: Price of the product.
 *                 example: 99.99
 *               adminId:
 *                 type: string
 *                 description: ID of the admin creating the product.
 *               webinarName:
 *                 type: string
 *                 description: Name of the associated webinar.
 *                 example: "Advanced Web Development"
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing required fields or invalid input.
 *       401:
 *         description: Unauthorized.
 */
