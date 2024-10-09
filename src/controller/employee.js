import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import usersModel from "../models/users.js";

export const getEmployees = asyncHandler(async (req, res) => {

    const {adminId} = req?.query

    if(!adminId) {
        res.status(500).json({status: false, message: "Admin ID not found"})
    }

    const result = await usersModel.find({adminId: adminId}).populate("role")
    res.status(200).json({status: true, data: result})
    
})


