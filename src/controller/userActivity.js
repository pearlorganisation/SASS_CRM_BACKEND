import mongoose from "mongoose";
import { userActivityModel } from "../models/userActivity.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";


export const addUserActivity = asyncHandler(async (req, res) => {
    const {activityLog} = req?.body
    const userId = req?.id

    const activityDate = new Date(activityLog)
    const date = activityDate.setHours(1,1,1,1)
    console.log(new Date(date))

    if(!userId && !activityLog) {
        return res.status(500).json({status: false, message: "UserID/Activity log not Provided"})
    }

    const exists = await userActivityModel.findOne({userId: new mongoose.Types.ObjectId(`${userId}`),date: date })

    //if log exists it will patch the same entry otherwise will make a new one
    let result;
    console.log(exists)
    if(exists){
        result = await userActivityModel.findByIdAndUpdate(exists._id, {$push: {activity: new Date(activityLog)}})
    } else {
        result = await userActivityModel.create({user: new mongoose.Types.ObjectId(`${userId}`) , date: date, activity: [activityLog], adminId: req?.adminId})
    }

    res.status(200).json({status: true, message: 'activity update for the user', data:result})

})