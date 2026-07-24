import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../config/API";
import toast from "react-hot-toast";
import { ArrowLeft, Users, FileText, Clock } from "lucide-react";

const FormResponses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [formDetails, setFormDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFormAndResponses();
  }, [id]);

  const fetchFormAndResponses = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem("User") || "{}");
      const endpointBase = user.role === "admin" ? `/admin` : `/user`;

      // Dynamic API for fetching responses
      const resResponses = await api.get(`${endpointBase}/form/${id}/responses`);
      setResponses(resResponses?.data?.data || []);

      const resForm = await api.get(`${endpointBase}/form/${id}`);
      setFormDetails(resForm?.data?.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch responses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium text-sm animate-pulse">Loading responses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
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
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                {formDetails?.title || "Form Responses"}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {formDetails?.description || "Viewing all submitted responses for this form."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-700 font-semibold border border-indigo-100">
            <Users className="w-4 h-4" />
            <span>{responses.length} Submissions</span>
          </div>
        </div>

        {/* Responses Grid */}
        {responses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-400 font-medium">No responses have been submitted yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {responses.map((res, index) => (
              <div key={res._id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">#{index + 1} {res.studentName}</h3>
                    <p className="text-xs text-slate-500 font-medium">Batch: {res.batch}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(res.submittedAt).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-4">
                  {res.answers?.map((ans, idx) => (
                    <div key={ans.questionId || idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm font-semibold text-slate-700 mb-2">
                        <span className="text-indigo-600 mr-2">Q{idx + 1}.</span>
                        {ans.questionText || "Question"}
                      </p>
                      <p className="text-slate-600 text-sm bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap">
                        {ans.answer || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default FormResponses;
