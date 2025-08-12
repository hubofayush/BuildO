import { asyncHandler } from "../utils/AsyncHandler.js";
import OpenAI, { APIError } from "openai";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import fs from "fs";
import { v2 as Cloudinary } from "cloudinary";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { Creations } from "../models/Creations.model.js";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const generateArticle = asyncHandler(async (req, res) => {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const free_usage = req.free_usage;
    const plan = req.plan;

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

    // try {
    //     await SQL.query(
    //         `INSERT INTO creations(user_id, prompt, content, type) VALUES($1, $2, $3, $4)`,
    //         [userId, prompt, content, "article"]
    //     );
    // } catch (error) {
    //     throw new ApiError(400, error.message);
    // }

    const uploadDb = await Creations.create({
        user_id: userId,
        prompt: prompt,
        content: content,
        type: "article",
    });

    if (!uploadDb) {
        throw new ApiError(400, "Cannot upload on db");
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

const generateImage = asyncHandler(async (req, res) => {
    try {
        const { userId, has } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== "premium") {
            throw new ApiError(400, "Subscribe to Generate Image");
        }

        if (!prompt || prompt === "") {
            throw new ApiError(400, "promt cannot be empty");
        }

        // clipdorp image generation //
        const formData = new FormData();
        formData.append("prompt", prompt);

        const { data } = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
                headers: {
                    "x-api-key": process.env.CLIPDROP_API_KEY,
                },
                responseType: "arraybuffer",
            }
        );

        const base64Image = `data:image/png;base64,${Buffer.from(
            data,
            "binary"
        ).toString("base64")}`;

        const uploadImage = await Cloudinary.uploader.upload(base64Image);
        if (!uploadImage) {
            throw new ApiError(
                400,
                "error while uploading image on cloudinary"
            );
        }

        const dbQuery = await SQL.query(
            `INSERT INTO creations(user_id, prompt, content, type, publish) VALUES($1, $2, $3, $4, $5)`,
            [userId, prompt, uploadImage.secure_url, "image", publish ?? false]
        );

        if (!dbQuery) {
            throw new ApiError(400, "DB query not worked");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, uploadImage.secure_url, "Image Generated")
            );
        // end of clipdorp image generation //
    } catch (error) {
        let message = error.message || "error while genrating blog title";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});

const removeBackground = asyncHandler(async (req, res) => {
    try {
        const { userId, has } = req.auth();
        const plan = req.plan;

        if (plan !== "premium") {
            throw new ApiError(
                403,
                "Subscribe to use Remove Background feature"
            );
        }

        const image = req.file;

        if (!image) {
            throw new ApiError(400, "Image required");
        }

        // const testUpload = await Cloudinary.uploader.upload(image.path);
        // console.log("Test Upload Response:", testUpload);

        const uploadImage = await Cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: "background_removal",
                    background_removal: "remove_the_background",
                },
            ],
        });
        // Log Cloudinary response for debugging
        // console.log("Cloudinary Upload Response:", uploadImage);

        fs.unlinkSync(image.path);
        // Validate Cloudinary response
        if (!uploadImage || !uploadImage.secure_url) {
            throw new ApiError(400, "Failed to process image on Cloudinary");
        }
        // await fs.promises.unlink(image.path).catch(() => {});

        const dbQuery = await SQL.query(
            `INSERT INTO creations(user_id,prompt,content,type) VALUES($1, $2, $3, $4)`,
            [
                userId,
                "Remove backgrund of image",
                uploadImage.secure_url,
                "image",
            ]
        );
        if (!dbQuery) {
            throw new ApiError(400, "db query failed");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    uploadImage.secure_url,
                    "Background removed successfully"
                )
            );
    } catch (error) {
        let message = error.message || "error while removing background";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});

const removeObject = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (plan !== "premium") {
            throw new ApiError(400, "Subscribe to use remove object");
        }

        if (!object || object === "" || !image) {
            throw new ApiError(400, "Object and image required");
        }

        let imageUpload;
        imageUpload = await Cloudinary.uploader.upload(image.path);
        if (!imageUpload) {
            throw new ApiError(404, "failed to upload image");
        }

        fs.unlinkSync(image.path);

        const imageUrl = Cloudinary.url(imageUpload.public_id, {
            transformation: [
                {
                    effect: `gen_remove:${object}`,
                    resource_type: "image",
                },
            ],
        });
        if (!imageUrl) {
            throw new ApiError(400, "Error while Oject removing");
        }

        const dbQuery = await SQL.query(
            `INSERT INTO creations(user_id,prompt,content,type) VALUES($1, $2, $3, $4)`,
            [userId, `Removed ${object} from image`, imageUrl, "image"]
        );

        if (!dbQuery) {
            throw new ApiError(400, "DB query failed");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, imageUrl, "Object removed successfully")
            );
    } catch (error) {
        let message = error.message || "error while removing object";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});

const reviewResume = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.auth();
        const plan = req.plan;
        const resume = req.file;

        if (plan !== "premium") {
            throw new ApiError(400, "Subscribe to use Review Resume feature");
        }

        if (!resume) {
            throw new ApiError(400, "Resume file is Required");
        }

        if (resume.size > 5 * 1024 * 1024) {
            throw new ApiError(400, "PDF size exceeded");
        }

        const resumeDataBuffer = await fs.promises.readFile(resume.path);
        const pdfData = await pdf(resumeDataBuffer);

        const prompt = `Review the following resume and provide constructive feedback on its strength, weakness and ares for improvement. Resume content:\n\n${pdfData.text}`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_completion_tokens: 1000,
        });

        fs.unlinkSync(resume.path);
        if (!response) {
            throw new ApiError(400, "AI responce error");
        }

        const content = response.choices?.[0]?.message?.content;

        const dbQuery = await SQL.query(
            `INSERT INTO creations(user_id,prompt,content,type) VALUES($1,$2,$3,$4)`,
            [userId, "Review Resume", content, "resume-review"]
        );
        if (!dbQuery) {
            throw new ApiError(400, "DB query failed");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, content, "Reviwed Resume content"));
    } catch (error) {
        let message = error.message || "error while review resume";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});

export {
    generateArticle,
    generateBlogTitle,
    generateImage,
    removeBackground,
    removeObject,
    reviewResume,
    dummyController,
};
