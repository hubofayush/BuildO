import { Router } from "express";
import { clerkAuth } from "../middlewares/clerkAuth.middleware.js";
import {
    getCreations,
    getLikers,
    getPublishCreations,
    toggleLike,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/get-user-creations").get(clerkAuth, getCreations);
router.route("/get-publish-creations").get(clerkAuth, getPublishCreations);

router.route("/toggle-like-creation").post(clerkAuth, toggleLike);

router.route("/get-likers/:id").get(clerkAuth, getLikers);
export default router;
