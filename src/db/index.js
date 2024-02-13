import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    console.log("connection string: ", process.env.MONGO_URI);
    const uri = `${process.env.MONGO_URI}/${DB_NAME}`;
    const connectionInstance = await mongoose.connect(uri);
    console.log(
      `\n MongoDB Connected to HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;
