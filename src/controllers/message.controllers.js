import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { response } from "express";

const sendMessage = asyncHandler(async (req, res) => {
  const { msg } = req.body;
  const { receiverId } = req.params;
  const senderId = req.user?._id;
  if (!msg.trim()) {
    throw new ApiError(400, "message not found!");
  }
  try {
    const mesage = await Message.create({
      senderId: senderId,
      receiverId: receiverId,
      content: msg,
      readFlag: false,
    });

    if (!mesage) {
      throw new ApiError(400, "Error while saving message into Database");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, mesage, "message saved successfully"));
  } catch (error) {
    throw new ApiError(400, error.message || "Internal Server Error");
  }
});
const markAsRead = asyncHandler(async (req, res) => {
  try {
    const { messageId } = req.params;

    const updateMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        readFlag: true,
      },
      { new: true }
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, updateMessage, "message has been read by user")
      );
  } catch (error) {
    throw new ApiError(400, error.message || "Internal server error");
  }
});
