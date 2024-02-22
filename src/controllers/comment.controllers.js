import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getPostComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a post
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const pipeline = [];

  // Add conditions based on the provided parameters
  if (isValidObjectId(postId)) {
    pipeline.push({
      $match: {
        postId: new mongoose.Types.ObjectId(postId),
      },
    });
  } else {
    throw new ApiError(400, "postId required");
  }

  // Add pagination stages
  const skipStage = { $skip: (page - 1) * limit };
  const limitStage = { $limit: Number(limit) };
  pipeline.push(skipStage, limitStage);

  // Perform the aggregation
  const result = await Comment.aggregate(pipeline);

  if (!result) {
    return new ApiError(400, "Error while aggregating comments");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Successfully fetched all comments"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { postId } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "comment not found");
  }
  if (!postId) {
    throw new ApiError(400, "postId not found");
  }

  const comment = await Comment.create({
    content: content,
    postId: new mongoose.Types.ObjectId(postId),
    owner: req.user?._id,
  });

  if (!comment) {
    throw new ApiError(400, "comment not created");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added sucessfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { updatedContent } = req.body;
  if (!updatedContent) {
    throw new ApiError(400, "comment not found");
  }
  if (!commentId) {
    throw new ApiError(400, "commentId not found");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: updatedContent,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(400, "comment not updated");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "comment updated sucessfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "commentId not found");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment deleted sucessfully"));
});

export { getPostComments, addComment, updateComment, deleteComment };
