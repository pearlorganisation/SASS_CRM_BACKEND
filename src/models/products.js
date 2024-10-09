import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plan name is required"],
  },
  price: {
    type: Number,
    required: [true, "Plan Price is required"],
  },
  adminId:{
    type:mongoose.Types.ObjectId,
    required:[true,"Admin Id is required"]
  }
}, {timestamps: true});


export const productModel = mongoose.model('product', productSchema)