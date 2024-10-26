import { customSettingsModel } from "../models/customSettings.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";


export const getCustomSettings = asyncHandler(async (req, res) => {
  const result = await customSettingsModel.findOne({
    adminId: new mongoose.Types.ObjectId(`${req?.adminId}`),
  });
  res.status(200).json({ status: true, data: result });
});
