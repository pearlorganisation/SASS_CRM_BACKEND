import mongoose from "mongoose";

const leadTypeSchema = mongoose.Schema(
  {
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      unique: true,
      required: [true, "Admin id is required"],
    },
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
  { timestamps: true }
);

const leadTypeModel = mongoose.model("leadType", leadTypeSchema);

export default leadTypeModel
