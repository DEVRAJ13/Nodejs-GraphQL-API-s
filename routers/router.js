import express from 'express';
import { uploadMiddleware, authenticate } from "../util/util.js";
import { upload } from "../controller/controller.js";

const router = express.Router();

router.post("/upload", authenticate, uploadMiddleware.single("file"), upload);

export default router;
