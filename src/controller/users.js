import usersModel from "../models/users.js";
import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";

import dotenv from "dotenv";
dotenv.config();

const ROLES = JSON.parse(process.env.ROLES);

export const getAllUsers = asyncHandler(async (req, res) => {
    const result = await usersModel.find()
    res.status(200).send(result)
})

export const getAllClients = asyncHandler(async (req, res) => {
    const result = await usersModel.find({role: ROLES.ADMIN})
    res.status(200).send(result)
})

