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
