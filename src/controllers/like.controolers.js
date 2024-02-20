//toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos
import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  //TODO: toggle like on post
  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "invalid video id");
  }

  const liked = await Like.findOne({
    postId: new mongoose.Types.ObjectId(postId),
    userId: new mongoose.Types.ObjectId(req.user?._id),
  });
  let postLiked = false;

  if (!liked) {
    await Like.create({
      postId: postId,
      userId: req.user?._id,
    });
    postLiked = true;
  } else {
    await Like.findByIdAndUpdate(liked?._id, {
      $unset: {
        postId: 1,
      },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, postLiked, "VideoLike toggled"));
});
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id");
  }
  try {
    const liked = await Like.findOne({
      commentId: new mongoose.Types.ObjectId(commentId),
      userId: new mongoose.Types.ObjectId(req.user?._id),
    });
    let commentLiked = false;

    if (!liked) {
      await Like.create({
        commentId: commentId,
        userId: req.user?._id,
      });
      commentLiked = true;
    } else {
      await Like.findByIdAndUpdate(liked?._id, {
        $unset: {
          commentId: 1,
        },
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, commentLiked, "CommentLike toggled"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Internal server error");
  }
});
