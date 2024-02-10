import mongoose, { Schema } from "mongoose";

const followSchema = new Schema({});

export default Follow = mongoose.Model("Follow", followSchema);
