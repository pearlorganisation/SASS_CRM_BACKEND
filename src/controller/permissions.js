import permissionsModel from "../models/permissions.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

export const addRole = asyncHandler(async (req, res) => {
  const { name } = req?.body;
  const isPermissionExist = await permissionsModel.findOne({ name: name });
  if (isPermissionExist) {
    res.status(500).send("Role Already exists");
    return;
  }
  const result = await permissionsModel.create({ name: name });

  res.status(200).send("Role Created Successfully");
});

export const getRoles = asyncHandler(async (req, res) => {
  const roles = await permissionsModel.find();
  res.status(200).json({ status: true, roles });
});
