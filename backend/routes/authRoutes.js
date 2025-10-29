import express from "express";
import { loginUser, registerUser, updateUserData } from "../controllers/authController.js";
import authenticate from "../middleware/auth.js";
import { upload } from "../files.js";
const router = express.Router();


router.post("/login", loginUser);
router.post("/register", registerUser);
// router.get("/me", getCurrentUser);
router.put("/update", authenticate, upload.single('profile_pic'), updateUserData);


export default router;