import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getAllPosts = asyncHandler(async (req, res) => {});
const createPost = asyncHandler(async (req, res) => {});
const getPost = asyncHandler(async (req, res) => {});
const updatePost = asyncHandler(async (req, res) => {});
const deletePost = asyncHandler(async (req, res) => {});
const togglePublishStatus = asyncHandler(async (req, res) => {});
