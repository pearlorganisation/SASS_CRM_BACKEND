import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, "Plan name is required"],
    },
    price: {
      type: Number,
      unique: true,
      required: [true, "Plan Price is required"],
    },
    planExpiry: {
      type: Number,
      required: [true, "plan validity is required"],
    },
    employeesCount: {
      type: Number,
      required: [true, "Employee count is required"],
      default: 1,
    },
    contactUploadLimit: {
      type: Number,
      required: [true, "Contact upload limit is required"],
      default: 1,
    },
    employeeReminder: {
      type: Boolean,
      default: false
    },
    purchaseHistory: {
      type: Boolean,
      default: false
    },
    employeeStatus: {
      type: Boolean,
      default: false
    },
    employeeActivity: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

export const planModel = mongoose.model("plan", planSchema, "plan");


