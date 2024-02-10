import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({});

export default Like = mongoose.Model("Like", likeSchema);
