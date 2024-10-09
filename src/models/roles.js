import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Role name is required"],
    trim: true,
  }
});

const rolesModel = mongoose.model("roles", roleSchema,"roles");

export default rolesModel;
