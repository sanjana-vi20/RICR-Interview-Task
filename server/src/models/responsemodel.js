import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    answers: [
      {
        questionId: { type: String, required: true },
        questionText: { type: String },
        answer: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
    isReFeedback: {
      type: Boolean,
      default: false,
    },
    previousAnswers: [
      {
        questionId: { type: String },
        questionText: { type: String },
        answer: { type: mongoose.Schema.Types.Mixed },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);