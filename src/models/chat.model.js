import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }], // Reference to the Message model
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
