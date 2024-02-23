import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import { ApiError } from "./ApiError.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "image",
    });
    if (!response) {
      throw new ApiError(400, "Didn't get any response!");
    }
    fs.unlinkSync(localPath);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localPath); //remove the locally saved temp file as the operation failed
    return null;
  }
};
export { uploadOnCloudinary };
