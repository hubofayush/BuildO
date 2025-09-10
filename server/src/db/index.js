import mongoose from "mongoose";
import dotenv from "dotenv";
import { DATABASE_NAME } from "../constants.js";
import logger from "../utils/logger.js";
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
        logger.info(
            `MongoDB Connected | Host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log(`MongoDB Error: ${error}`);
        logger.error(`MongoDB Connection Error: ${error.message}`, {
            stack: error.stack,
        });
    }
};
export { connectDB };
