import express from "express";
import { GetAllTeachers, GetTeacherForms, ApproveForm, DeleteForm, GetFormResponses, GetFormDetails, UpdateForm } from "../controllers/adminController.js";
import { Protect, AdminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-teachers", Protect, AdminProtect, GetAllTeachers);
router.get("/teacher-forms/:teacherId", Protect, AdminProtect, GetTeacherForms);
router.put("/form/:id/approve", Protect, AdminProtect, ApproveForm);
router.delete("/form/:id", Protect, AdminProtect, DeleteForm);
router.get("/form/:id/responses", Protect, AdminProtect, GetFormResponses);
router.get("/form/:id", Protect, AdminProtect, GetFormDetails);
router.put("/form/:id", Protect, AdminProtect, UpdateForm);

export default router;