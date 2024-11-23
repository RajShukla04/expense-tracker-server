import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectTODatabase = async () => {
  try {
    const connect = await mongoose.connect(
      `${process.env.MONGO_URL}/${DB_NAME}`
    );
    console.log(`\n mongodb connected`);
  } catch (error) {
    console.log("database connection failed! ", error);
    process.exit(1);
  }
};

export default connectTODatabase;
