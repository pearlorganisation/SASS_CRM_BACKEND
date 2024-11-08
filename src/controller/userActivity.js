import mongoose from "mongoose";
import { userActivityModel } from "../models/userActivity.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

export const addUserActivity = asyncHandler(async (req, res) => {
  const {  action, details } = req.body;

  const user = req?.id;
  const adminId = req?.adminId;

  console.log("req.body",req.body, user, adminId);

  if (!user || !action || !adminId) {
    return res.status(400).json({ message: 'User ID, action, and admin ID are required.' });
  }

  const newLog = await userActivityModel.create({
    user,
    action,
    details: details || '', // Optional field
    adminId,
  });

  res.status(201).json({
    message: 'User activity log added successfully.',
    data: newLog,
  });
});

export const getUserActivitiesByAdmin = asyncHandler(async (req, res) => {
  const adminId = req?.adminId;

  if (!adminId) {
    return res.status(400).json({ message: 'Admin ID is required.' });
  }

  const activities = await userActivityModel.aggregate([
    { $match: { adminId: new mongoose.Types.ObjectId(adminId) } },

    {
      $group: {
        _id: "$user", 
        activities: {
          $push: {
            action: "$action",
            details: "$details",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
      },
    },

    {
      $lookup: {
        from: "users", 
        localField: "_id", 
        foreignField: "_id",
        as: "userInfo",
      },
    },

    { $unwind: "$userInfo" },
    {
      $project: {
        user: "$userInfo.name", 
        activities: 1,
      },
    },
  ]);

  res.status(200).json({
    message: "User activities grouped by user ID",
    data: activities,
  });
});


export const getUserActivitiesByUser = asyncHandler(async (req, res) => {
  const adminId = req?.adminId;
  const userId = req.params.userId;
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; 

  if (!adminId) {
    return res.status(400).json({ message: 'Admin ID is required.' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  const skip = (page - 1) * limit;

  const activities = await userActivityModel.find({
    adminId: new mongoose.Types.ObjectId(adminId),
    user: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 }) 
    .skip(skip)
    .limit(limit)
    .select('action details createdAt updatedAt');

  const totalActivities = await userActivityModel.countDocuments({
    adminId: new mongoose.Types.ObjectId(adminId),
    user: new mongoose.Types.ObjectId(userId),
  });

  res.status(200).json({
    message: "User activities for specified user ID",
    data: activities,
    pagination: {
      totalActivities,
      totalPages: Math.ceil(totalActivities / limit),
      currentPage: page,
      pageSize: activities.length,
    },
  });
});


