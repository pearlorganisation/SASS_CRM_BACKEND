import customOptionModel from "../models/customDropdownOptions.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

const ROLES = JSON.parse(process.env.ROLES);

export const createCustomOption = asyncHandler(async (req, res) => {
    const { id: adminId, role } = req;
    const { value, label } = req.body;

    if (role !== ROLES.ADMIN) {
        return res.status(403).json({ status: false, message: "Unauthorized" });
    }

    const newOption = new customOptionModel({
        value,
        label,
        adminId,
    });

    const savedOption = await newOption.save();
    res.status(201).json({
        status: true,
        message: "Custom option created successfully",
        data: savedOption,
    });
});

export const getCustomOptions = asyncHandler(async (req, res) => {
    const { adminId } = req;

    if(!adminId) {
        return res.status(500).json({ status: false, message: "Admin ID not found" });
    }

    const options = await customOptionModel.find({ adminId });

    res.status(200).json({
        status: true,
        message: "Options retrieved successfully",
        data: options,
    });
});

export const deleteCustomOption = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const { role } = req;

  if (role !== ROLES.ADMIN) {
      return res.status(403).json({ status: false, message: "Unauthorized" });
  }

  const customOption = await customOptionModel.findById(id);

  if (!customOption) {
    return res.status(404).json({
      status: false,
      message: "Custom option not found",
    });
  }

  await customOption.remove();

  res.status(200).json({
    status: true,
    message: "Custom option deleted successfully",
  });
});
