import express from "express"
import { getAllClients, getAllUsers, getEmpployeeCount } from "../controller/users.js"
import { verifySuperAdminTokenMiddleware, verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';

const usersRouter = express.Router()

usersRouter.route('/').get(verifySuperAdminTokenMiddleware, getAllUsers)
usersRouter.route('/clients').get(verifySuperAdminTokenMiddleware, getAllClients)

usersRouter.route('/employeeStats').get(verifyTokenMiddleware, getEmpployeeCount)

export default usersRouter