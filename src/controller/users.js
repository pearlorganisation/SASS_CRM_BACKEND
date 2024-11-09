import mongoose from "mongoose";
import attendeesModel from "../models/attendees.js";
import usersModel from "../models/users.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

import dotenv from "dotenv";
import rolesModel from "../models/roles.js";
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


export const getEmpployeeCount = asyncHandler(async (req, res) => {
 console.log(req?.id,
  'getEMp'
 )
 const adminId = new mongoose.Types.ObjectId(req?.id);
 const role = req?.role;

 const checkRole = await rolesModel.findById(role).lean();
 
 let employeeId;
 let queryObject = {};
 if(checkRole?.name === "SUPER_ADMIN"){

 }
 else if(checkRole?.name === "ADMIN"){
  queryObject = {
    adminId: adminId
  }
 }
 else{

  employeeId = new mongoose.Types.ObjectId(`${req?.id}`);

  const result = await usersModel.aggregate([
    { $match: { _id: employeeId } },
    { $unwind: "$assignments" }, // Unwind the assignments array
    {
      $lookup: {
        from: "attendees",
        let: {
          attendeeEmail: "$assignments.email",
          attendeeRecordType: "$assignments.recordType",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$email", "$$attendeeEmail"] },
                  { $eq: ["$recordType", "$$attendeeRecordType"] },
                ],
              },
            },
          },
        ],
        as: "assignments",
      },
    },
    {
      $group: {
        _id: "$_id", // Group back to user
        email: { $first: "$email" },
        userName: { $first: "$userName" },
        phone: { $first: "$phone" },
        assignments: { $push: { $arrayElemAt: ["$assignments", 0] } }, // Getting first matching assignment
      },
    },
    { $unwind: "$assignments" }, // Unwind assignments array!? lesgooo!

    // grouping the assignments just like we did in getting attendees becuz there are multiple for same email id! -_-
    {
      $group: {
        _id: "$assignments.email",
        records: {
          $push: {
            _id: "$assignments._id",
            firstName: "$assignments.firstName",
            lastName: "$assignments.lastName",
            phone: "$assignments.phone",
            employeeName: "$assignments.employeeName",
            leadType: "$assignments.leadType",
            csvName: "$assignments.csvName",
            csvId: "$assignments.csvId",
            recordType: "$assignments.recordType",
            date: "$assignments.date",
            timeInSession: "$assignments.timeInSession",
            createdAt: "$assignments.createdAt",
            updatedAt: "$assignments.updatedAt",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $group: {
        _id: null, // Group all results to calculate total count
        totalCount: { $sum: { $size: "$records" } }, // Count total records
        results: { $push: "$$ROOT" }, // Push all records into results array
      },
    },
    { $project: { _id: 0, totalCount: 1, results: 1 } }, // Format the output
    { $unwind: "$results" },
    { $skip: skip },
    { $limit: limit },
  ]);

 }


  const result = await usersModel.aggregate(
    [
      {
        $match: { adminId: adminId } 
      },
      {
        $group: {
          _id: '$role',
          employeeCount: {
            $sum: 1
          }
        }
      }
    ]
  )

  res.status(200).json({
    status: true,
    message: `Employee count for admin `,
    data: result,
  });
});