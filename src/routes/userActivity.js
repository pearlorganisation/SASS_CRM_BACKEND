import express from "express";
import { getAdminId } from "../middlewares/getIdMiddleware.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";
import {
  addUserActivity,
  getUserActivitiesByAdmin,
  getUserActivitiesByUser,
} from "../controller/userActivity.js";

const userActivityRouter = express.Router();

userActivityRouter
  .route("/")
  .get(verifyTokenMiddleware, getAdminId, getUserActivitiesByAdmin)
  .post(verifyTokenMiddleware, getAdminId, addUserActivity);

userActivityRouter
  .route("/:userId")
  .get(verifyTokenMiddleware, getAdminId, getUserActivitiesByUser);

export default userActivityRouter;
