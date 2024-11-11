import mongoose from "mongoose";

const customDropdownOptionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "Admin ID is required"],
    },
  },
  { timestamps: true }
);

const customOptionModel = mongoose.model(
  "customOption",
  customDropdownOptionSchema
);

export default customOptionModel;
