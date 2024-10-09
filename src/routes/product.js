import express from "express";

import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";
import { addProduct, getProducts } from "../controller/product.js";

const productRouter = express.Router();
productRouter.route("/").post(verifyTokenMiddleware, addProduct);
productRouter.route("/:id").get(getProducts)

export default productRouter;
