import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (files) => {
  try {
    if (!Array.isArray(files) || files.length === 0 || !files[0].path) {
      return { uploadStatus: false, uploadResponse: null };
    }

    const localFilePath = files[0].path;

    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);

    return { uploadStatus: true, uploadResponse: response };
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return {uploadStatus: false, uploadResponse: null};
  }
};

export { uploadOnCloudinary };