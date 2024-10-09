import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
        trim: true,
    },
    leadType: {
      type: String,
      default: null
    },
    csvId: {
        type: String,
        required: [true, "csv file id/name is required"]
    }
  },
  { timestamps: true }
);

const noteModel = mongoose.model("note", noteSchema);

export default noteModel
