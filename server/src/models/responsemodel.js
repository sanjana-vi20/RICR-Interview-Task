import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    // 1. Form Reference
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },

    // 2. Student Details
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

    // 3. Current Answers Array
    answers: [
      {
        questionId: { type: String, required: true },
        questionText: { type: String },
        answer: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],

    // 4. Re-Feedback Handling
    isReFeedback: {
      type: Boolean,
      default: false,
    },

    // 5. Previous Answers History (If updated/re-submitted)
    previousAnswers: [
      {
        questionId: { type: String },
        questionText: { type: String },
        answer: { type: mongoose.Schema.Types.Mixed },
      },
    ],

    // 6. Submission Timestamp
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);