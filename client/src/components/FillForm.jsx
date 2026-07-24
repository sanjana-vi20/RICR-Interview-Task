import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../config/API";
import toast from "react-hot-toast";

const FillForm = () => {
  const { token } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Fetch Form details
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(`/user/fill-form/${token}`);
        setForm(res?.data?.data || res?.data);
      } catch (err) {
        toast.error(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [token]);

  const handleInputChange = (qIndex, value) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/user/submit-response/${id}`, { responses: answers });
      toast.success("Feedback submit ho gaya!");
      setSubmitted(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submit failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Form loading...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center max-w-sm space-y-2">
          <p className="text-3xl">✅</p>
          <h2 className="text-base font-bold text-slate-900">Thank You!</h2>
          <p className="text-xs text-slate-500">
            Aapka feedback record kar liya gaya hai.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-xl mx-auto space-y-4">
        
        {/* Form Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">{form?.title}</h1>
          {form?.description && (
            <p className="text-xs text-slate-500 mt-1">{form?.description}</p>
          )}
        </div>

        {/* Form Questions */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {form?.questions?.map((q, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2"
            >
              <label className="block text-xs font-bold text-slate-800">
                {idx + 1}. {q.questionText || q.text}
              </label>

              {/* Simple Input Box */}
              <input
                type="text"
                required
                placeholder="Apna answer likhein..."
                onChange={(e) => handleInputChange(idx, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Submit Feedback
          </button>
        </form>

      </div>
    </div>
  );
};

export default FillForm;