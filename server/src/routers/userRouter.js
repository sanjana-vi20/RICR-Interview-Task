import express from "express"
import { GetFormsForStudent, GetUserForms, SubmitResponse, UserCreateForm } from "../controllers/userController.js";
import { Protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-form" , Protect, UserCreateForm);
router.get("/get-forms" , Protect , GetUserForms);
router.get("/fill-form/:token", GetFormsForStudent);
router.post("/submit-feedback/:token" , SubmitResponse);

export default router;