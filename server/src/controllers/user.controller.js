import mongoose from "mongoose";
import { Creations } from "../models/Creations.model.js";
import { Like } from "../models/Like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getCreations = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.auth();

        const creations = await Creations.find({ user_id: userId }).sort({
            createdAt: -1,
        });

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
        // const publishedCreations =
        //     await SQL`SELECT * FROM creations WHERE publish='TRUE' ORDER BY created_at DESC`;

        const publishedCreations = await Creations.find({ publish: true }).sort(
            { createdAt: -1 }
        );
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

// const toggleLike = asyncHandler(async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const { id } = req.body;

//         if (!id) {
//             throw new ApiError(400, "Content Id required");
//         }

//         // const [creation] = await SQL`SELECT * FROM creations WHERE id = ${id}`;
//         const creation = await Creations.findOne({ _id: id });

//         if (!creation) {
//             throw new ApiError(404, "invalid id or Creation not found");
//         }

//         console.log(creation);

//         const currentLikes = creation.likes;
//         const userIdString = userId.toString();

//         let updatedLikes;
//         let message;

//         if (currentLikes.includes(userIdString)) {
//             updatedLikes = currentLikes.filter((user) => user !== userIdString);
//             message = "Creation unliked";
//         } else {
//             updatedLikes = [...currentLikes, userIdString];
//             message = "Creation liked";
//         }

//         const formatedArray = `{${updatedLikes.join(",")}}`;

//         // const updatedCreation =
//         //     await SQL`UPDATE creations SET likes = ${formatedArray}::text[] WHERE id = ${id} `;

//         const updatedCreation = await Creations.findByIdAndUpdate(id, {
//             $set: {
//                 likes: formatedArray,
//             },
//         });

//         if (!updatedCreation) {
//             throw new ApiError(400, "failed to update creation (Like unlike)");
//         }

//         return res.status(200).json(new ApiResponse(200, [], message));
//     } catch (error) {
//         let message = error.message || "Error while toggling like on creation";
//         let statusCode = error.statusCode || 500;
//         return res
//             .status(statusCode)
//             .json(new ApiResponse(statusCode, [], message));
//     }
// });

const toggleLike = asyncHandler(async (req, res) => {
    // Start Transaction //
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.auth();

        const { id } = req.body;
        if (!id) {
            throw new ApiError(400, "Content Id required");
        }

        const creation = await Creations.findById(id).session(session);
        if (!creation) {
            throw new ApiError(404, "creation not found");
        }

        const likeQuery = { creation_id: id, user_id: userId };

        const existingLike = await Like.findOne(likeQuery).session(session);

        let message;
        if (existingLike) {
            // unlike creation
            await Like.deleteOne(likeQuery).session(session);
            await Creations.updateOne(
                { _id: id },
                {
                    $inc: {
                        like_count: -1,
                    },
                }
            ).session(session);
            message = "unliked";
        } else {
            const newLike = new Like(likeQuery);
            await newLike.save({ session });
            await Creations.updateOne(
                { _id: id },
                {
                    $inc: {
                        like_count: 1,
                    },
                }
            ).session(session);
            message = "liked";
        }

        await session.commitTransaction();
        session.endSession();

        const updatedCreation = await Creations.findById(id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { like_count: updatedCreation.like_count },
                    message
                )
            );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Toggle like error:", error);
        throw new ApiError(
            error.statusCode || 500,
            error.message || "Error toggling like"
        );
    }
});

const getLikers = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, "creation id required");
        }

        const likers = await Like.aggregate([
            {
                $match: {
                    creation_id: new mongoose.Types.ObjectId(id),
                },
            },
            { $project: { user_id: 1, createdAt: 1 } },
        ]);
        return res
            .status(200)
            .json(new ApiResponse(200, likers, "Likers fetched"));
    } catch (error) {
        let message = error.message || "error while genrating blog title";
        let statusCode = error.statusCode || 500;
        return res
            .status(statusCode)
            .json(new ApiResponse(statusCode, [], message));
    }
});

export { getCreations, getPublishCreations, toggleLike, getLikers };
