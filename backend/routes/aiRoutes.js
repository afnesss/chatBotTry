import express from "express";
import { generateAiRes } from "../controllers/aiController.js";
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post("/", generateAiRes);


export default router;