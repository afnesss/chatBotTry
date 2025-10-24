import express from "express";
import { generateAiStream, generateAiName } from "../controllers/aiController.js";
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post("/stream",generateAiStream);
router.post("/chatname",generateAiName);


export default router;