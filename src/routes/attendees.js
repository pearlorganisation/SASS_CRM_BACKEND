import express from "express";

import {
  addAttendees,
  assignAttendees,
  deleteCsvData,
  getAssignments,
  getAttendee,
  getAttendees,
  getCsvData,
  updateAttendee,
  updateAttendees,
  updateLeadType,
} from "../controller/attendees.js";

import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";
import { getAdminId } from "../middlewares/getIdMiddleware.js";

const attendeesRouter = express.Router();

attendeesRouter
  .route("/")
  .get(verifyTokenMiddleware, getAdminId, getAttendee)
  .post(verifyTokenMiddleware, addAttendees)
  .patch(verifyTokenMiddleware, getAdminId, updateAttendee);

  attendeesRouter
  .route("/updateWebinar").patch(verifyTokenMiddleware,updateAttendees) 

  attendeesRouter.route("/:page?")
  .get(verifyTokenMiddleware, getAdminId, getAttendees)
  .post(verifyTokenMiddleware, getAttendees);

attendeesRouter.route("/csvData/:page?").get(verifyTokenMiddleware, getCsvData);
attendeesRouter.route("/:csvId").delete(verifyTokenMiddleware, deleteCsvData);
attendeesRouter.route("/assign").patch(verifyTokenMiddleware, assignAttendees);
attendeesRouter.route("/employee/assignments").get(verifyTokenMiddleware, getAssignments);
attendeesRouter.route("/leadType").patch(verifyTokenMiddleware, getAdminId, updateLeadType);

export default attendeesRouter;
