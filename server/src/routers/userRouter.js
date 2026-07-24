import express from "express"
import { GetFormsForStudent, GetUserForms, UserCreateForm } from "../controllers/userController.js";
import { Protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-form" , Protect, UserCreateForm);
router.get("/get-forms" , Protect , GetUserForms);
router.get("/fill-form/:token" , Protect , GetFormsForStudent);

export default router;