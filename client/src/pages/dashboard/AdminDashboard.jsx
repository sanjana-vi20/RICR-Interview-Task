import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Search,
  ChevronRight,
  Trash2,
  Edit,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../config/API";
import toast from "react-hot-toast";
import CreateForm from "../../components/CreateFrom";

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [forms, setForms] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. API Call to Fetch Activated Teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/get-teachers");
      const teacherData = res?.data?.data || res?.data || [];
      console.log(res?.data?.data);
      
      setTeachers(teacherData);

      // Sabse pehle teacher ko automatically default select kar rahe hain
      if (teacherData.length > 0) {
        setSelectedTeacher(teacherData[0]);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch teachers!",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherForms = async (teacherId) => {
    try {
      const res = await api.get(`/admin/teacher-forms/${teacherId}`);
      const fetchedForms = res?.data?.data || [];
      setForms((prev) => ({
        ...prev,
        [teacherId]: fetchedForms,
      }));
    } catch (error) {
      console.error("Error fetching teacher forms:", error);
      toast.error("Failed to load forms for selected teacher");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacher?._id) {
      fetchTeacherForms(selectedTeacher._id);
    }
  }, [selectedTeacher]);

  // Form Approval Handler
  const handleApproveForm = async (formId) => {
    if (!selectedTeacher?._id) return;
    console.log(formId);
    
    try {
      const res = await api.put(`/admin/form/${formId}/approve`);
      toast.success(res.data.message || "Form approved successfully!");

      // Update local state
      const teacherId = selectedTeacher._id;
      setForms((prev) => ({
        ...prev,
        [teacherId]: (prev[teacherId] || []).map((f) =>
          f._id === formId
            ? { ...f, approvalStatus: "approved", isActive: true }
            : f,
        ),
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Approval failed");
    }
  };

  const handleDeleteForm = async (formId) => {
    if (!selectedTeacher?._id) return;
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    try {
      const res = await api.delete(`/admin/form/${formId}`);
      toast.success(res.data.message || "Form deleted successfully!");

      // Update local state
      const teacherId = selectedTeacher._id;
      setForms((prev) => ({
        ...prev,
        [teacherId]: (prev[teacherId] || []).filter((f) => f._id !== formId),
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const currentTeacherForms = selectedTeacher?._id
    ? forms[selectedTeacher._id] || []
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium text-sm animate-pulse">
          Loading Admin Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. TOP HEADER */}
      <header className="bg-white border-b m-6 rounded-2xl shadow-2xl border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 m-5">
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Manage Teachers, Form Approvals & Responses
            </p>
          </div>
        </div>

        {/* Action: Create Form */}
        <button
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Create Form
        </button>
      </header>

      {/* 2. MAIN 2-COLUMN LAYOUT */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Activated Teachers List */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Activated Teachers
              </h2>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {teachers.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            {/* Teacher Cards */}
            <div className="space-y-2 pt-1">
              {teachers.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  No activated teachers found.
                </p>
              ) : (
                teachers
                  .filter(
                    (t) =>
                      (t.fullName || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      (t.email || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  )
                  .map((teacher) => {
                    const isSelected = selectedTeacher?._id === teacher._id;
                    return (
                      <div
                        key={teacher._id}
                        onClick={() => setSelectedTeacher(teacher)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-500 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div>
                          <p
                            className={`font-bold text-xs ${isSelected ? "text-emerald-900" : "text-slate-800"}`}
                          >
                            {teacher.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {teacher.email}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 ${isSelected ? "text-emerald-600" : "text-slate-300"}`}
                        />
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Teacher's Forms */}
        <div className="md:col-span-8 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5 min-h-[500px]">
            {selectedTeacher ? (
              <>
                {/* Selected Teacher Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                      Selected Teacher
                    </span>
                    <h2 className="text-lg font-bold text-slate-800 mt-1">
                      {selectedTeacher.fullName}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {selectedTeacher.email}
                    </p>
                  </div>

                  {/* Quick stats for this teacher */}
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-center px-2">
                      <p className="text-xs font-extrabold text-slate-800">
                        {currentTeacherForms.length}
                      </p>
                      <p className="text-[10px] text-slate-400">Total Forms</p>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="text-center px-2">
                      <p className="text-xs font-extrabold text-amber-600">
                        {
                          currentTeacherForms.filter(
                            (f) => f.approvalStatus === "pending",
                          ).length
                        }
                      </p>
                      <p className="text-[10px] text-slate-400">Pending</p>
                    </div>
                  </div>
                </div>

                {/* Forms List */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Created Forms List
                  </h3>

                  {currentTeacherForms.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-500">
                        Is teacher ne abhi tak koi form nahi banaya hai.
                      </p>
                    </div>
                  ) : (
                    currentTeacherForms.map((form) => (
                      <div
                        key={form._id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Form Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-sm">
                              {form.title}
                            </h4>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                form.approvalStatus === "approved"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {form.approvalStatus === "approved" ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />{" "}
                                  Approved
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-amber-600" />{" "}
                                  Pending Approval
                                </>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>
                              Batch:{" "}
                              <strong className="text-slate-700">
                                {form.allowedBatches?.join(", ") || "All"}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              Created:{" "}
                              {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          {form.approvalStatus === "pending" && (
                            <button
                              onClick={() => handleApproveForm(form._id)}
                              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve Form
                            </button>
                          )}

                          {form.approvalStatus === "approved" && (
                            <Link
                              to={`/forms/${form._id}/responses`}
                              className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Responses ({form.responsesCount || 0})
                            </Link>
                          )}

                          <Link
                            to={`/forms/edit/${form._id}`}
                            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-500 rounded-xl transition-all"
                            title="Edit Form"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDeleteForm(form._id)}
                            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-500 rounded-xl transition-all"
                            title="Delete Form"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 font-medium text-sm">
                No teacher selected.
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CreateForm
          onClose={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
