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

  const limit = parseInt(req?.query?.limit) || 10;
  const page = parseInt(req?.query?.page) || 1;
  const skip = (page - 1) * limit;

  const data = await productModel
    .find({ adminId: new mongoose.Types.ObjectId(adminId) })
    .skip(skip)
    .limit(limit);

  if (data?.length > 0) {
    const totalItems = await productModel.countDocuments({
      adminId: new mongoose.Types.ObjectId(adminId),
    });
    res.status(200).json({
      status: true,
      data,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } else {
    res.status(404).json({ status: false, message: "No products found" });
  }
});
