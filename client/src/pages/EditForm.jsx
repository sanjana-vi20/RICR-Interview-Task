import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/API";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

const QUESTION_TYPES = [
  { value: "short", label: "Short Answer" },
  { value: "paragraph", label: "Paragraph" },
  { value: "mcq", label: "Multiple Choice (MCQ)" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "dropdown", label: "Dropdown" },
  { value: "star_rating", label: "Star Rating (1-10)" },
  { value: "yes_no", label: "Yes / No" },
];

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchFormDetails();
  }, [id]);

  const fetchFormDetails = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem("User") || "{}");
      const endpoint = user.role === "admin" ? `/admin/form/${id}` : `/user/form/${id}`;
      
      const res = await api.get(endpoint);
      const form = res.data.data;
      setTitle(form.title || "");
      setDescription(form.description || "");
      setQuestions(form.questions || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load form details");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title,
        description,
        questions,
      };
      
      const user = JSON.parse(sessionStorage.getItem("User") || "{}");
      const endpoint = user.role === "admin" ? `/admin/form/${id}` : `/user/form/${id}`;
      
      await api.put(endpoint, payload);
      toast.success("Form updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update form");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        type: "short",
        required: true,
        options: ["Option 1", "Option 2"],
        maxStars: 10,
      }
    ]);
  };

  const removeQuestion = (index) => {
    const newQs = [...questions];
    newQs.splice(index, 1);
    setQuestions(newQs);
  };

  const updateQuestion = (index, field, value) => {
    const newQs = [...questions];
    newQs[index][field] = value;
    setQuestions(newQs);
  };

  const handleDuplicateQuestion = (index) => {
    const qToCopy = questions[index];
    const duplicated = {
      ...qToCopy,
      id: Date.now(),
      options: [...(qToCopy.options || [])],
    };
    const updated = [...questions];
    updated.splice(index + 1, 0, duplicated);
    setQuestions(updated);
  };

  const handleAddOption = (qIndex) => {
    const updated = [...questions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options.push(
      `Option ${updated[qIndex].options.length + 1}`
    );
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter(
      (_, i) => i !== optIndex
    );
    setQuestions(updated);
  };

  const handleUpdateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium text-sm animate-pulse">Loading form details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Edit Form</h1>
              <p className="text-xs text-slate-500 mt-0.5">Modify the form details and questions.</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Form Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm"
              placeholder="Enter form title..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm resize-none"
              placeholder="Enter form description..."
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-800">Questions</h2>
            <button
              onClick={addQuestion}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 relative group hover:border-indigo-200 transition-colors"
              >
                {/* Question Top Controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 w-full">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      required
                      value={q.questionText}
                      onChange={(e) => updateQuestion(index, "questionText", e.target.value)}
                      placeholder={`Enter question ${index + 1} text...`}
                      className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-indigo-600 transition-all font-medium"
                    />
                  </div>

                  {/* Question Type Selector */}
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(index, "type", e.target.value)}
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
                    {q.options?.map((opt, optIndex) => (
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
                          onChange={(e) => handleUpdateOption(index, optIndex, e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-indigo-600 focus:bg-white"
                        />
                        {q.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index, optIndex)}
                            className="text-slate-400 hover:text-rose-500 text-xs px-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(index)}
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
                      Rating Preview (1-10):
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
                      <input type="radio" disabled name={`yn_${index}`} /> Yes
                    </label>
                    <label className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-not-allowed">
                      <input type="radio" disabled name={`yn_${index}`} /> No
                    </label>
                  </div>
                )}

                {/* Question Actions Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                      className="accent-indigo-600 rounded"
                    />
                    Required Question
                  </label>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDuplicateQuestion(index)}
                      className="text-slate-500 hover:text-slate-800 font-medium text-xs"
                    >
                      📄 Duplicate
                    </button>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-rose-500 hover:text-rose-700 font-medium text-xs"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {questions.length === 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm font-medium">No questions added.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditForm;
