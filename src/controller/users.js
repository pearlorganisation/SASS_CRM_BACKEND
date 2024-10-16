import mongoose from "mongoose";
import attendeesModel from "../models/attendees.js";
import usersModel from "../models/users.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

import dotenv from "dotenv";
dotenv.config();

const ROLES = JSON.parse(process.env.ROLES);

export const getAllUsers = asyncHandler(async (req, res) => {
  //pagination
  const page = req?.params?.page || 1;
  const limit = 2;
  const skip = (page - 1) * limit;
  let totalPages = 1;

  const result = await usersModel.aggregate([
    { $match: { role: ROLES.ADMIN } },
    { $sort: { email: 1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "attendees", // Replace with the actual name of your attendees collection
        localField: "_id",
        foreignField: "adminId", // Replace with the actual field in attendees that references admin
        as: "attendees",
      },
    },
    {
      $addFields: {
        attendeesCount: { $size: "$attendees" },
      },
    },
    {
      $project: {
        attendees: 0, // Optionally exclude the attendees array if you only want the count
      },
    },
  ]);
  res.status(200).json({ status: true, data: result });
});

export const getAllClients = asyncHandler(async (req, res) => {
  const result = await usersModel.find({ role: ROLES.ADMIN });

  res.status(200).json({ status: true, data: result });
});
