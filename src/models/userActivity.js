import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "User ID is required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
      unique: true,
    },
    activity: [
      {
        type: Date,
        required: [true, "activity dateTime is required"],
      },
    ],
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
