import express from "express";
import { getEmployees, toggleEmployeeStatus } from "../controller/employee.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";

const employeeRouter = express.Router();

employeeRouter.route("/").get(verifyTokenMiddleware, getEmployees);

employeeRouter.route("/:id").patch(verifyTokenMiddleware, toggleEmployeeStatus);

export default employeeRouter;
