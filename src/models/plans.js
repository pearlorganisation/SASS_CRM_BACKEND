import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: [true, "Plan name is required"],
  },
  price: {
    type: Number,
    required: [true, "Plan Price is required"],
  },
  planExpiry: {
    type: Number,
    required: [true, 'plan validity is required']
  },
  employeesCount: {
    type: Number,
    required: [true, 'Employee count is required'],
    default: 1
  },
}, {timestamps: true});


export const planModel = mongoose.model('plan', planSchema, 'plan')