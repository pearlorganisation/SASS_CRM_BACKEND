import express from 'express';
import { addSidebarLink, getSidebarLinks, addGlobalData, getGlobalData } from '../controller/globalData.js';
import { verifySuperAdminTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';
import { upload } from '../middlewares/multer.js';

const globalDataRouter = express.Router()

globalDataRouter.route('/').get((req, res) => {
    res.status(200).send("global data API")
})

globalDataRouter.route("/landingpage").get(getGlobalData).post(verifySuperAdminTokenMiddleware, upload.fields([{ name: "file" }]),addGlobalData)


globalDataRouter.route('/sidebarLinks').get(getSidebarLinks).post(verifySuperAdminTokenMiddleware, addSidebarLink)

export default globalDataRouter