import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { connectCloudinary } from "./utils/cloudinary.js";
import aiRouter from "./routes/ai.routes.js";
import userRouter from "./routes/user.routes.js";
import logger from "./utils/logger.js";
const app = express();

await connectCloudinary();

app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static("public")); // Serve static files from 'public' directory
// Enable CORS for all origins and allow credentials
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(cookieparser()); // Parse cookies from incoming requests
app.use(clerkMiddleware()); // Clerk authentication middleware for all routes
// Health check route

app.get("/", (req, res) => {
    return res.send("hello form buildo");
});
app.use(requireAuth()); // Require authentication for all subsequent routes
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/user", userRouter);

// Global error handler
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`, {
        stack: err.stack,
        path: req.path,
    });
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

export { app };
