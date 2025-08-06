import { Router } from "express";

import { clerkAuth } from "../middlewares/clerkAuth.middleware.js";
import {
    dummyController,
    generateArticle,
    generateBlogTitle,
    generateImage,
} from "../controllers/ai.controller.js";

const router = Router();

router.route("/generateArticle").post(clerkAuth, generateArticle);
router.route("/generate-blogTitle").post(clerkAuth, generateBlogTitle);
router.route("/generate-image").post(clerkAuth, generateImage);
router.route("/dummyRoute").post(dummyController);

export default router;
