import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../config/API";
import { FIXED_QUESTIONS } from "../constants/fixedQuestion";
import RatingInput from "../components/RatingInput";
import toast from "react-hot-toast";

const RATING_THRESHOLD = 8; // If rating < 8, show reason field

const FillForm = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [batch, setBatch] = useState("");

  useEffect(() => {
    api
      .get(`/user/fill-form/${token}`)
      .then((res) => setFormData(res.data.data || res.data))
      .catch((err) => console.error("Form error:", err));
  }, [token]);

  // General handler to update answer state
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Helper component to render dynamic questions based on type
  const renderQuestionInput = (question) => {
    const qId = question._id || question.id;
    const currentVal = answers[qId] || "";

    switch (question.type?.toLowerCase()) {
      case "rating":
        return (
          <RatingInput
            value={answers[qId] || 0}
            onChange={(val) => handleAnswerChange(qId, val)}
          />
        );

      case "text":
      case "textarea":
        return (
          <textarea
            rows="3"
            required={question.required}
            placeholder="Type your response here..."
            value={currentVal}
            onChange={(e) => handleAnswerChange(qId, e.target.value)}
            className="w-full mt-2 p-3 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
          />
        );

      case "mcq":
      case "radio":
      case "single_choice":
        return (
          <div className="mt-3 space-y-2">
            {question.options?.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                  currentVal === option
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-medium"
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name={`question_${qId}`}
                  required={question.required}
                  value={option}
                  checked={currentVal === option}
                  onChange={(e) => handleAnswerChange(qId, e.target.value)}
                  className="accent-emerald-600 w-4 h-4"
                />
                {option}
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            required={question.required}
            placeholder="Your answer..."
            value={currentVal}
            onChange={(e) => handleAnswerChange(qId, e.target.value)}
            className="w-full mt-2 p-3 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
          />
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation: Name & Batch
    if (!studentName.trim() || !batch.trim()) {
      return toast.error("Please enter your Name and Batch!");
    }

    // 2. Validation: Fixed Questions Mandatory Rating & Reason Check
    for (let i = 0; i < FIXED_QUESTIONS.length; i++) {
      const q = FIXED_QUESTIONS[i];
      const ratingVal = Number(answers[q.id] || 0);

      if (!ratingVal || ratingVal === 0) {
        return toast.error(`Please provide a rating for F${i + 1}`);
      }

      if (ratingVal < RATING_THRESHOLD) {
        const reasonVal = answers[`${q.id}_reason`];
        if (!reasonVal || !reasonVal.trim()) {
          return toast.error(`Please specify the reason for low rating in F${i + 1}`);
        }
      }
    }

    setSubmitting(true);

    try {
      // A) Fixed Questions Format with Reason (if rating < 8)
      const formattedFixedAnswers = FIXED_QUESTIONS.map((q) => {
        const ratingVal = Number(answers[q.id] || 0);
        const reasonVal = answers[`${q.id}_reason`] || "";

        return {
          questionId: q.id,
          questionText: q.questionText,
          answer: ratingVal,
          ...(ratingVal < RATING_THRESHOLD && { reason: reasonVal.trim() }),
        };
      });

      // B) Dynamic Questions Format
      const formattedDynamicAnswers = (formData.questions || []).map((q) => ({
        questionId: q._id || q.id,
        questionText: q.questionText,
        answer: answers[q._id || q.id] || "",
      }));

      // C) Merge Answers Array
      const finalAnswersArray = [
        ...formattedFixedAnswers,
        ...formattedDynamicAnswers,
      ];

      // Payload matching Schema
      const payload = {
        studentName: studentName.trim(),
        batch: batch.trim(),
        answers: finalAnswersArray, // Fixed 'answer' -> 'answers' key
      };

      console.log("Submitting Payload:", payload);
      await api.post(`/user/submit-feedback/${token}`, payload);
      
      toast.success("Feedback submitted successfully!");
      
      // Reset form states
      setStudentName("");
      setBatch("");
      setAnswers({});

    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium text-sm animate-pulse">
          Loading form details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        
        {/* Form Title Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">
            {formData.title}
          </h2>
          {formData.description && (
            <p className="text-slate-500 text-sm">{formData.description}</p>
          )}
        </div>

        {/* 1. STUDENT DETAILS CARD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
            Student Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Batch / Section <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                required
                placeholder="e.g. CSE 2026 / Batch A"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* 2. DYNAMIC QUESTIONS FROM BACKEND */}
        {formData.questions?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              Additional Questions
            </h3>
            <div className="space-y-5">
              {formData.questions.map((q, idx) => (
                <div
                  key={q._id || idx}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50"
                >
                  <p className="font-semibold text-slate-800 text-sm">
                    <span className="text-indigo-600 mr-2 font-bold">
                      Q{idx + 1}
                    </span>
                    {q.questionText}
                    {q.required && (
                      <span className="text-rose-500 ml-1">*</span>
                    )}
                  </p>

                  {/* Dynamic Render according to Type */}
                  {renderQuestionInput(q)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. FIXED MANDATORY QUESTIONS WITH DYNAMIC REASON FIELD */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800">Fixed Questions</h3>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Mandatory
            </span>
          </div>

          <div className="space-y-4">
            {FIXED_QUESTIONS.map((q, idx) => {
              const currentRating = Number(answers[q.id] || 0);
              const showReasonBox = currentRating > 0 && currentRating < RATING_THRESHOLD;

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3"
                >
                  <p className="font-semibold text-slate-800 text-sm">
                    <span className="text-emerald-600 mr-2 font-bold">
                      F{idx + 1}
                    </span>
                    {q.questionText} <span className="text-rose-500">*</span>
                  </p>

                  <RatingInput
                    value={currentRating}
                    onChange={(val) => handleAnswerChange(q.id, val)}
                  />

                  {/* Dynamic Reason Field if rating < 8 */}
                  {showReasonBox && (
                    <div className="pt-2 animate-fadeIn">
                      <label className="block text-xs font-semibold text-rose-600 mb-1">
                        Reason for giving rating below {RATING_THRESHOLD} <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows="2"
                        required
                        placeholder="Please specify what can be improved..."
                        value={answers[`${q.id}_reason`] || ""}
                        onChange={(e) => handleAnswerChange(`${q.id}_reason`, e.target.value)}
                        className="w-full p-3 text-sm bg-white border border-rose-200 rounded-xl outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FillForm;