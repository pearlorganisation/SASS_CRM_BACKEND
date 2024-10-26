import express from 'express';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';
import { getCustomSettings } from '../controller/customSettings.js';
import { getAdminId } from '../middlewares/getIdMiddleware.js';

const customSettingsRouter = express.Router()

customSettingsRouter.route('/').get(verifyTokenMiddleware,getAdminId, getCustomSettings)

export default customSettingsRouter