import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import usersModel from "../models/users.js";

const ROLES = JSON.parse(process.env.ROLES);

export const getEmployees = asyncHandler(async (req, res) => {
  let { adminId } = req?.query;

  if (![ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(req?.role)) {
    res.status(500).json({
      status: false,
      message: "Not Authorized to see all employees",
    });
  }

  adminId = req?.id;

  if (!adminId) {
    res.status(500).json({ status: false, message: "Admin ID not found" });
  }

  const result = await usersModel.find({ adminId: adminId }).populate("role");
  res.status(200).json({ status: true, data: result });
});
