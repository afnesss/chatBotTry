import express from "express";
import { loginUser, registerUser, updateUserData } from "../controllers/authController.js";
import authenticate from "../middleware/auth.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
// router.get("/me", getCurrentUser);
router.put("/update", authenticate, updateUserData);


export default router;