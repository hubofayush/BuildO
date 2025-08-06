import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";

dotenv.config({
  path: [".env.local", ".env"],
});

if (!process.env.DATABASE_URL) {
  throw new ApiError(400, "DATABASE_URL environment variable is required");
}
export const SQL = neon(`${process.env.DATABASE_URL}`);
