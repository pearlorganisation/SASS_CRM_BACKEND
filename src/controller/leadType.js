import leadType from "../models/leadType.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";


export const getLeadType = asyncHandler(async (req, res) => {
  const result = await leadType.findOne({
    adminId: req?.adminId,
  });
  res.status(200).json({ status: true, data: result });
});


export const addLeadType = asyncHandler(async (req, res) => {
  const result = await leadType.findOne({
    adminId: req?.adminId,
  });
  res.status(200).json({ status: true, data: result });
});