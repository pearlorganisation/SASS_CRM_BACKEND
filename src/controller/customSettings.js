import { customSettingsModel } from "../models/customSettings.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";


export const getCustomSettings = asyncHandler(async (req, res) => {
  const result = await customSettingsModel.findOne({
    adminId: req?.adminId,
  });
  res.status(200).json({ status: true, data: result });
});


export const addCustomSettings = asyncHandler(async (req, res) => {
  const result = await customSettingsModel.findOne({
    adminId: req?.adminId,
  });
  res.status(200).json({ status: true, data: result });
});