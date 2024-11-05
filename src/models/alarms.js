import mongoose from "mongoose";

const alarmSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    setBy: {
      types: mongoose.Types.ObjectId,
      ref: "users",
      required: [true, "Alarm set by is required"],
    },
    email: {
      type: String,
      required: [true, "attendee email is required"],
    },
    recordType: {
      type: String,
      required: [true, "record type is required"],
    },
  },
  { timestamps: true }
);

const alarmModel = mongoose.model('alarms',alarmSchema,'alarms')

export default alarmModel