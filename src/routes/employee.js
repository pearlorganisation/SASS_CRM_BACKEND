import express from 'express';
import { getEmployees } from '../controller/employee.js';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';

const employeeRouter = express.Router()

employeeRouter.route('/').get(verifyTokenMiddleware, getEmployees)

export default employeeRouter