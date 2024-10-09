import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      // unique: true,
    },
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      // required: [true, "Last Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      // required: [true, "phone is required"],
      trim: true,
    },
    timeInSession: {
      type: Number,
      required: [true, "time in session required"],
      default: 0,
    },
    leadType: {
      type: String,
      default: null,
    },
    date: {
      type: String,
      required: [true, "Webinar Date is required"],
    },
    csvName: {
      type: String,
      required: [true, "csv name is required"],
    },
    csvId: {
      type: String,
      required: [true, "csv id is required"],
    },
    recordType: {
      type: String,
      enums: ["sales", "reminder"],
      default: "sales",
      required: [true, "csv id is required"],
    },
    gender: {
      type: String,
      enums: ["male", "female", "others"],
    },
  },
  { timestamps: true }
);

attendeeSchema.index({ csvId: 1, recordType: 1 });

const attendeesModel = mongoose.model("attendee", attendeeSchema);

export default attendeesModel;
