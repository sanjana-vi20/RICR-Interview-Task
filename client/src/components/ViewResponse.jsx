import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom"; // router path adjust kar sakte hain
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BarChart3,
  User,
  AlertTriangle,
  ArrowLeft,
  Layers,
  MessageSquare,
  Clock,
  History,
  Star,
} from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#f43f5e"]; // Green (9-10), Blue (7-8), Red (<7)

// ---------------- DUMMY DATA FOR TESTING ----------------
const DUMMY_FORM = {
  id: "form_101",
  title: "Node.js & Express - Backend Architecture Review",
  batch: "CSE 2026 - Section A",
  teacherName: "Prof. Ankit Sharma",
};

const DUMMY_RESPONSES = [
  {
    _id: "resp_1",
    studentName: "Aman Verma",
    batch: "CSE 2026",
    submittedAt: "2026-07-24T10:30:00Z",
    isReFeedback: false,
    answers: [
      { questionId: "f1", questionText: "How clearly did the teacher explain the concepts?", answer: 9 },
      { questionId: "f2", questionText: "How well was the class structured and organized?", answer: 8 },
      { questionId: "f3", questionText: "Pacing and time management of the session", answer: 6, reason: "The last topic was rushed too quickly." },
      { questionId: "f4", questionText: "Quality of practical examples and code demos", answer: 9 },
      { questionId: "f5", questionText: "Doubt resolution during or after class", answer: 7, reason: "Took a bit long to answer chat questions." },
    ],
  },
  {
    _id: "resp_2",
    studentName: "Priya Sharma",
    batch: "CSE 2026",
    submittedAt: "2026-07-24T11:15:00Z",
    isReFeedback: true,
    answers: [
      { questionId: "f1", questionText: "How clearly did the teacher explain the concepts?", answer: 10 },
      { questionId: "f2", questionText: "How well was the class structured and organized?", answer: 9 },
      { questionId: "f3", questionText: "Pacing and time management of the session", answer: 9 },
      { questionId: "f4", questionText: "Quality of practical examples and code demos", answer: 10 },
      { questionId: "f5", questionText: "Doubt resolution during or after class", answer: 9 },
    ],
  },
  {
    _id: "resp_3",
    studentName: "Rohan Das",
    batch: "CSE 2026",
    submittedAt: "2026-07-24T14:20:00Z",
    isReFeedback: false,
    answers: [
      { questionId: "f1", questionText: "How clearly did the teacher explain the concepts?", answer: 5, reason: "Did not understand the async/await part clearly." },
      { questionId: "f2", questionText: "How well was the class structured and organized?", answer: 7, reason: "Slide sequence was confusing." },
      { questionId: "f3", questionText: "Pacing and time management of the session", answer: 6, reason: "Class started 10 minutes late." },
      { questionId: "f4", questionText: "Quality of practical examples and code demos", answer: 8 },
      { questionId: "f5", questionText: "Doubt resolution during or after class", answer: 6, reason: "My hand was raised for 10 mins." },
    ],
  },
  {
    _id: "resp_4",
    studentName: "Neha Gupta",
    batch: "CSE 2026",
    submittedAt: "2026-07-25T09:00:00Z",
    isReFeedback: false,
    answers: [
      { questionId: "f1", questionText: "How clearly did the teacher explain the concepts?", answer: 9 },
      { questionId: "f2", questionText: "How well was the class structured and organized?", answer: 10 },
      { questionId: "f3", questionText: "Pacing and time management of the session", answer: 8 },
      { questionId: "f4", questionText: "Quality of practical examples and code demos", answer: 9 },
      { questionId: "f5", questionText: "Doubt resolution during or after class", answer: 10 },
    ],
  },
];

const ViewResponses = () => {
  const [activeTab, setActiveTab] = useState("summary"); // 'summary' | 'individual' | 'negative'

  // 📊 CALCULATIONS FOR CHARTS USING DUMMY DATA

  // 1. Bar Chart Data: Fixed Questions Average Scores
  const fixedQuestionsStats = useMemo(() => {
    const statsMap = {};

    DUMMY_RESPONSES.forEach((resp) => {
      resp.answers.forEach((ans) => {
        if (ans.questionId.startsWith("f")) {
          if (!statsMap[ans.questionId]) {
            statsMap[ans.questionId] = {
              questionId: ans.questionId.toUpperCase(),
              questionText: ans.questionText,
              totalScore: 0,
              count: 0,
            };
          }
          statsMap[ans.questionId].totalScore += ans.answer;
          statsMap[ans.questionId].count += 1;
        }
      });
    });

    return Object.values(statsMap).map((item) => ({
      name: item.questionId,
      fullText: item.questionText,
      avgScore: Number((item.totalScore / item.count).toFixed(1)),
    }));
  }, []);

  // 2. Pie Chart Data: Rating Sentiment Percentiles
  const scoreDistributionData = useMemo(() => {
    let highCount = 0; // 9-10
    let midCount = 0;  // 7-8
    let lowCount = 0;  // <7

    DUMMY_RESPONSES.forEach((resp) => {
      resp.answers.forEach((ans) => {
        if (typeof ans.answer === "number") {
          if (ans.answer >= 9) highCount++;
          else if (ans.answer >= 7) midCount++;
          else lowCount++;
        }
      });
    });

    return [
      { name: "Excellent (9-10)", value: highCount },
      { name: "Good (7-8)", value: midCount },
      { name: "Needs Focus (<7)", value: lowCount },
    ];
  }, []);

  // 3. Negative Responses (Filtered entries where rating < 8)
  const negativeResponsesList = useMemo(() => {
    return DUMMY_RESPONSES.filter((resp) =>
      resp.answers.some((ans) => typeof ans.answer === "number" && ans.answer < 8)
    );
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER & TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <Link
              to="/admin-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-800">
              {DUMMY_FORM.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> Batch:{" "}
                <strong className="text-slate-700">{DUMMY_FORM.batch}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Total Submissions:{" "}
                <strong className="text-emerald-600 font-bold">{DUMMY_RESPONSES.length}</strong>
              </span>
            </div>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-center">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "summary"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Summary View
            </button>
            <button
              onClick={() => setActiveTab("individual")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "individual"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-4 h-4" /> Individual View
            </button>
            <button
              onClick={() => setActiveTab("negative")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "negative"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-rose-600"
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> Negative ({negativeResponsesList.length})
            </button>
          </div>
        </div>

        {/* 1. SUMMARY VIEW (BAR GRAPH FOR FIXED & PIE CHART) */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* BAR CHART: FIXED QUESTIONS AVERAGE */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Fixed Questions Average Score</h3>
                  <p className="text-xs text-slate-400">Bar graph showing average rating (out of 10) for fixed questions</p>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fixedQuestionsStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: "bold", fill: "#64748b" }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "#94a3b8" }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-lg">
                                <p className="font-bold text-emerald-400">{data.name}: {data.avgScore} / 10</p>
                                <p className="text-[11px] text-slate-300">{data.fullText}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="avgScore" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PIE CHART: RATING SENTIMENT DISTRIBUTION */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Ratings Sentiment Breakdown</h3>
                  <p className="text-xs text-slate-400">Pie chart distribution of all ratings</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {scoreDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. INDIVIDUAL VIEW (STUDENT BY STUDENT) */}
        {activeTab === "individual" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Student Submissions ({DUMMY_RESPONSES.length})
            </h3>

            {DUMMY_RESPONSES.map((resp, idx) => (
              <div key={resp._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm">{resp.studentName}</h4>
                        {resp.isReFeedback && (
                          <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <History className="w-3 h-3" /> Re-Feedback
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">Batch: {resp.batch}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Submitted: {new Date(resp.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Answers Table/List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {resp.answers.map((ans, aIdx) => (
                    <div key={aIdx} className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl space-y-1">
                      <p className="text-xs font-semibold text-slate-500">{ans.questionText}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-extrabold text-slate-800">{ans.answer} / 10</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      {ans.reason && (
                        <p className="text-xs text-rose-600 bg-rose-50/80 p-2 rounded-lg font-medium mt-1">
                          <strong>Reason:</strong> "{ans.reason}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. NEGATIVE RESPONSES VIEW (RATING < 8) */}
        {activeTab === "negative" && (
          <div className="space-y-4">
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-xs text-rose-800 font-medium">
                Auto-filtering responses where ratings given are <strong>below 8</strong> along with student comments/reasons.
              </p>
            </div>

            {negativeResponsesList.map((resp, idx) => (
              <div key={resp._id} className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{resp.studentName}</h4>
                    <p className="text-xs text-slate-400">Batch: {resp.batch}</p>
                  </div>
                  <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-md">
                    Low Rating Flagged
                  </span>
                </div>

                {/* Filtered Low Score Answers Only */}
                <div className="space-y-2">
                  {resp.answers
                    .filter((ans) => typeof ans.answer === "number" && ans.answer < 8)
                    .map((ans, aIdx) => (
                      <div key={aIdx} className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-700">{ans.questionText}</p>
                          <span className="text-xs font-extrabold text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200">
                            {ans.answer} / 10
                          </span>
                        </div>
                        {ans.reason && (
                          <p className="text-xs text-slate-600 pt-1">
                            <strong className="text-rose-700">Student Reason:</strong> "{ans.reason}"
                          </p>
                        )}
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

export default ViewResponses;