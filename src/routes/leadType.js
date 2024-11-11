import express from 'express';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';
import { getLeadType } from '../controller/leadType.js';
import { getAdminId } from '../middlewares/getIdMiddleware.js';

const Router = express.Router()

Router.route('/').get(verifyTokenMiddleware,getAdminId, getLeadType)

export default Router