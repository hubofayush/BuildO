import { SQL } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getCreations = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.auth();

        const creations =
            await SQL`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

        return res
            .status(200)
            .json(new ApiResponse(200, creations, "Creations"));
    } catch (error) {
        let message = error.message || "error while genrating blog title";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});

const getPublishCreations = asyncHandler(async (req, res) => {
    try {
        const publishedCreations =
            await SQL`SELECT * FROM creations WHERE publish='TRUE' ORDER BY created_at DESC`;

        return res
            .status(200)
            .json(
                new ApiResponse(200, publishedCreations, "Publish creations")
            );
    } catch (error) {
        let message = error.message || "error while genrating blog title";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});

const toggleLike = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.body;

        if (!id) {
            throw new ApiError(400, "Content Id required");
        }

        const [creation] = await SQL`SELECT * FROM creations WHERE id = ${id}`;

        if (!creation) {
            throw new ApiError(404, "invalid id or Creation not found");
        }

        const currentLikes = creation.likes;
        const userIdString = userId.toString();

        let updatedLikes;
        let message;

        if (currentLikes.includes(userIdString)) {
            updatedLikes = currentLikes.filter((user) => user !== userIdString);
            message = "Creation unliked";
        } else {
            updatedLikes = [...currentLikes, userIdString];
            message = "Creation liked";
        }

        const formatedArray = `{${updatedLikes.join(",")}}`;

        const updatedCreation =
            await SQL`UPDATE creations SET likes = ${formatedArray}::text[] WHERE id = ${id} `;

        if (!updatedCreation) {
            throw new ApiError(400, "failed to update creation (Like unlike)");
        }

        return res.status(200).json(new ApiResponse(200, [], message));
    } catch (error) {
        let message = error.message || "Error while toggling like on creation";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});

export { getCreations, getPublishCreations, toggleLike };
