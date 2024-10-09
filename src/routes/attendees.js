import express from "express";
import { addAttendees, assignAttendees, deleteCsvData, getAttendee, getAttendees, getCsvData } from "../controller/attendees.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";

const attendeesRouter = express.Router();
attendeesRouter.route("/").get(verifyTokenMiddleware, getAttendee).post(verifyTokenMiddleware, addAttendees);
attendeesRouter.route("/:page?").get(verifyTokenMiddleware, getAttendees).post(verifyTokenMiddleware, getAttendees);
attendeesRouter.route("/csvData/:page?").get(verifyTokenMiddleware, getCsvData)
attendeesRouter.route("/:csvId").delete(verifyTokenMiddleware,deleteCsvData)
attendeesRouter.route("/assign").patch(verifyTokenMiddleware, assignAttendees)


export default attendeesRouter;
