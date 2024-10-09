import express from 'express';
import { addSidebarLink, getSidebarLinks } from '../controller/globalData.js';
import { verifySuperAdminTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';

const globalDataRouter = express.Router()

globalDataRouter.route('/').get((req, res) => {
    res.status(200).send("global data API")
})


globalDataRouter.route('/sidebarLinks').get(getSidebarLinks).post(verifySuperAdminTokenMiddleware, addSidebarLink)

export default globalDataRouter