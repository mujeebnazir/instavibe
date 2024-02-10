import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dec1rdsea",
  api_key: "195111359999818",
  api_secret: "xZndaDszg5JdargrNHCOcor1M7g",
});

const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localPath);
  } catch (error) {
    fs.unlinkSync(localPath); //remove the locally saved temp file as the operation failed
    return null;
  }
};
export { uploadOnCloudinary };
