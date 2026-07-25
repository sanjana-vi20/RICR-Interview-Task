import express from "express"
import { GetFormsForStudent, GetUserForms, SubmitResponse, UserCreateForm, ToggleFormActive, FetchResponse } from "../controllers/userController.js";
import { DeleteForm, GetFormDetails, UpdateForm, GetFormResponses } from "../controllers/adminController.js";
import { Protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-form" , Protect, UserCreateForm);
router.get("/get-forms" , Protect , GetUserForms);
router.get("/fill-form/:token", GetFormsForStudent);
router.post("/submit-feedback/:token" , SubmitResponse);
router.patch("/toggle-form/:id", Protect, ToggleFormActive);
router.delete("/delete-form/:id", Protect, DeleteForm);
router.get("/form/:id", Protect, GetFormDetails);
router.put("/form/:id", Protect, UpdateForm);
router.get("/form/:id/responses", Protect, GetFormResponses);
router.get("/fetch-response/:formId" , Protect , FetchResponse);

export default router;