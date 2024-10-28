import mongoose from "mongoose";

const customSettingsSchema = mongoose.Schema(
  {
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      unique: true,
      required: [true, "Admin id is required"],
    },
    leadType: [
      {
        type: {
          name: {
            type: String,
            unique: true,
            required: [true, "lead type name is required"],
          },
          fontColor: {
            type: String,
            default: "#000000",
          },
          bgColor: {
            type: String,
            default: "#ffffff",
          },
        },
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const customSettingsModel = mongoose.model(
  "customSettings",
  customSettingsSchema,
  "customSettings"
);
