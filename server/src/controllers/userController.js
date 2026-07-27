import Form from "../models/formSchema.js";
import User from "../models/usermodel.js";
import Response from "../models/responsemodel.js";

export const UserCreateForm = async (req, res, next) => {
  try {
    const { title, description, allowedBatches, questions } = req.body;

    if (!title || !description) {
      const error = new Error("All Fields are Required");
      error.statusCode = 400;
      return next(error);
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      const error = new Error(
        "At least one question is required to create a form",
      );
      error.statusCode = 400;
      return next(error);
    }

    const sanitizedQuestions = questions.map((q) => {
      const isOptionBased = ["mcq", "checkbox", "dropdown"].includes(q.type);
      return {
        questionText: q.questionText,
        type: q.type,
        required: q.required ?? true,
        options: isOptionBased && Array.isArray(q.options) ? q.options : [],
        maxStars: q.type === "star_rating" ? Number(q.maxStars) || 10 : 10,
      };
    });

    console.log(sanitizedQuestions);

    const userRole = req.user.role;
    const isApproved = userRole === "admin";

    const form = await Form.create({
      title: title,
      description: description,
      allowedBatches: Array.isArray(allowedBatches) ? allowedBatches : [],
      questions: sanitizedQuestions,
      createdBy: req.user._id,
      assignedTo: req.user._id,
      createdByRole: userRole,
      approvalStatus: isApproved ? "approved" : "pending",
      approvedBy: isApproved ? req.user._id : null,
      approvedAt: isApproved ? new Date() : null,
      isActive: false,
    });

    res.status(200).json({ message: "Created Successfully", data: form });
  } catch (error) {
    next(error);
  }
};

export const GetUserForms = async (req, res, next) => {
  try {
    console.log(req.user._id);

    const user_id = req.user._id;

    const forms = await Form.find({ assignedTo: req.user._id }).sort({
      createdAt: -1,
    });
    console.log(forms);

    const formsWithCounts = await Promise.all(
      forms.map(async (form) => {
        const count = await Response.countDocuments({ form: form._id });
        return { ...form.toObject(), responsesCount: count };
      }),
    );

    res.status(200).json({
      message: "fetched successfully",
      data: formsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

export const GetFormsForStudent = async (req, res, next) => {
  try {
    const { token } = req.params;
    const form = await Form.findOne({ formToken: token });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!form.isActive) {
      return res.status(400).json({ message: "Form is not Active" });
    }

    res.status(200).json({ message: "Found", data: form });
  } catch (error) {
    next(error);
  }
};

export const SubmitResponse = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { studentName, batch, answers } = req.body;
    console.log(studentName , batch , answers);
    

    if (!studentName || !batch || !answers) {
      return res.status(400).json({ message: "Response not found" });
    }

    const form = await Form.findOne({ formToken: token });
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "form not found.",
      });
    }
    const normalizedName = studentName.trim();
    const normalizedBatch = batch.trim();

    const existingResponse = await Response.findOne({
      form: form._id,
      studentName: { $regex: new RegExp(`^${normalizedName}$`, "i") },
      batch: { $regex: new RegExp(`^${normalizedBatch}$`, "i") },
    });

    if (existingResponse) {
      existingResponse.isReFeedback = true;
      existingResponse.previousAnswers = existingResponse.answers;
      existingResponse.answers = answers;
      existingResponse.submittedAt = new Date();

      await existingResponse.save();

      return res.status(200).json({
        message: "Feedback updated successfully",
        data: existingResponse,
      });
    }

    const newResponse = new Response({
      form: form._id,
      studentName: normalizedName,
      batch: normalizedBatch,
      answers: answers,
      isReFeedback: false,
      previousAnswers: [],
      submittedAt: new Date(),
    });

    await newResponse.save();

    return res.status(201).json({
      message: "Feedback submitted successfully!",
      data: newResponse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const ToggleFormActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await Form.findById(id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.approvalStatus !== "approved") {
      return res.status(400).json({ message: "Cannot activate" });
    }
    await form.save();

    if (form.isActive) {
      setTimeout(
        async () => {
          await Form.findByIdAndUpdate(id, { isActive: false });
          console.log(`⏰ Form ${id} auto-deactivated after 15 minutes.`);
        },
        1 * 60 * 1000,
      );
    }
    res.status(200).json({
      message: `Form ${form.isActive ? "activated" : "deactivated"} successfully`,
      data: form,
    });
  } catch (error) {
    next(error);
  }
};

export const FetchResponse = async (req, res, next) => {
  try {
    const { formId } = req.params;
    console.log(formId);
    const responses = await Response.find({ form: formId });
    console.log("responses : ", responses);
    res.status(200).json({ message: "fetched", data: responses });
  } catch (error) {
    next(error);
  }
};
