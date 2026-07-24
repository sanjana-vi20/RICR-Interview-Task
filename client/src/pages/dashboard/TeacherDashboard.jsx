import React, { useState } from "react";
import { Link } from "react-router-dom";
import CreateFrom from "../../components/CreateFrom";

const TeacherDashboard = () => {
  // Pure UI Dummy Data (Teacher's Created / Assigned Forms)
  const [forms, setForms] = useState([
    {
      _id: "1",
      title: "CS-301 Web Development Feedback",
      description: "Feedback for MERN stack & React module.",
      approvalStatus: "approved",
      isActive: true,
      responsesCount: 24,
      createdAt: "2026-07-20",
    },
    {
      _id: "2",
      title: "CS-302 Data Structures Review",
      description: "Mid-semester performance feedback.",
      approvalStatus: "pending",
      isActive: false,
      responsesCount: 0,
      createdAt: "2026-07-22",
    },
    {
      _id: "3",
      title: "CS-303 Software Engineering Feedback",
      description: "Agile methodologies unit survey.",
      approvalStatus: "rejected",
      rejectionReason: "Please add MCQ question types for Agile sprint topics.",
      isActive: false,
      responsesCount: 0,
      createdAt: "2026-07-21",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pure UI Actions (State Handlers)
  const handleToggleActive = (id) => {
    setForms((prev) =>
      prev.map((f) => (f._id === id ? { ...f, isActive: !f.isActive } : f)),
    );
  };

  const handleDeleteForm = (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      setForms((prev) => prev.filter((f) => f._id !== id));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 1. Header Area */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Teacher Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage feedback forms, track approval status, share links, and
              view student responses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <span className="text-base font-bold">+</span> Create New Form
          </button>
        </div>

        {/* 2. Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Forms
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {forms.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              📋
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Approved & Live
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {forms.filter((f) => f.approvalStatus === "approved").length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              ✅
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Pending Review
              </p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                {forms.filter((f) => f.approvalStatus === "pending").length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold">
              ⏳
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Submissions
              </p>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">
                {forms.reduce((acc, curr) => acc + curr.responsesCount, 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold">
              💬
            </div>
          </div>
        </div>

        {/* 3. Forms List Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="font-bold text-slate-800 text-sm">
              Your Created Forms ({forms.length})
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              Auto-deactivates after 15 mins
            </span>
          </div>

          {forms.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No forms available. Click "+ Create New Form" to get started.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {forms.map((form) => (
                <div
                  key={form._id}
                  className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Form Details & Badges */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {form.title}
                      </h3>

                      {/* Status Badge */}
                      {form.approvalStatus === "approved" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          APPROVED
                        </span>
                      )}
                      {form.approvalStatus === "pending" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                          PENDING APPROVAL
                        </span>
                      )}
                      {form.approvalStatus === "rejected" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          REJECTED
                        </span>
                      )}

                      {/* Active Status Badge */}
                      {form.isActive ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                          LIVE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          INACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {form.description}
                    </p>

                    {/* Rejection Note */}
                    {form.approvalStatus === "rejected" &&
                      form.rejectionReason && (
                        <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200/60 rounded-lg p-2 font-medium">
                          ⚠️ Reason: {form.rejectionReason}
                        </p>
                      )}

                    <div className="text-[11px] text-slate-400">
                      Created: {form.createdAt} •{" "}
                      <span className="font-medium text-slate-600">
                        {form.responsesCount} Responses
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Direct Controls & Actions */}
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Activation Toggle (Only allowed if approved) */}
                    {form.approvalStatus === "approved" && (
                      <button
                        onClick={() => handleToggleActive(form._id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          form.isActive
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        }`}
                      >
                        {form.isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}

                    {/* Share / Copy Link */}
                    <button
                      onClick={() => handleShareLink(form._id)}
                      disabled={!form.isActive}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Share / Copy Link"
                    >
                      🔗 Share Link
                    </button>

                    {/* Responses Link */}
                    <Link
                      to={`/forms/${form._id}/responses`}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold transition-all"
                    >
                      Responses ({form.responsesCount})
                    </Link>

                    {/* Edit Action */}
                    <Link
                      to={`/forms/edit/${form._id}`}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Form"
                    >
                      ✏️
                    </Link>

                    {/* Delete Action */}
                    <button
                      onClick={() => handleDeleteForm(form._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Form"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (<CreateFrom onClose={() => setIsModalOpen(false)}/>)}
    </div>
  );
};

export default TeacherDashboard;
