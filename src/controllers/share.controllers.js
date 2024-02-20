import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Share } from "../models/share.model.js";
import { Post } from "../models/post.model.js";
import { isValidObjectId } from "mongoose";

const createShare = asyncHandler(async (req, res) => {
  // Implementation to create a new share record
  const { postId, recieverId } = req.params;
  if (!(isValidObjectId(postId) && isValidObjectId(recieverId))) {
    throw new ApiError(404, "Invalid PostId or RecieverId");
  }
  const post = await Post.findById(postId);
  const existingShare = await Share.findOne({
    postId,
    sender: req.user._id,
    recipient: recieverId,
  });

  if (existingShare) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          existingShare,
          "Post is already shared with the recipient"
        )
      );
  }

  const share = await Share.create({
    postId: post._id,
    ownerId: post.owner,
    sender: req.user._id,
    recipient: recieverId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, share, "Sucess while creating the share"));
});
