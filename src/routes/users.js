import express from "express"
import { getAllClients, getAllUsers } from "../controller/users.js"
import { verifySuperAdminTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';

const usersRouter = express.Router()

usersRouter.route('/').get(verifySuperAdminTokenMiddleware, getAllUsers)
usersRouter.route('/clients').get(verifySuperAdminTokenMiddleware, getAllClients)

export default usersRouter