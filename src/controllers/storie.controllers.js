import cron from "node-cron";
import { ApiError } from "../utils/ApiError.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Storie } from "../models/storie.model.js";

import { Follow } from "../models/follow.model.js";
import { isValidObjectId } from "mongoose";

const createStorie = asyncHandler(async (req, res) => {
  const storieLocalPath = req.file?.path;

  const storieUrl = await uploadOnCloudinary(storieLocalPath);

  try {
    const storie = await Storie.create({
      content: storieUrl?.url,
      owner: req.user._id,
      isActive: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, storie, "storie created successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Internal server error: Something went wrong when creating storie"
    );
  }
});
// const getActiveStories = asyncHandler(async (req, res) => {
//   const currentTime = new Date();

//   const activeStories = await Storie.aggregate([
//     {
//       $lookup: {
//         from: "follows",
//         localField: "owner",
//         foreignField: "followingId",
//         as: "following",
//       },
//     },
//     {
//       $match: {
//         $and: [
//           { "following.followerId": req.user?._id },
//           { createdAt: { $gte: new Date(currentTime - 24 * 60 * 60 * 1000) } }, // Assuming a 24-hour expiration
//         ],
//       },
//     },
//   ]);
//   if (!activeStories.length) {
//     throw new ApiError(400, "zero active stories or Error while aggregating");
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, activeStories, "Active stories fetched successfully")
//     );
// });

const getActiveStories = asyncHandler(async (req, res) => {
  try {
    const currentUser = req.user._id;

    // Find the users that the current user is following
    const followingIds = await Follow.find({
      followerId: currentUser,
    }).distinct("followingId");
    console.log(followingIds);
    // Find active stories of the users that the current user is following
    const activeStories = await Storie.find({
      owner: { $in: [...followingIds, currentUser] },
      isActive: true,
    }).populate("owner", "username displayName profilePicture");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          activeStories,
          "Active stories fetched successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Internal server error: Something went wrong fetching active stories"
    );
  }
});
const deleteStorie = asyncHandler(async (req, res) => {
  const { storieId } = req.params;
  if (!isValidObjectId(storieId)) {
    throw new ApiError(404, "Invalid StorieId");
  }
  try {
    const deletedStorie = await Storie.findByIdAndDelete(storieId);
    if (!deletedStorie) {
      // If storie is not found, return a 404 status code
      throw new ApiError(404, "Storie not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Storie deleted successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Internal server error: Something went wrong when deleting storie"
    );
  }
});
const deleteExpiredStories = async () => {
  try {
    const currentTime = new Date();

    // Find and delete all stories that have completed 24 hours
    const expiredStories = await Storie.find({
      createdAt: { $lt: new Date(currentTime - 24 * 60 * 60 * 1000) }, // Assuming a 24-hour expiration
    });

    if (expiredStories.length > 0) {
      // Delete the expired stories
      await Storie.deleteMany({
        createdAt: { $lt: new Date(currentTime - 24 * 60 * 60 * 1000) }, // Assuming a 24-hour expiration
      });

      console.log(`${expiredStories.length} stories deleted successfully.`);
    } else {
      console.log("No expired stories found.");
    }
  } catch (error) {
    console.error("Error while deleting expired stories:", error);
  }
};

cron.schedule("0 0 * * *", deleteExpiredStories);

/*
TASK: TO IMPLETED THE FOLLOWING IN APP.JS

// Import the storieController
const storieController = require('./controllers/storieController'); // Adjust the path based on your project structure

// Run the deleteExpiredStories function
storieController.deleteExpiredStories();

// Start your application logic here
// 
*/
export { createStorie, getActiveStories, deleteStorie };
