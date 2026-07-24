import express from "express"
import { UserLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", UserLogin);

export default router;