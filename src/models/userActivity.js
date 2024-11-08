import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: [true, 'Admin ID is required']
    }
  },
  { timestamps: true }
);

export const userActivityModel = mongoose.model(
  "userActivities",
  userActivitySchema,
  "userActivities"
);
