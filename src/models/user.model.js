import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password required"],
    },
    profilePicture: {
      type: String, //clouinary url
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export default User = mongoose.model("User", userSchema);
