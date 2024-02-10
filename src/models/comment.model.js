import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({});

export default Comment = mongoose.Model("Comment", commentSchema);
