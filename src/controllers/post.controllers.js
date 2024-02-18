import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType } = req.query;

  // Get logged-in user ID from request (assuming it's available)
  const currentUserId = req.user._id;

  const pipeline = [];

  // Join with follows collection to find users followed by the current user
  pipeline.push({
    $lookup: {
      from: "follows",
      localField: "owner", // Match owner ID of the post with followingId in follows
      foreignField: "followingId",
      as: "following",
    },
  });

  // Filter posts where owner ID is present in the current user's following array
  pipeline.push({
    $match: {
      owner: { $in: ["$following._id"] },
    },
  });

  // Optional: Additional filtering based on query or userId
  if (query) {
    pipeline.push({
      $match: {
        title: { $regex: new RegExp(query, "i") },
      },
    });
  }

  if (currentUserId) {
    pipeline.push({
      $match: {
        owner: mongoose.Types.ObjectId(currentUserId),
      },
    });
  }

  // Add sorting stage if sortBy is provided
  if (sortBy) {
    const sortStage = {
      $sort: {
        [sortBy]: sortType === "desc" ? -1 : 1,
      },
    };
    pipeline.push(sortStage);
  }

  // Add pagination stages
  const skipStage = { $skip: (page - 1) * limit };
  const limitStage = { $limit: Number(limit) };
  pipeline.push(skipStage, limitStage);

  // Perform the aggregation
  const result = await Post.aggregate(pipeline);

  if (!result) {
    return new ApiError(400, "Error while aggregating all Posts");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Successfully fetched followed users' posts")
    );
});
const createPost = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const postLocalPath = req.files?.path;
  if (!postLocalPath) {
    throw new ApiError(404, "Post not found");
  }
  const post = await uploadOnCloudinary(postLocalPath);
  if (!post) {
    throw new ApiError(404, "Error while uploading to cloudinary");
  }

  const newPost = await Post.create({
    post: post.url,
    description: description,
    isPublished: true,
    owner: req.user._id,
  });

  const createdPost = await Post.findById(newPost._id);
  if (!createdPost) {
    throw new ApiError(404, "Post not found or error while creating post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdPost, "Post created successfully"));
});
const getThePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(404, "Invalid postId");
  }

  const postDetails = await Post.aggregate([
    {
      $match: { _id: postId },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postId",
        as: "totalLikes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "totalComments",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$totalLikes",
        },
        commentsCount: {
          $size: "$totalComments",
        },
      },
    },
    {
      $project: {
        post: 1,
        description: 1,
        likesCount: 1,
        commentsCount: 1,
        totalComments: 1,
        owner: 1,
      },
    },
  ]);

  if (!postDetails.length) {
    throw new ApiError(
      404,
      "Post Details not found or Error while Aggregating"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, postDetails, "Post fetched sucessfully!"));
});
const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { description } = req.body;
  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post");
  }
  if (!description?.trim()) {
    throw new ApiError(400, " Description required");
  }

  const updatePost = await Post.findByIdAndUpdate(
    postId,
    {
      description: description,
    },
    { new: true }
  );

  if (!updatePost) {
    throw new ApiError(400, "Post not updated!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatePost, "Post updated sucessfully!"));
});
const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post");
  }
  try {
    await Post.findByIdAndDelete(postId);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Post has been deleted successfully"));
  } catch (error) {
    throw new ApiError(400, "Post not deleted or Error while deleting post");
  }
});
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "No valid post ID available");
  }

  const postById = await Post.findById(postId);
  const statusChanged = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        isPublished: !postById.isPublished,
      },
    },
    { new: true }
  );

  if (!statusChanged) {
    throw new ApiError(400, "status not changed!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, statusChanged, "post status toggled successfully")
    );
});
