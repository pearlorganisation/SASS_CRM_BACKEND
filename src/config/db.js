import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
// models
import AttendeeModel from "../models/attendees.js";


// function to connect connect the mongo database of provided url string
dotenv.config();
export const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "saasCrm",
      // autoIndex: true,
    });
    console.log(chalk.white.bgBlue("MongoDB connected successfully"));
  } catch (error) {
    console.log(
      error.message
        ? `MongoDB connection failed: ${error.message}`
        : `MongoDB connection failed`
    );
  }
};


export const syncIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "saasCrm" });
    
    // Sync the indexes
    await AttendeeModel.syncIndexes();
    console.log("Indexes have been synced successfully");

    // process.exit(0);  // Exit after syncing
  } catch (error) {
    console.error("Error syncing indexes:", error);
    process.exit(1);  // Exit with failure code
  }
};



