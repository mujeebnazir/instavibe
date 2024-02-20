import mongoose, { Schema } from "mongoose";

const shareSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default Share = mongoose.model("Share", shareSchema);
