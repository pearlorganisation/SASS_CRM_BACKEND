import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import usersModel from "../models/users.js"
import mongoose from "mongoose";

const ROLES = JSON.parse(process.env.ROLES);

export const getAdminId = asyncHandler(async(req, res, next) => {
    
  if (req?.role === ROLES?.ADMIN) {
    req.adminId = new mongoose.Types.ObjectId(`${req?.id}`);
    next()
  } else if (
    [ROLES?.EMPLOYEE_SALES, ROLES?.EMPLOYEE_REMINDER].includes(req?.role)
  ) {
    const user = await usersModel.findOne({
      _id: new mongoose.Types.ObjectId(`${req?.id}`),
    });
    req.adminId = user?.adminId;

    next()
  } else {
    return res.status(500).json({ status: false, message: "Admin Id not found" });
  }

})