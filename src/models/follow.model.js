import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(
  {
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default Follow = mongoose.model("Follow", followSchema);
