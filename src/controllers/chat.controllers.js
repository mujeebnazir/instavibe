import mongoose, { isValidObjectId } from "mongoose";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createChat = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user?._id;
    const { recepientId } = req.body;
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: loggedInUser, receiverId: recepientId },
            { senderId: recepientId, receiverId: loggedInUser },
          ],
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
    if (!messages.length) {
      throw new ApiError(400, "No messages or Error while processing");
    }
    const chat = await Chat.create({
      participants: [loggedInUser, recepientId],
      messages: [...messages],
    });
    if (!chat) {
      throw new ApiError(400, "chat not created");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, chat, "Chat setup successfull!"));
  } catch (error) {
    throw new ApiError(400, "Internal server error" || error.message);
  }
});
const getChatsForUser = asyncHandler(async (req, res) => {
  try {
    const loggedInUser = req.user?._id;
    if (!loggedInUser) {
      throw new ApiError(400, "LoggedIn user not found");
    }
    const chats = await Chat.aggregate([
      {
        $match: {
          participants: { $in: [loggedInUser] },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    if (!chats.length) {
      throw new ApiError(400, "No User chats found!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, chats, "User Chats fetched sucessfully!"));
  } catch (error) {
    throw new ApiError(400, error.message || "Internal Server Error");
  }
});
const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!isValidObjectId(chatId)) {
    throw new ApiError(400, "Invalid chatId");
  }
  const chatMessages = await Chat.findById(chatId).select("messages");

  if (!chatMessages) {
    throw new ApiError(404, "Chat document not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        chatMessages,
        "Chat conversation fetched sucessfully"
      )
    );
});
const sendMessageToChat = asyncHandler(async (req, res) => {
  const { chatId, newMessage } = req.body;
  if (!isValidObjectId(chatId) && !newMessage) {
    throw new ApiError(400, "Invalid chatId or newMessage not found");
  }
  const chat = await Chat.findByIdAndUpdate(
    mongoose.Types.ObjectId(chatId),
    {
      $push: {
        messages: newMessage,
      },
    },
    { new: true }
  );
  if (!chat) {
    throw new ApiError(200, "Chat not found, check your chatId again!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, chat, "Sucessfully send message to a chat."));
});
