import express from "express"
import { UserCreateForm } from "../controllers/userController.js";

const router = express.Router();

router.post("/create-form" , UserCreateForm);

export default router;