import rolesModel from "../models/roles.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

export const addRole = asyncHandler(async (req, res) => {
  const { name } = req?.body;
  const isRoleExist = await rolesModel.findOne({ name: name });
  if (isRoleExist) {
    res.status(500).send("Role Already exists");
    return;
  }
  const result = await rolesModel.create({ name: name });

  res.status(200).send("Role Created Successfully");
});

export const getRoles = asyncHandler(async (req, res) => {
  const roles = await rolesModel.find();
  res.status(200).json({ status: true, roles });
});
