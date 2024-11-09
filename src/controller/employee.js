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


export const toggleEmployeeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (![ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(req?.role)) {
    return res.status(403).json({
      status: false,
      message: "Not authorized to change employee status",
    });
  }

  const employee = await usersModel.findById(id);
  if (!employee) {
    return res.status(404).json({
      status: false,
      message: "Employee not found",
    });
  }

  if (req.role === ROLES.ADMIN && employee.adminId.toString() !== req.id) {
    return res.status(403).json({
      status: false,
      message: "Not authorized to change status of this employee",
    });
  }

  employee.isActive = !employee.isActive;
  await employee.save();

  const result = await usersModel.find({ adminId: employee.adminId }).populate("role");

  res.status(200).json({
    status: true,
    message: `Employee has been ${employee.isActive ? 'activated' : 'deactivated'} successfully`,
    data: result,
  });
});


