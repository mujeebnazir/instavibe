import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getAllPosts = asyncHandler(async (req, res) => {});
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
  if (!description) {
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
const togglePublishStatus = asyncHandler(async (req, res) => {});
