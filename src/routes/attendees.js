import express from "express";
import { addAttendees, assignAttendees, deleteCsvData, getAttendees, getCsvData } from "../controller/attendees.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";

const attendeesRouter = express.Router();
attendeesRouter.route("/").post(verifyTokenMiddleware, addAttendees);
attendeesRouter.route("/:page?").get(getAttendees).post(verifyTokenMiddleware, getAttendees);
attendeesRouter.route("/csvData/:page?").get(getCsvData)
attendeesRouter.route("/:csvId").delete(verifyTokenMiddleware,deleteCsvData)
attendeesRouter.route("/assign").patch(verifyTokenMiddleware, assignAttendees)



export default attendeesRouter;
