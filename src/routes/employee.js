import express from 'express';
import { getEmployees } from '../controller/employee.js';

const employeeRouter = express.Router()

employeeRouter.route('/').get(getEmployees)

export default employeeRouter