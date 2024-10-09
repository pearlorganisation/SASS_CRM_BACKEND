// ----------------------------------------Imports-----------------------------------------------
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { saveAccessTokenToCookie } from "../utils/index.js";
import { accessTokenValidity, refreshTokenValidity } from "../utils/index.js";
import usersModel from "../models/users.js";
import { planModel } from "../models/plans.js";

import dotenv from "dotenv";
dotenv.config();

const ROLES = JSON.parse(process.env.ROLES);
// console.log(ROLES)

// -------------------------------------------------------------------------------------------
// @desc - to fetch the users data
// @route - GET /auth/login
// @access - PUBLIC
export const login = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if (!userName && !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await usersModel.findOne({ userName });

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Incorrect UserName/Password" });
  }

  //matching password using bcrypt
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect UserName/Password" });
  }

  // accessToken - Generating Access Token
  const accessToken = jwt.sign(
    {
      id: user._id,
      rId: user.role,
      plan: user?.plan,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenValidity }
  );

  // Saving accessToken to the httpOnly Cookie
  saveAccessTokenToCookie(res, accessToken);

  return res.status(200).json({
    success: true,
    message: "Logged in Successfully",
    user: {
      id: user._id,
      userName: user?.userName,
      role: user?.role,
      plan: user?.plan,
    },
  });
});

// @desc - to generate a new refresh token
// @route - POST /auth/refresh
// @access - PUBLIC

export const refreshToken = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({
      success: false,
      message: "userName is required to generate Refresh Token",
    });
  }

  const user = await usersModel.findOne({ userName });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User Does Not Exists" });
  }

  // clearing the existing cookie
  res.clearCookie(process.env.ACCESS_TOKEN_NAME);

  // refreshToken - generating a new refresh token with extended time
  const refreshToken = jwt.sign(
    {
      id: user._id,
      rId: user.role,
      plan: user?.plan,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: refreshTokenValidity }
  );

  // Saving refreshToken to the httpOnly Cookie
  saveAccessTokenToCookie(res, refreshToken);

  return res.status(200).json({
    success: true,
    message: "Refresh Token Generated",
  });
});

// @desc - to update the users password
// @route - PUT /auth/resetPassword
// @access - PRIVATE
// export const resetPassword = async (req, res) => {
//   try {
//     const { email, password, confirmPassword } = req.body;

//     if (!email || !password || !confirmPassword) {
//       return res.status(400).json({
//         status: "FAILURE",
//         status: "Email Id, Password and Confirm Password are required",
//       });
//     }

//     const user = await usersModel.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email does not exists" });
//     }

//     if (password.length < 10 || confirmPassword.length < 10) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Password and Confirm Password must have length greater than or equal to 10",
//       });
//     }

//     if (password !== confirmPassword) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Password does not match" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await usersModel.findOneAndUpdate(
//       { email },
//       { password: hashedPassword },
//       { $new: true }
//     );

//     return res
//       .status(200)
//       .json({ success: true, message: "Password Updated Successfully" });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Internal Server Error! ${error.message}`,
//     });
//   }
// };

// @desc -signup for client panel
// @route - POST /auth/signup

export const signup = asyncHandler(async (req, res) => {
  const { password, userName, phone, email } = req?.body;

  if (!password || !userName || !email) {
    res.status(500).json({ status: false, message: "Incomplete form inputs" });
  }

  const isUserExists = await usersModel.findOne({ email });
  if (isUserExists) {
    res.status(404).json({ status: false, message: "User already Exists" });
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  let payload = {
    userName,
    email,
    password: hashPassword,
    phone,
  };
  const savedUser = await usersModel.create(payload);

  res.status(200).json({
    status: "SUCCESS",
    message: "User created successfully",
    data: savedUser,
  });
});

// @desc - creation for employee by admin
// @route - POST /employee/
export const createEmployee = asyncHandler(async (req, res) => {
  const { password, userName, phone, email, selectedRole, adminId } = req?.body;
  let role, plan;


  if (!password && !userName && !email && !adminId && !selectedRole) {
    res.status(500).json({ status: false, message: "Incomplete form inputs" });
  }
  // console.log(selectedRole)


  if (adminId && req?.role === ROLES.ADMIN) {
    // console.log(selectedRole)
    role = ROLES[`${selectedRole}`];
  } else {
    res.status(500).json({status: false, message: "Only Admin level roles are allowed to create employees."})
  }

  console.log(role)

  if (req?.plan) {
    plan = await planModel.findById(req?.plan);
  } else {
    res.status(500).json({ status: false, message: "No Plan Found" });
  }


  const isUserExists = await usersModel.findOne({ email });
  if (isUserExists) {
    res.status(404).json({ status: false, message: "User already Exists" });
    return;
  }

  // const AdminId = new mongoose.Schema.Types.ObjectId(adminId)

  const employeeCount = await usersModel.countDocuments({ adminId: adminId });

  console.log(employeeCount, plan.employeesCount);
  // return;
  if (employeeCount < plan.employeesCount) {
    const hashPassword = await bcrypt.hash(password, 10);

    console.log(role,"role")

    const savedUser = await usersModel.create({
      userName,
      email,
      password: hashPassword,
      phone,
      role,
      adminId,
    });

    res.status(200).json({
      status: "SUCCESS",
      message: "User created successfully",
      data: savedUser,
    });
  } else {
    res.status(500).json({
      status: false,
      message: "Employee limit reached for this plan.",
    });
  }
});

// @desc - to fetch the users data
// @route - POST /auth/logout
// @access - PUBLIC
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(process.env.ACCESS_TOKEN_NAME);
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

// @desc - signup for admin
// @route - POST /auth/signup
// export const adminSignup = asyncHandler(async (req, res) => {
//   const { email, userName, password } = req?.body;
//   const isUserExists = await usersModel.findOne({ userName });
//   if (isUserExists)
//     res.status(404).json({ status: false, message: "User already Exists" });

//   const hashPassword = await bcrypt.hash(password, 10);
//   const savedUser = await usersModel.create({
//     email: email,
//     userName: userName,
//     password: hashPassword,
//     role: ROLES.SUPER_ADMIN,
//   });

//   res.status(200).json({
//     status: "SUCCESS",
//     message: "User created successfully",
//     data: savedUser,
//   });
// });
