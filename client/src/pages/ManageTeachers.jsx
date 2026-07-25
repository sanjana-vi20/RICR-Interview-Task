import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserPlus,
  Mail,
  BookOpen,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Trash2,
  Edit,
  ShieldAlert,
  Users,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";

// DUMMY TEACHERS DATA
const INITIAL_TEACHERS = [
  {
    _id: "tech_1",
    name: "Prof. Ankit Sharma",
    email: "ankit.sharma@college.edu",
    department: "Computer Science & Engineering",
    assignedBatches: ["2024", "2025"],
    createdFormsCount: 8,
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    _id: "tech_2",
    name: "Dr. Meenakshi Sundaram",
    email: "meenakshi.s@college.edu",
    department: "Information Technology",
    assignedBatches: ["2023", "2024", "2026"],
    createdFormsCount: 12,
    status: "active",
    joinedAt: "2023-08-10",
  },
  {
    _id: "tech_3",
    name: "Rajesh Verma",
    email: "rajesh.verma@college.edu",
    department: "Computer Science & Engineering",
    assignedBatches: ["2025"],
    createdFormsCount: 3,
    status: "on_leave",
    joinedAt: "2025-02-01",
  },
  {
    _id: "tech_4",
    name: "Pooja Hegde",
    email: "pooja.h@college.edu",
    department: "Artificial Intelligence & Data Science",
    assignedBatches: ["2026"],
    createdFormsCount: 5,
    status: "active",
    joinedAt: "2025-07-20",
  },
  {
    _id: "tech_5",
    name: "Suresh Nambiar",
    email: "suresh.n@college.edu",
    department: "Electronics & Communication",
    assignedBatches: ["2023"],
    createdFormsCount: 1,
    status: "inactive",
    joinedAt: "2022-11-12",
  },
];

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Teacher Form State
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    department: "Computer Science & Engineering",
    assignedBatches: "",
  });

  // 1. Search & Filter Logic
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || teacher.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [teachers, searchQuery, statusFilter]);

  // 2. Action Handlers
  const handleToggleStatus = (id) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t._id === id) {
          const nextStatus =
            t.status === "active"
              ? "inactive"
              : t.status === "inactive"
              ? "active"
              : "active";
          toast.success(`Teacher status updated to ${nextStatus.toUpperCase()}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleDeleteTeacher = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setTeachers((prev) => prev.filter((t) => t._id !== id));
      toast.success(`${name} removed successfully`);
    }
  };

  const handleAddTeacherSubmit = (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email) {
      toast.error("Please fill in required fields!");
      return;
    }

    const batchesArr = newTeacher.assignedBatches
      ? newTeacher.assignedBatches.split(",").map((b) => b.trim())
      : ["2026"];

    const createdRecord = {
      _id: `tech_${Date.now()}`,
      name: newTeacher.name,
      email: newTeacher.email,
      department: newTeacher.department,
      assignedBatches: batchesArr,
      createdFormsCount: 0,
      status: "active",
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setTeachers([createdRecord, ...teachers]);
    toast.success("New teacher onboarded successfully!");
    setIsAddModalOpen(false);
    setNewTeacher({
      name: "",
      email: "",
      department: "Computer Science & Engineering",
      assignedBatches: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER AREA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <Link
              to="/admin-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Manage Faculty & Teachers
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Add new instructors, assign batches, and manage account statuses.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Add New Teacher
          </button>
        </div>

        {/* OVERVIEW STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Teachers
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {teachers.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Active Instructors
              </p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {teachers.filter((t) => t.status === "active").length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                On Leave / Suspended
              </p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                {teachers.filter((t) => t.status !== "active").length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Created Forms
              </p>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">
                {teachers.reduce((acc, curr) => acc + curr.createdFormsCount, 0)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* TEACHERS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-extrabold text-slate-500">
                  <th className="py-3.5 px-5">Teacher Info</th>
                  <th className="py-3.5 px-5">Department</th>
                  <th className="py-3.5 px-5">Assigned Batches</th>
                  <th className="py-3.5 px-5">Forms</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      No teachers found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs shadow-inner">
                            {teacher.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {teacher.name}
                            </p>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {teacher.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {teacher.department}
                        </span>
                      </td>

                      {/* Batches */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {teacher.assignedBatches.map((batch, bIdx) => (
                            <span
                              key={bIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200"
                            >
                              Batch {batch}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Forms Count */}
                      <td className="py-4 px-5">
                        <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                          {teacher.createdFormsCount} Forms
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-5">
                        {teacher.status === "active" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            ACTIVE
                          </span>
                        )}
                        {teacher.status === "on_leave" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            ON LEAVE
                          </span>
                        )}
                        {teacher.status === "inactive" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            INACTIVE
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(teacher._id)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                            title="Toggle Status"
                          >
                            {teacher.status === "active" ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteTeacher(teacher._id, teacher.name)
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove Teacher"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ADD NEW TEACHER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" /> Onboard New Teacher
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTeacherSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Ramesh Kumar"
                  value={newTeacher.name}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@college.edu"
                  value={newTeacher.email}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, email: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={newTeacher.department}
                  onChange={(e) =>
                    setNewTeacher({ ...newTeacher, department: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none"
                >
                  <option value="Computer Science & Engineering">
                    Computer Science & Engineering
                  </option>
                  <option value="Information Technology">
                    Information Technology
                  </option>
                  <option value="Artificial Intelligence & Data Science">
                    Artificial Intelligence & Data Science
                  </option>
                  <option value="Electronics & Communication">
                    Electronics & Communication
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Batches (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2024, 2025, 2026"
                  value={newTeacher.assignedBatches}
                  onChange={(e) =>
                    setNewTeacher({
                      ...newTeacher,
                      assignedBatches: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-all"
                >
                  Save & Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeachers;