import express from "express";
import { generateAiStream, generateAiName } from "../controllers/aiController.js";
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.post("/stream",generateAiStream);
router.post("/chatname",authenticate, generateAiName);


export default router;