import express from "express";
import { addPlan, deletePlan, getPlan, getPlans, updatePlan } from "../controller/plans.js";
import {
  verifySuperAdminTokenMiddleware,
  verifyTokenMiddleware,
} from "../middlewares/verifyTokenMiddleware.js";

const planRouter = express.Router();
planRouter
  .route("/")
  .get(verifyTokenMiddleware, getPlans)
  .post(verifySuperAdminTokenMiddleware, addPlan);
planRouter
.route("/:id")
.delete(verifySuperAdminTokenMiddleware, deletePlan)
.get(verifySuperAdminTokenMiddleware, getPlan)
.patch(verifySuperAdminTokenMiddleware, updatePlan);

export default planRouter;


/**
 * @swagger
 * components:
 *   schemas:
 *     Plan:
 *       type: object
 *       required:
 *         - planName
 *         - price
 *         - planExpiry
 *         - employeesCount
 *         - contactUploadLimit
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the plan.
 *         planName:
 *           type: string
 *           description: Name of the plan.
 *         price:
 *           type: number
 *           description: Price of the plan.
 *         planExpiry:
 *           type: number
 *           description: Expiry period of the plan (in days or months).
 *         employeesCount:
 *           type: number
 *           description: Number of employees allowed under the plan.
 *           default: 1
 *         contactUploadLimit:
 *           type: number
 *           description: Limit on contact uploads for the plan.
 *           default: 1
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
 *   - name: Plans
 *     description: API endpoints for managing plans.
 *
 * /:
 *   get:
 *     summary: Retrieve a list of all plans.
 *     tags: [Plans]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved plan list.
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
 *                     $ref: '#/components/schemas/Plan'
 *       401:
 *         description: Unauthorized.
 *
 *   post:
 *     summary: Add a new plan (Super Admin only).
 *     tags: [Plans]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planName:
 *                 type: string
 *                 description: Name of the plan.
 *                 example: "Enterprise Plan"
 *               price:
 *                 type: number
 *                 description: Price of the plan.
 *                 example: 199.99
 *               planExpiry:
 *                 type: number
 *                 description: Expiry period of the plan (in days or months).
 *                 example: 365
 *               employeesCount:
 *                 type: number
 *                 description: Number of employees allowed under the plan.
 *                 example: 10
 *               contactUploadLimit:
 *                 type: number
 *                 description: Limit on contact uploads for the plan.
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Plan created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Missing required fields or invalid input.
 *       403:
 *         description: Forbidden. Only super admins are authorized.
 *       401:
 *         description: Unauthorized.
 *
 * /{id}:
 *   delete:
 *     summary: Delete a plan by ID (Super Admin only).
 *     tags: [Plans]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the plan to delete.
 *     responses:
 *       200:
 *         description: Plan deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Plan deleted successfully."
 *       404:
 *         description: Plan not found.
 *       403:
 *         description: Forbidden. Only super admins are authorized.
 *       401:
 *         description: Unauthorized.
 */
