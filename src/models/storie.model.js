import mongoose, { Schema } from "mongoose";

const storieSchema = new Schema(
  {
    content: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: { type: Boolean },
  },
  { timestamps: true }
);

export const Storie = mongoose.model("Storie", storieSchema);
