import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ROLES = JSON.parse(process.env.ROLES);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "E-mail is required"],
    trim: true,
  },
  userName: {
    type: String,
    required: [true, "userName is required"],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
  },
  adminId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    default: ROLES.SUPER_ADMIN,
  },
  // make api for this
  plan: {
    type: mongoose.Types.ObjectId,
    ref: "plan",
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: "roles",
    required: [true, "role is required"],
    // default: ROLES.ADMIN
  },
  assignments : [
    {
      email: {
        type: String,
        unique: true
      },
      recordType: {
        type: String,
      }
    }
  ]
});

const usersModel = new mongoose.model("user", userSchema);

export default usersModel;
