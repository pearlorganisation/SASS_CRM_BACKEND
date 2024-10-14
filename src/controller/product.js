import mongoose from "mongoose";
import { productModel } from "../models/products.js";
import usersModel from "../models/users.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

const ROLES = JSON.parse(process.env.ROLES);

export const addProduct = asyncHandler(async (req, res) => {
  await productModel.create(req?.body);
  res.status(201).json({ status: true, message: "Added product Successfully" });
});

export const getProducts = asyncHandler(async (req, res) => {
  const id = req?.id;
  let adminId;
  if ([ROLES.EMPLOYEE_SALES, ROLES.EMPLOYEE_REMINDER].includes(req?.role)) {
    const user = await usersModel.findById(id);
    adminId = user?.adminId;
  } else {
    adminId = id;
  }

  const data = await productModel.find({
    adminId: new mongoose.Types.ObjectId(adminId),
  });

  if(data?.length > 0){
    res.status(200).json({ status: true, data });
  } else {
    res.status(500).json({status: false, message: 'No products found'})
  }

});
