import { asyncHandler } from "../utils/AsyncHandler.js";
import OpenAI, { APIError } from "openai";
import { SQL } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { clerkClient } from "@clerk/express";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const generateArticle = asyncHandler(async (req, res) => {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const free_usage = req.free_usage;
    const plan = req.plan;
    console.log(plan);
    if (plan !== "premium" && free_usage >= 10) {
        throw new ApiError(400, "Limit Reached. Upgrade to contunue");
    }

    // Generate article using OpenAI
    const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_completion_tokens: length,
    });

    if (!response) {
        throw new ApiError(400, "responce not get");
    }

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
        throw new ApiError(400, "Error while genrating Article content");
    }

    // Save creation to database using parameterized query to prevent SQL injection

    try {
        await SQL.query(
            `INSERT INTO creations(user_id, prompt, content, type) VALUES($1, $2, $3, $4)`,
            [userId, prompt, content, "article"]
        );
    } catch (error) {
        throw new ApiError(400, error.message);
    }

    if (plan !== "premium") {
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + 1,
            },
        });
    }
    console.log(req.free_usage);
    return res
        .status(200)
        .json(new ApiResponse(200, content, "Article generated Successfully"));
    // } catch (error) {
    //   let message = error.message || "error while genrating article";
    //   let statusCode = error.statusCode || 500;
    //   return res
    //     .status(statusCode)
    //     .json(new ApiResponse(statusCode, [], message));
    // }
});

const generateBlogTitle = asyncHandler(async (req, res) => {
    try {
        const { userId, has } = req.auth();
        const { prompt } = req.body;
        const free_usage = req.free_usage;
        const plan = req.plan;

        if (!prompt || prompt === "") {
            throw new ApiError(400, "Prompt is required");
        }

        if (plan !== "premium" && free_usage >= 10) {
            throw new ApiError(400, "Limit Reached. Upgrade to contunue");
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_completion_tokens: 100,
        });

        if (!response) {
            throw new APIError(401, "Responce not get please try again");
        }

        const content = response.choices?.[0]?.message?.content;

        try {
            await SQL.query(
                `INSERT INTO creations(user_id, prompt, content, type) VALUES($1, $2, $3, $4)`,
                [userId, prompt, content, "blog-title"]
            );
        } catch (error) {
            throw new ApiError(
                401,
                `Error while uploding data on DB: ${error}`
            );
        }

        if (plan !== "premium") {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1,
                },
            });
        }

        return res
            .status(200)
            .json(new ApiResponse(200, content, "Blog title generated"));
    } catch (error) {
        let message = error.message || "error while genrating blog title";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});

const dummyController = asyncHandler(async (req, res) => {
    try {
        const { data } = req.body;
        return res
            .status(200)
            .json(new ApiResponse(200, [data], "working porperly"));
    } catch (error) {
        let message = error.message || "error while genrating article";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});
export { generateArticle, generateBlogTitle, dummyController };
