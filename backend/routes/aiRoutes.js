import express from "express";
import { generateAiRes } from "../controllers/aiController.js";

const router = express.Router();

router.post("/", generateAiRes);


export default router;