import express from "express";
import { GetAllTeachers } from "../controllers/adminController.js";

const router = express.Router();

router.get("/get-teachers" , GetAllTeachers);

export default router;