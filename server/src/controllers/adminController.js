import User from "../models/usermodel.js";
import Form from "../models/formSchema.js";
import Response from "../models/responsemodel.js";

export const GetAllTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      isActive: true,
    });
    console.log("Response : ", teachers);

    res.status(200).json({ message: "fetched Successfully", data: teachers });
  } catch (error) {
    next(error);
  }
};

export const GetTeacherForms = async (req, res, next) => {
  try {
    const { teacherId } = req.params;
    const forms = await Form.find({ assignedTo: teacherId }).sort({ createdAt: -1 });

    const formsWithCounts = await Promise.all(
      forms.map(async (form) => {
        const count = await Response.countDocuments({ form: form._id });
        return { ...form.toObject(), responsesCount: count };
      })
    );

    res.status(200).json({ message: "Fetched successfully", data: formsWithCounts });
  } catch (error) {
    next(error);
  }
};

export const ApproveForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await Form.findByIdAndUpdate(
      id,
      {
        approvalStatus: "approved",
        approvedBy: req.user._id,
        approvedAt: new Date(),
        isActive: true, 
      },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({ message: "Form approved successfully", data: form });
  } catch (error) {
    next(error);
  }
};

export const DeleteForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Form.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Form not found" });
    }
    await Response.deleteMany({ form: id });
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const GetFormResponses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const responses = await Response.find({ form: id }).sort({ submittedAt: -1 });
    res.status(200).json({ message: "Fetched responses successfully", data: responses });
  } catch (error) {
    next(error);
  }
};

export const GetFormDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json({ message: "Fetched form details", data: form });
  } catch (error) {
    next(error);
  }
};

export const UpdateForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, questions } = req.body;

    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (title) form.title = title;
    if (description) form.description = description;
    
    if (questions && Array.isArray(questions)) {
       const sanitizedQuestions = questions.map((q) => {
        const isOptionBased = ["mcq", "checkbox", "dropdown"].includes(q.type);
        return {
          questionText: q.questionText,
          type: q.type || "short",
          required: q.required ?? true,
          options: isOptionBased && Array.isArray(q.options) ? q.options : [],
          maxStars: q.type === "star_rating" ? Number(q.maxStars) || 10 : 10,
        };
      });
      form.questions = sanitizedQuestions;
    }

    await form.save();
    res.status(200).json({ message: "Form updated successfully", data: form });
  } catch (error) {
    next(error);
  }
};
