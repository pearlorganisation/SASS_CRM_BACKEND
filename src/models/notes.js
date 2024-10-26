import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Attendee Email is required"],
      trim: true,
    },
    note: {
      type: String,
      required: [true, "Note is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      trim: true,
    },
    callDuration: {
      type: {
        hr: { type: String, default: "00" },
        min: { type: String, default: "00" },
        sec: { type: String, default: "00" },
      },
    },
    status: {
      type: String,
    },
    image: {
      type: [],
      required: false,
    },
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, 'Admin id is required!']
    },
  },
  { timestamps: true }
);

const noteModel = mongoose.model("note", noteSchema);

export default noteModel;
