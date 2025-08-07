import { Router } from "express";

import { clerkAuth } from "../middlewares/clerkAuth.middleware.js";
import {
    dummyController,
    generateArticle,
    generateBlogTitle,
    generateImage,
    removeBackground,
    removeObject,
    reviewResume,
} from "../controllers/ai.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/generateArticle").post(clerkAuth, generateArticle);
router.route("/generate-blogTitle").post(clerkAuth, generateBlogTitle);
router.route("/generate-image").post(clerkAuth, generateImage);

router
    .route("/remove-background")
    .post(clerkAuth, upload.single("image"), removeBackground);
router
    .route("/remove-object")
    .post(clerkAuth, upload.single("image"), removeObject);
router
    .route("/resume-review")
    .post(clerkAuth, upload.single("resume"), reviewResume);
router.route("/dummyRoute").post(dummyController);

export default router;
