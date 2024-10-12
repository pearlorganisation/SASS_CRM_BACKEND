import express from "express";

import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";
import { addProduct, getProducts } from "../controller/product.js";

const productRouter = express.Router();
productRouter.route("/").get(verifyTokenMiddleware, getProducts).post(verifyTokenMiddleware, addProduct);


export default productRouter;
