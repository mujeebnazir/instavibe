import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Storie } from "../models/storie.model.js";
import { User } from "../models/user.model.js";
import { isValidObjectId } from "mongoose";

const createStorie = asyncHandler(async (req, res) => {});
const getActiveStories = asyncHandler(async (req, res) => {});
const deleteStorie = asyncHandler(async (req, res) => {});
const deleteExpiredStories = asyncHandler(async (req, res) => {});
