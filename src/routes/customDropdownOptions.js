import express from "express";
import {
  createCustomOption,
  deleteCustomOption,
  getCustomOptions,
} from "../controller/customDropdownOptions.js";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware.js";
import { getAdminId } from "../middlewares/getIdMiddleware.js";

const Router = express.Router();

Router.route("/")
  .post(verifyTokenMiddleware, createCustomOption)
  .get(verifyTokenMiddleware, getAdminId, getCustomOptions);

Router.route("/:id").delete(verifyTokenMiddleware, deleteCustomOption);

export default Router;
