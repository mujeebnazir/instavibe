import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleFollow = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { followerId } = req.user?._id;

  if (!userId && !followerId) {
    throw new ApiError(404, "userId and followerId both required");
  }

  let follow = await Follow.findOne({
    followerId: followerId,
    followingId: userId,
  });

  let followed = false;

  if (!follow) {
    follow = await Follow.create({
      followerId: followerId,
      followingId: userId,
    });

    followed = true;
  } else {
    await Follow.findByIdAndDelete(follow._id);
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, followed, "Follow has been toggled successfully")
    );
});

const getUserFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return new ApiError(404, "user not found!");
  }

  const followersList = await Follow.aggregate([
    {
      $match: {
        followingId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followingId",
        foreignField: "_id",
        as: "followers",
      },
    },
    {
      $project: {
        username: 1,
        displayName: 1,

        profilePicture: 1,
      },
    },
  ]);
  if (followersList.length == 0) {
    throw new ApiError(404, "No subscribers found!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, followersList, " Follower list fetched successfully")
    );
});

const getUserFollowings = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return new ApiError(404, "user not found!");
  }

  const followingList = await Follow.aggregate([
    {
      $match: {
        followerId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followerId",
        foreignField: "_id",
        as: "following",
      },
    },

    {
      $project: {
        username: 1,
        displayName: 1,
        profilePicture: 1,
      },
    },
  ]);

  if (followingList.length === 0) {
    throw new ApiError(404, "followingList is empty");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, followingList, "following list fetched successfully")
    );
});

export { toggleFollow, getUserFollowers, getUserFollowings };
