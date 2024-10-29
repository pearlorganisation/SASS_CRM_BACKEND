import express from "express";
import {
  createEmployee,
  generateSuperAdminToken,
  login,
  refreshToken,
  signup,
} from "../controller/auth.js";
import {
  verifyPabblySATokenMiddleware,
  verifyTokenMiddleware,
} from "../middlewares/verifyTokenMiddleware.js";

const authRouter = express.Router();

authRouter.route("/signin").post(login);
authRouter.route("/signup").post(verifyPabblySATokenMiddleware, signup);
authRouter.route("/refresh").post(refreshToken);
authRouter.route("/createEmployee").post(verifyTokenMiddleware, createEmployee);
authRouter.route("/admin/token").post(generateSuperAdminToken);

// authRouter.route('/admin/signup').post(adminSignup)

export default authRouter;

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication and employee creation.
 */

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in a user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Successfully signed in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for user authentication.
 *       500:
 *         description: Invalid credentials.
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Sign up a new user.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: New user's email.
 *               password:
 *                 type: string
 *                 description: New user's password.
 *               pabblySAToken:
 *                 type: string
 *                 description: Pabbly SA token for verification.
 *     responses:
 *       200:
 *         description: Successfully signed up.
 *       500:
 *         description: Invalid or missing information.
 */

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Refresh authentication token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token used to obtain a new access token.
 *     responses:
 *       200:
 *         description: New access token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New JWT token.
 *       500:
 *         description: Invalid refresh token.
 */

/**
 * @swagger
 * /createEmployee:
 *   post:
 *     summary: Create a new employee under the authenticated user.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Employee's first name.
 *               lastName:
 *                 type: string
 *                 description: Employee's last name.
 *               email:
 *                 type: string
 *                 description: Employee's email address.
 *               position:
 *                 type: string
 *                 description: Employee's position.
 *     responses:
 *       200:
 *         description: Employee successfully created.
 *       500:
 *         description: Unauthorized access.
 */

/**
 * @swagger
 * /admin/token:
 *   post:
 *     summary: Generate a super admin token.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Super admin token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adminToken:
 *                   type: string
 *                   description: Token for super admin access.
 */

