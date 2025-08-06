import { clerkClient } from "@clerk/express";

// Middleware to check user plan and set free usage
export const clerkAuth = async (req, res, next) => {
    try {
        // Extract userId and plan checker from Clerk auth
        const { userId, has } = req.auth();

        // Check if user has premium plan
        const hasPremiumPlan = await has({ plan: "premium" });

        // Fetch user data from Clerk
        const user = await clerkClient.users.getUser(userId);

        // If not premium and free_usage exists, set it on request
        if (!hasPremiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            // Otherwise, reset free_usage to 0 in Clerk and request
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0,
                },
            });
            req.free_usage = 0;
        }

        // Set plan type on request
        req.plan = hasPremiumPlan ? "premium" : "free";
        next();
    } catch (error) {
        // Consider logging error for production
        console.error("ClerkAuth middleware error:", error);
        res.status(500).json({
            success: false,
            message: "Authentication error occurred",
        });
    }
};
