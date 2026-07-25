import React, { useState } from "react";
import api from "../config/API";
import toast from "react-hot-toast";

const QUESTION_TYPES = [
  { value: "short", label: "Short Answer" },
  { value: "paragraph", label: "Paragraph" },
  { value: "mcq", label: "Multiple Choice (MCQ)" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "dropdown", label: "Dropdown" },
  { value: "star_rating", label: "Star Rating (1-10)" },
  { value: "yes_no", label: "Yes / No" },
];

const CreateForm = ({ onClose }) => {
  const [loading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowedBatches, setAllowedBatches] = useState("");

  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      questionText: "",
      type: "short",
      options: ["Option 1", "Option 2"],
      maxStars: 10,
      required: true,
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        questionText: "",
        type: "short",
        required: true,
        options: ["Option 1", "Option 2"],
        maxStars: 10,
      },
    ]);
  };
  const handleClose = ()=>{
    onClose();
  }

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleDuplicateQuestion = (index) => {
    const qToCopy = questions[index];
    const duplicated = {
      ...qToCopy,
      id: Date.now(),
      options: [...qToCopy.options],
    };
    const updated = [...questions];
    updated.splice(index + 1, 0, duplicated);
    setQuestions(updated);
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };
  
  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push(
      `Option ${updated[qIndex].options.length + 1}`,
    );
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter(
      (_, i) => i !== optIndex,
    );
    setQuestions(updated);
  };

  const handleUpdateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const batchArray = allowedBatches
    ? allowedBatches
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
    : [];

  const formData = {
    title,
    description,
    allowedBatches: batchArray,
    questions: questions.map((q) => ({
      questionText: q.questionText,
      type: q.type,
      required: q.required,
      options: ["mcq", "checkbox", "dropdown"].includes(q.type)
        ? q.options
        : [],
      maxStars: q.type === "star_rating" ? q.maxStars || 10 : undefined,
    })),
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/user/create-form", formData);
      console.log( "Backend data :", res?.data);
      
      toast.success(res?.data?.message);
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(formData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Create Feedback Form
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Build custom feedback questions for your students.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-sm flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="create-form"
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto flex-1"
        >
          {/* Form Basic Details */}
          <div className="space-y-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200/60">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Form Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CS-301 Web Development Mid-Term Feedback"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description / Instructions
              </label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write instructions for students submitting this feedback..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-indigo-600 transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Allowed Batches Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Allowed Batches (Comma Separated)
              </label>
              <input
                type="text"
                value={allowedBatches}
                onChange={(e) => setAllowedBatches(e.target.value)}
                placeholder="e.g. B.Tech CSE 2026, MCA 2025"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-indigo-600 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Dynamic Questions List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-800 text-sm">
                Questions List ({questions.length})
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                Supports all standard input types
              </span>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 relative group hover:border-indigo-200 transition-colors"
              >
                {/* Question Top Controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 w-full">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <input
                      type="text"
                      required
                      value={q.questionText}
                      onChange={(e) =>
                        handleUpdateQuestion(
                          qIndex,
                          "questionText",
                          e.target.value,
                        )
                      }
                      placeholder={`Enter question ${qIndex + 1} text...`}
                      className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-600 transition-all font-medium"
                    />
                  </div>

                  {/* Question Type Selector */}
                  <select
                    value={q.type}
                    onChange={(e) =>
                      handleUpdateQuestion(qIndex, "type", e.target.value)
                    }
                    className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600 text-slate-700 font-semibold shrink-0 w-full sm:w-auto"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 1. Short Answer Preview */}
                {q.type === "short" && (
                  <div className="pt-1">
                    <input
                      disabled
                      placeholder="Student short text response area..."
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400 cursor-not-allowed"
                    />
                  </div>
                )}

                {/* 2. Paragraph Preview */}
                {q.type === "paragraph" && (
                  <div className="pt-1">
                    <textarea
                      disabled
                      rows="2"
                      placeholder="Student paragraph response area..."
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400 cursor-not-allowed resize-none"
                    />
                  </div>
                )}

                {/* 3. MCQ / Checkbox / Dropdown Options Builder */}
                {["mcq", "checkbox", "dropdown"].includes(q.type) && (
                  <div className="space-y-2 pt-1 pl-8">
                    <p className="text-[11px] text-slate-500 font-medium">
                      Configure Options:
                    </p>
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">
                          {q.type === "mcq"
                            ? "🔘"
                            : q.type === "checkbox"
                              ? "☑️"
                              : "🔽"}
                        </span>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) =>
                            handleUpdateOption(qIndex, optIndex, e.target.value)
                          }
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-600 focus:bg-white"
                        />
                        {q.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(qIndex, optIndex)}
                            className="text-slate-400 hover:text-rose-500 text-xs px-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(qIndex)}
                      className="text-[11px] font-semibold text-indigo-600 hover:underline pt-1 block"
                    >
                      + Add Option
                    </button>
                  </div>
                )}

                {/* 4. Star Rating Preview */}
                {q.type === "star_rating" && (
                  <div className="pt-1 flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-xs text-slate-500 font-medium">
                      Rating Preview:
                    </span>
                    <div className="flex gap-1 text-amber-400 text-sm">
                      {[...Array(q.maxStars || 10)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Yes / No Preview */}
                {q.type === "yes_no" && (
                  <div className="pt-1 flex gap-3 text-xs text-slate-600">
                    <label className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-not-allowed">
                      <input type="radio" disabled name={`yn_${q.id}`} /> Yes
                    </label>
                    <label className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-not-allowed">
                      <input type="radio" disabled name={`yn_${q.id}`} /> No
                    </label>
                  </div>
                )}

                {/* Question Actions Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) =>
                        handleUpdateQuestion(
                          qIndex,
                          "required",
                          e.target.checked,
                        )
                      }
                      className="accent-indigo-600 rounded"
                    />
                    Required Question
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDuplicateQuestion(qIndex)}
                      className="text-slate-500 hover:text-slate-800 font-medium text-xs"
                    >
                      📄 Duplicate
                    </button>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-rose-500 hover:text-rose-700 font-medium text-xs"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Question Button */}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-2.5 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-600 font-bold text-xs rounded-xl transition-all"
            >
              + Add Question
            </button>
          </div>
        </form>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-form"
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            Submit Form for Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateForm;
