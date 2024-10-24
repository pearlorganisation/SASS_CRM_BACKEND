import { planModel } from "../models/plans.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

//Add plan api
export const addPlan = asyncHandler(async (req, res) => {
  const { planName, price, planExpiry, employeesCount, contactUploadLimit } =
    req?.body;

  if (
    !planName &&
    !price &&
    !planExpiry &&
    !employeesCount &&
    !contactUploadLimit
  ) {
    return res
      .status(500)
      .json({ status: false, message: "Incomplete form inputs" });
  }

  const isPlanExist = await planModel.findOne({
    price,
  });

  if (isPlanExist) {
    res.status(500).send("Plan with this price Already exists");
    return;
  }
  await planModel.create(req?.body);
  res.status(200).send("Plan Created Successfully");
});


//get plan
export const getPlans = asyncHandler(async (req, res) => {
  const plans = await planModel.find();
  res.status(200).json({ status: true, plans });
});

//delete plan api
export const deletePlan = asyncHandler(async (req, res) => {
  const {id} = req?.params
  if(!id) {
    res.status(500).json({status: false, message: "Plan ID not provided"})
  }
  const plans = await planModel.findByIdAndDelete(id);
  res.status(200).json({ status: true,message: "Plan Deleted successfully." });
});
