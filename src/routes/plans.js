import express from "express";
import { addPlan, getPlans } from "../controller/plans.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";

const planRouter = express.Router();
planRouter.route("/").get(getPlans).post(verifyTokenMiddleware, addPlan);

export default planRouter;
