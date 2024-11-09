import { planModel } from "../models/plans.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

//Add plan
export const addPlan = asyncHandler(async (req, res) => {
  const {
    planName,
    price,
    planExpiry,
    employeesCount,
    contactUploadLimit,
    employeeReminder,
    purchaseHistory,
    employeeStatus,
    employeeActivity,
  } = req.body;

  // Validate required fields
  if (
    !planName ||
    !price ||
    !planExpiry ||
    !employeesCount ||
    !contactUploadLimit
  ) {
    return res
      .status(400)
      .json({ status: false, message: "Incomplete form inputs" });
  }

  // Check if the plan with the same name already exists
  const isPlanExist = await planModel.findOne({ planName });

  if (isPlanExist) {
    return res
      .status(400)
      .json({ status: false, message: "Plan with this name already exists" });
  }

  // Create the new plan
  const newPlan = await planModel.create({
    planName,
    price,
    planExpiry,
    employeesCount,
    contactUploadLimit,
    employeeReminder,
    purchaseHistory,
    employeeStatus,
    employeeActivity,
  });

  res.status(201).json({
    status: true,
    message: "Plan Created Successfully",
    plan: newPlan,
  });
});

//get all plans
export const getPlans = asyncHandler(async (req, res) => {
  const plans = await planModel.find();
  res.status(200).json({ status: true, plans });
});

//get single plan controller
export const getPlan = asyncHandler(async (req, res) => {
  const { planId } = req.params; // Assuming you're using planId from the URL

  // Find the plan by ID
  const plan = await planModel.findById(planId);

  if (!plan) {
    return res.status(404).json({ status: false, message: "Plan not found" });
  }

  res.status(200).json({ status: true, plan });
});

//update plan

export const updatePlan = asyncHandler(async (req, res) => {
  const { id } = req.params; // Assuming you're using planId from the URL
  const {
    planName,
    price,
    planExpiry,
    employeesCount,
    contactUploadLimit,
    employeeReminder,
    purchaseHistory,
    employeeStatus,
    employeeActivity,
  } = req.body;

  // Find the existing plan
  const plan = await planModel.findById(id);

  if (!plan) {
    return res.status(404).json({ status: false, message: "Plan not found" });
  }

  // Update the plan fields only if they are provided
  plan.planName = planName !== undefined ? planName : plan.planName;
  plan.price = price !== undefined ? price : plan.price;
  plan.planExpiry = planExpiry !== undefined ? planExpiry : plan.planExpiry;
  plan.employeesCount =
    employeesCount !== undefined ? employeesCount : plan.employeesCount;
  plan.contactUploadLimit =
    contactUploadLimit !== undefined
      ? contactUploadLimit
      : plan.contactUploadLimit;
  plan.employeeReminder =
    employeeReminder !== undefined ? employeeReminder : plan.employeeReminder;
  plan.purchaseHistory =
    purchaseHistory !== undefined ? purchaseHistory : plan.purchaseHistory;
  plan.employeeStatus =
    employeeStatus !== undefined ? employeeStatus : plan.employeeStatus;
  plan.employeeActivity =
    employeeActivity !== undefined ? employeeActivity : plan.employeeActivity;

  // Save the updated plan
  await plan.save();

  res
    .status(200)
    .json({ status: true, message: "Plan updated successfully", plan });
});

//delete plan api
export const deletePlan = asyncHandler(async (req, res) => {
  const { id } = req?.params;
  if (!id) {
    res.status(500).json({ status: false, message: "Plan ID not provided" });
  }
  const plans = await planModel.findByIdAndDelete(id);
  res.status(200).json({ status: true, message: "Plan Deleted successfully." });
});
