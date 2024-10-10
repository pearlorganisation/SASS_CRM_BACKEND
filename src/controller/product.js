import { productModel } from "../models/products.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

export const addProduct = asyncHandler(async (req, res) => {
  await productModel.create(req?.body);
  res.status(201).json({ status: true, message: "Added product Successfully" });
});

export const getProducts = asyncHandler(async (req, res) => {
  const id = req?.id;

  // if (
  //   id &&
  //   [ROLES.EMPLOYEE_SALES, ROLES.EMPLOYEE_REMINDER].includes(req?.role)
  // ) {
  //   role = ROLES[`${selectedRole}`];
  // } else {
  //   res.status(500).json({
  //     status: false,
  //     message: "Only Admin level roles are allowed to create employees.",
  //   });
  // }

  const isMyAdmin = await usersModel.findOne({ _id: userId, adminId: adminId });

  if (!isMyAdmin) {
    return res.status(500).json({
      status: false,
      message: "Only employee's admin is allowed to assign attendees",
    });
  }

  const data = await productModel.find({ adminId: id });

  res.status(200).json({ status: true, data });
});
