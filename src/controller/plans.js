import { planModel } from "../models/plans.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

export const addPlan = asyncHandler(async (req, res) => {
  const { planName, price, planExpiry, employeesCount } = req?.body;
  const isPlanExist = await planModel.findOne({
    planName,
    price,
    planExpiry,
    employeesCount,
  });
  if (isPlanExist) {
    res.status(500).send("Plan Already exists");
    return;
  }
  await planModel.create(req?.body);
  res.status(200).send("Plan Created Successfully");
});

export const getPlans = asyncHandler(async (req, res) => {
  const plans = await planModel.find();
  res.status(200).json({ status: true, plans });
});
