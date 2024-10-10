import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import attendeesModel from "../models/attendees.js";
import usersModel from "../models/users.js";

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

  const data = req.body;
  const csvName = req?.body[0].csvName;
  const date = new Date();
  const randomString = date.getTime();

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

  let adminId = req.id;

  if ([ROLES.EMPLOYEE_SALES, ROLES.EMPLOYEE_REMINDER].includes(req?.role)) {
    const user = await usersModel.findOne({ _id: req?.id });
    adminId = user?.adminId;
  }

  addFilter(pipeline, "adminId", adminId);

  //filtering
  if (req?.query) {
    const { email, gender, location, ageRangeMin, ageRangeMax, phone } = req?.query;

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
  const page = req?.params?.page || 1;
  const limit = 25;
  const skip = (page - 1) * limit;
  let totalPages = 1;

  const totalAttendees = await attendeesModel.countDocuments(pipeline);
  totalPages = Math.ceil(totalAttendees / limit);

  // Aggregate pipeline to join user data and match on email and recordType
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

    {
      $group: {
        _id: "$email",
        records: {
          $push: {
            _id: "$_id",
            firstName: "$firstName",
            lastName: "$lastName",
            phone: "$phone",
            employeeName: "$employeeName",
            csvName: "$csvName",
            csvId: "$csvId",
            recordType: "$recordType",
            date: "$date",
            timeInSession: "$timeInSession",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: true,
    message: "Attendees data found successfully",
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
  };

  // Aggregate pipeline to join user data and match on email and recordType
  const result = await attendeesModel.aggregate([
    { $match: pipeline },
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
    {
      $group: {
        _id: "$email",
        records: {
          $push: {
            _id: "$_id",
            firstName: "$firstName",
            lastName: "$lastName",
            phone: "$phone",
            employeeName: "$employeeName",
            csvName: "$csvName",
            csvId: "$csvId",
            recordType: "$recordType",
            date: "$date",
            timeInSession: "$timeInSession",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
      },
    },
  ]);

  res
    .status(200)
    .json({ status: true, message: "data found successfully", data: result });
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
  console.log(attendees);

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
