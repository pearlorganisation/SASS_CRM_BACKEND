import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import usersModel from "../models/users.js";

const ROLES = JSON.parse(process.env.ROLES);

export const getEmployees = asyncHandler(async (req, res) => {
  const { adminId } = req?.query;

  if (![ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(req?.role)) {
    res.status(500).json({
      status: false,
      message: "Not Authorized to see all employees",
    });
  }

  adminId = req?.id;

  const isMyAdmin = await usersModel.findOne({ _id: userId, adminId: adminId });

  if (!isMyAdmin) {
    return res.status(500).json({
      status: false,
      message: "Only employee's admin is allowed to see their employees",
    });
  }

  if (!userId && !attendees && attendees && attendees?.length === 0) {
    return res
      .status(500)
      .json({ status: false, message: "Missing userId/attendees" });
  }

  if (!adminId) {
    res.status(500).json({ status: false, message: "Admin ID not found" });
  }

  const result = await usersModel.find({ adminId: adminId }).populate("role");
  res.status(200).json({ status: true, data: result });
});
