import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import { sidebarLinksModel } from "../models/sidebarLinks.js";
import { globalDataModel } from "../models/globalData.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Sidebar Links:
export const addSidebarLink = asyncHandler(async (req, res) => {
  const { title, link } = req?.body;

  if (!title && !link) {
    res.status(500).json({ status: false, message: "Incomplete parameters" });
  }

  const payload = {
    title,
    link,
  };

  const result = await sidebarLinksModel.create(payload);
  const data = await sidebarLinksModel.find();

  res.status(200).json({
    status: true,
    message: "Sidebar Link added successfully",
    data: data,
  });
});

export const getSidebarLinks = asyncHandler(async (req, res) => {
  const data = await sidebarLinksModel.find();
  res.status(200).json({
    status: true,
    message: "Sidebar Links found successfully",
    data: data,
  });
});

export const addGlobalData = asyncHandler(async (req, res) => {
  try {
    const { title, subTitle, fileType } = req.body;
    let uploadedFileUrl = null;

    if (!title && !fileType) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required parameters." });
    }

    console.log("Uploading image to Cloudinary...");
    const { uploadStatus, uploadResponse } = await uploadOnCloudinary(
      req?.files?.file
    );
    if (uploadStatus) {
      uploadedFileUrl = uploadResponse.url;
      console.log("Image uploaded:", uploadedFileUrl);
    } else {
      console.log("Failed to upload image");
    }

    const newGlobalData = new globalDataModel({
      item: uploadedFileUrl,
      title: title.trim(),
      subTitle: subTitle ? subTitle.trim() : undefined,
      itemType: fileType,
    });

    const savedData = await newGlobalData.save();

    res.status(201).json({
      status: true,
      message: "Global data added successfully.",
      data: savedData,
    });
  } catch (error) {
    console.error("Error in addGlobalData:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while adding global data.",
      error: error.message,
    });
  }
});

export const getGlobalData = asyncHandler(async (req, res) => {
  try {
    const latestData = await globalDataModel.findOne().sort({ _id: -1 });

    if (!latestData) {
      return res.status(404).json({
        status: false,
        message: "No global data found.",
      });
    }

    res.status(200).json({
      status: true,
      message: "Latest global data retrieved successfully.",
      data: latestData,
    });
  } catch (error) {
    console.error("Error in getGlobalData:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while retrieving global data.",
      error: error.message,
    });
  }
});

//-------------------
