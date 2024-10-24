import express from "express";
import { addPlan, deletePlan, getPlans } from "../controller/plans.js";
import {
  verifySuperAdminTokenMiddleware,
  verifyTokenMiddleware,
} from "../middlewares/verifyTokenMiddleware.js";

const planRouter = express.Router();
planRouter
  .route("/")
  .get(verifyTokenMiddleware, getPlans)
  .post(verifySuperAdminTokenMiddleware, addPlan);
planRouter.route("/:id").delete(verifySuperAdminTokenMiddleware, deletePlan);

export default planRouter;
