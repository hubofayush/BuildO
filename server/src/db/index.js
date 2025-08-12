import mongoose from "mongoose";
import dotenv from "dotenv";
import { DATABASE_NAME } from "../constants.js";
dotenv.config({
    path: [".env.local", ".env"],
    quiet: true,
});

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}${DATABASE_NAME}`
        );

        console.log(
            `MongoDB Connected\nHost:${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log(`MongoDB Error: ${error}`);
    }
};
export { connectDB };
