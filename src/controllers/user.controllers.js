import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, `Error while generating refresh and access token`);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, displayName, password, email } = req.body;

  if (
    [displayName, email, username, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const userExist = await User.findOne({ $or: [{ username }, { email }] });

  if (userExist) {
    throw new ApiError(
      400,
      "User already exists, use another email or password!"
    );
  }

  const profilePicLocalPath = req.files?.profilePicture[0]?.path;

  if (!profilePicLocalPath) {
    throw new ApiError(404, "Profile picture not found!");
  }

  const profilePicture = await uploadOnCloudinary(profilePicLocalPath);
  if (!profilePicture) {
    throw new ApiError(400, "Error while uploading to cloudinary");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    displayName,
    email,
    password,
    profilePicture: profilePicture?.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
