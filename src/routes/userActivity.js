import express from 'express';
import { getAdminId } from '../middlewares/getIdMiddleware.js';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';
import { addUserActivity } from '../controller/userActivity.js';

const userActivityRouter = express.Router()

userActivityRouter.route('/').get((req, res) => {
    res.status(200).send("User Activity API")
}).post(verifyTokenMiddleware, getAdminId, addUserActivity)



export default userActivityRouter