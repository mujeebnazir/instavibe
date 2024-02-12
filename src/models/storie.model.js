import mongoose, { Schema } from "mongoose";

const storieSchema = new Schema(
  {
    content: { type: String },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default Storie = mongoose.model("Storie", storieSchema);
