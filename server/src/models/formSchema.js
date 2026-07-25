import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "short",
      "paragraph",
      "mcq",
      "checkbox",
      "dropdown",
      "star_rating",
      "yes_no",
    ],
  },
  options: [{ type: String }],
  maxStars: {
    type: Number,
    default: 10,
  },
  required: {
    type: Boolean,
    default: true,
  },
});

const formSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    questions: [questionSchema],

    allowedBatches: [{ type: String }],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByRole: {
      type: String,
      enum: ["admin", "teacher"],
      default: "teacher",
    },

    approvalStatus: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: false,
    },
    activatedAt: {
      type: Date,
      default: null,
    },
    formToken: {
      type: String,
      default: () => Math.random().toString(36).substring(2, 10),
    },
  },
  {
    timestamps: true,
  },
);

const Form = mongoose.model("Form", formSchema);
export default Form;
