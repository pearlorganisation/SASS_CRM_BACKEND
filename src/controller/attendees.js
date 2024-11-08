import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import attendeesModel from "../models/attendees.js";
import usersModel from "../models/users.js";
import mongoose from "mongoose";

const ROLES = JSON.parse(process.env.ROLES);

const addFilter = (pipeline, key, value, condition = null) => {
  if (value !== undefined && value !== null) {
    pipeline[key] = condition ? condition(value) : value;
  }
};

export const addAttendees = asyncHandler(async (req, res) => {
  if (req?.role !== ROLES.ADMIN) {
    return res.status(500).json({
      status: false,
      message: "Only admin is allowed to assign attendees",
    });
  }

  const data = req?.body;
  const csvName = req?.body[0]?.csvName;
  const date = new Date();
  const randomString = date?.getTime();

  data.forEach((e) => {
    e.csvId = `${csvName}${randomString}`;
    e.adminId = req.id;
  });

  const result = await attendeesModel.insertMany(data);

  res
    .status(201)
    .json({ status: true, message: "Attendees Added successfully", result });
});

export const getAttendees = asyncHandler(async (req, res) => {
  let { recordType } = req?.query;

  if (!recordType) recordType = "sales";

  let pipeline = { recordType };
  addFilter(pipeline, "adminId", req?.adminId);

  //filtering
  if (req?.query) {
    const { email, gender, location, ageRangeMin, ageRangeMax, phone } =
      req?.query;

    if (email) {
      addFilter(pipeline, "email", { $regex: new RegExp(`^${email}$`, "i") });
    }

    if (phone) {
      addFilter(pipeline, "phone", phone);
    }

    if (gender) {
      addFilter(pipeline, "gender", gender);
    }

    if (location) {
      addFilter(pipeline, "location", location);
    }

    if (ageRangeMin || ageRangeMax) {
      pipeline.age = {};
      if (ageRangeMin) pipeline.age.$gte = Number(ageRangeMin);
      if (ageRangeMax) pipeline.age.$lte = Number(ageRangeMax);
    }
  }

  if (req?.body?.csvId) addFilter(pipeline, "csvId", req?.body?.csvId);

  //pagination
  const page = Number(req?.params?.page) || 1;
  const limit = Number(req?.query?.limit) || 30;
  const skip = (page - 1) * limit;
  let totalPages = 1;
  console.log(page,limit,skip);

  const totalAttendees = await attendeesModel.countDocuments(pipeline);
  console.log(totalAttendees)
  totalPages = Math.ceil(totalAttendees / limit);

  // Aggregation pipeline to join user data and match on email and recordType
  const result = await attendeesModel.aggregate([
    { $match: pipeline },
    { $sort: { email: 1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users", // Collection name for users
        let: { attendeeEmail: "$email", attendeeRecordType: "$recordType" }, // Fields from attendee
        pipeline: [
          { $unwind: "$assignments" }, // Unwind assignments array
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$assignments.email", "$$attendeeEmail"] },
                  { $eq: ["$assignments.recordType", "$$attendeeRecordType"] },
                ],
              },
            },
          },
          { $project: { userName: 1 } }, // Project only userName
        ],
        as: "employeeData", // Output field
      },
    },
    {
      $addFields: {
        employeeName: { $arrayElemAt: ["$employeeData.userName", 0] }, // Extract employee name
      },
    },
    { $project: { employeeData: 0 } }, // Exclude employeeData array from result

    //grouping attendee records as per unique email
    {
      $group: {
        _id: "$email",
        records: {
          $push: "$$ROOT",
        },
      },
    },
    // sorting the data for _id which is email in ascending order..
    { $sort: { _id: 1 } },
  ]);

  if (result.length > 0) {
    return res.status(200).json({
      status: true,
      message: "Attendees data found successfully",
      page,
      totalPages,
      result,
    });
  }
  res.status(500).json({
    status: true,
    message: "No data found.",
    page,
    totalPages,
    result,
  });
});

export const getAttendee = asyncHandler(async (req, res) => {
  const { email, recordType } = req?.query;
  if (!email && !recordType) {
    res.status(500).send({
      status: false,
      message: "Attendee E-Mail/recordType not provided",
    });
  }

  let pipeline = {
    email: { $regex: new RegExp(`^${email}$`, "i") }, // Case-insensitive email search
    recordType: recordType,
    adminId: req?.adminId,
  };

  // Aggregate pipeline to join user data and match on email and recordType
  const result = await attendeesModel.aggregate([
    { $match: pipeline },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$email",
        data: {
          $push: "$$ROOT",
        },
      },
    },
  ]);

  res
    .status(200)
    .json({ status: true, message: "data found successfully", data: result });
});

export const updateAttendee = asyncHandler(async (req, res) => {
  const { id } = req?.body;
  const payload = {
    firstName: req?.body?.firstName,
    lastName: req?.body?.lastName,
    phone: req?.body?.phone,
    gender: req?.body?.gender,
    location: req?.body?.location,
  };

  const result = await attendeesModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(`${id}`), adminId: req?.adminId },
    payload,
    {
      new: true,
      fields: { assignments: { $slice: -1 } },
    }
  );
  res
    .status(200)
    .json({
      status: true,
      message: "Attendee data updated successfully",
      data: result,
    });
});

export const getCsvData = asyncHandler(async (req, res) => {
  const page = req?.params?.page || 1;
  const limit = 8;
  const skip = (page - 1) * limit;

  const countPipeline = [
    {
      $group: {
        _id: "$csvId",
      },
    },
    {
      $count: "totalUniqueCsvIds",
    },
  ];

  const countResult = await attendeesModel.aggregate(countPipeline);
  const totalUniqueCsvIds =
    countResult.length > 0 ? countResult[0].totalUniqueCsvIds : 0;
  const totalPages = Math.ceil(totalUniqueCsvIds / limit);

  const pipeline = [
    {
      $sort: { createdAt: -1 }, // Sort by createdAt in descending order first
    },
    {
      $group: {
        _id: "$csvId",
        csvName: { $first: "$csvName" },
        date: { $first: "$date" },
        createdAt: { $first: "$createdAt" }, // Include the createdAt field to maintain order
        originalId: { $first: "$_id" },
        count: { $sum: 1 },
        // Include other fields as necessary
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const result = await attendeesModel.aggregate(pipeline);

  res.status(200).json({ status: true, page, totalPages, data: result });
});

export const deleteCsvData = asyncHandler(async (req, res) => {
  const { csvId } = req.params;
  const deleteResult = await attendeesModel.deleteMany({ csvId: csvId });
  res.status(200).send(deleteResult);
});

export const assignAttendees = asyncHandler(async (req, res) => {
  const { userId, attendees } = req?.body; // Assuming attendees is an array of attendee objects with attendeeId and recordType

  if (req?.role !== ROLES.ADMIN) {
    res.status(500).json({
      status: false,
      message: "Only admin is allowed to assign attendees",
    });
  }

  const adminId = req?.id;

  const isMyAdmin = await usersModel.findOne({ _id: userId, adminId: adminId });

  if (!isMyAdmin) {
    return res.status(500).json({
      status: false,
      message: "Only employee's admin is allowed to assign attendees",
    });
  }

  if (!userId && !attendees && attendees && attendees?.length === 0) {
    return res
      .status(500)
      .json({ status: false, message: "Missing userId/attendees" });
  }

  //getting user to be assigned's data as per userId
  const user = await usersModel.findOne({ _id: userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //type of employee role
  let employeeRole;
  switch (String(user?.role)) {
    case String(ROLES?.EMPLOYEE_SALES):
      employeeRole = "sales";
      break;
    case String(ROLES?.EMPLOYEE_REMINDER):
      employeeRole = "reminder";
      break;
    default:
      employeeRole = null;
      break;
  }

  if (!employeeRole) {
    res
      .status(500)
      .json({ status: false, message: "Employee role not Sales or Reminder" });
  }

  const assignedAttendees = { userId, assignments: [] };
  const failedAssignments = [];
  for (const attendeeData of attendees) {
    const { attendeeId } = attendeeData;

    // Checking if attendee exists in DB
    const attendee = await attendeesModel.findOne({
      email: attendeeId,
      recordType: employeeRole,
    });
    if (!attendee) {
      failedAssignments.push({
        attendeeId,
        reason: "Attendee not found",
      });
      continue;
    }

    // Checking if attendee is already assigned to another user
    const isAssigned = await usersModel.findOne({
      "assignments.email": attendee?.email,
      "assignments.recordType": attendee?.recordType,
    });

    if (isAssigned) {
      failedAssignments.push({
        attendeeId,
        reason: "Attendee is already assigned to a user",
      });
      continue;
    }

    // Checking if user's role allows assigning this type of attendee
    let roleAllowed = false;
    switch (attendee?.recordType) {
      case "sales":
        roleAllowed = String(user?.role) === String(ROLES?.EMPLOYEE_SALES);
        break;
      case "reminder":
        roleAllowed = String(user?.role) === String(ROLES?.EMPLOYEE_REMINDER);
        break;
      default:
        roleAllowed = false;
        break;
    }

    if (roleAllowed) {
      // Assign the attendee to the user

      const result = await usersModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            assignments: {
              email: attendee?.email,
              recordType: attendee?.recordType,
            },
            $slice: -1, // Returns only the last ent
          },
        },
        { new: true, fields: { assignments: { $slice: -1 } } }
      );

      assignedAttendees.assignments = result?.assignments;
    } else {
      failedAssignments.push({
        attendeeId,
        reason: "Role not allowed to get this attendee assigned",
      });
    }
  }

  // Respond with the results of assignment
  res.status(200).json({
    message: `Assignments: ${assignedAttendees.assignments.length} Successful, ${failedAssignments.length} Failed.`,
    assignedAttendees,
    failedAssignments,
  });
});

export const getAssignments = asyncHandler(async (req, res) => {
  console.log(req?.query?.employeeId);
  let employeeId;

  if (ROLES?.ADMIN === req?.role && req?.query?.employeeId) {
    employeeId = new mongoose.Types.ObjectId(`${req?.query?.employeeId}`);
  } else if (
    [ROLES.EMPLOYEE_SALES, ROLES.EMPLOYEE_REMINDER].includes(req?.role)
  ) {
    employeeId = new mongoose.Types.ObjectId(`${req?.id}`);
  } else {
    return res.status(500).json({
      status: false,
      message: "Missing EmployeeId or Role not allowed",
    });
  }
  //pagination
  const page = Number(req?.query?.page) || 1;
  const limit = Number(req?.query?.limit) || 25;
  const skip = (page - 1) * limit;
  let totalPages = 1;
  console.log(page,limit,skip);

  // Aggregation to get assignments
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

  // Return the final output
  totalPages = result.length > 0 ? Math.ceil(result[0].totalCount / limit) : 1;
  const paginatedResults = result.map((item) => item.results);

  res.status(200).json({
    status: true,
    page,
    totalPages: totalPages,
    data: paginatedResults,
  });
});

export const updateLeadType = asyncHandler(async (req, res) => {
  const { leadType, email, recordType } = req?.body;

  const payload = {
    leadType: leadType,
  };

  const result = await attendeesModel.updateMany(
    { email: email, recordType: recordType, adminId: req?.adminId },
    payload
  );

  res.status(200).json({
    status: true,
    message: "Lead type updated successfully.",
    data: result,
  });
});
