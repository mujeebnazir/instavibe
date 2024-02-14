import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    post: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    likes: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default Post = mongoose.model("Post", postSchema);
