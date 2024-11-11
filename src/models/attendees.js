import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      minLength: 1,
      maxLength: 100,
      required: [true, "Email is required"],
      trim: true,
    },
    firstName: {
      type: String,
      minLength: 1,
      maxLength: 100,
      required: false,
      trim: true,
      default: null,
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLength: 100,
      required: false,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      minLength: 1,
      maxLength: 20,
      required: false,
      trim: true,
      default: null,
    },
    timeInSession: {
      type: Number,
      required: false,
      default: 0,
    },
    leadType: {
      type: String,
      minLength: 1,
      maxLength: 50,
      trim: true,
      default: null,
    },
    date: {
      type: String,
      minLength: 1,
      required: [true, "Webinar Date is required"],
    },
    csvName: {
      type: String,
      minLength: 1,
      trim: true,
      required: [true, "csv name is required"],
    },
    csvId: {
      type: String,
      minLength: 1,
      trim: true,
      required: [true, "csv id is required"],
    },
    recordType: {
      type: String,
      minLength: 1,
      maxLength: 10,
      enums: ["sales", "reminder"],
      default: "sales",
      required: [true, "csv id is required"],
    },
    gender: {
      type: String,
      minLength: 1,
      maxLength: 10,
      enums: ["male", "female", "others"],
      required: false,
    },
    location: {
      type: String,
      minLength: 1,
      maxLength: 100,
      required: false,
    },
    adminId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "adminId is required"],
    },
  },
  { timestamps: true }
);

attendeeSchema.index({ csvId: 1, recordType: 1 });

const attendeesModel = mongoose.model("attendee", attendeeSchema);

export default attendeesModel;
