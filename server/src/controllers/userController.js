import Form from "../models/formSchema.js";
import User from "../models/usermodel.js";

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
        type: q.type || "short",
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
      assignedTo: req.user._id, // Default assigned to self
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

    res.status(200).json({
      message: "fetched successfully",
      data: forms,
    });
  } catch (error) {
    next(error);
  }
};

export const GetFormsForStudent = async(req, res ,next) =>{
  try {

    const {token }= req.params;
    const form = await Form.find({formToken:token});

    if(!form.isActive)
    {
      return res.status(400).json({message:"Form is not Active"});
    }

    res.status(200).json({message:"Found" , data : form});
    
  } catch (error) {
    next(error);
    
  }
}
