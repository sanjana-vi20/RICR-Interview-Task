import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  CartesianGrid,
} from "recharts";
import {
  BarChart3,
  User,
  AlertTriangle,
  ArrowLeft,
  History,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "../config/API";

const PIE_COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b"];

const ViewResponses = () => {
  const { id: formId } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");
  const [responses, setResponses] = useState([]);
  const [expandedPrevious, setExpandedPrevious] = useState({}); 

  const fetchResponse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/user/fetch-response/${formId}`);
      if (res?.data?.success || Array.isArray(res?.data?.data)) {
        setResponses(res.data.data || res.data || []);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formId) {
      fetchResponse();
    }
  }, [formId]);

  const allQuestions = useMemo(() => {
    if (!responses.length) return [];

    const sampleAnswers = responses[0]?.answers || [];
    return sampleAnswers.map((ans) => {
      const isFixed = Boolean(ans.questionId && ans.questionId.startsWith("f"));
      return {
        id: ans.questionId,
        questionText: ans.questionText,
        isFixed: isFixed,
        type: typeof ans.answer === "number" ? "rating" : "custom",
      };
    });
  }, [responses]);

  const dynamicQuestions = useMemo(() => {
    return allQuestions.filter((q) => !q.isFixed);
  }, [allQuestions]);

  const fixedQuestions = useMemo(() => {
    return allQuestions.filter((q) => q.isFixed);
  }, [allQuestions]);

  const fixedQuestionsBarData = useMemo(() => {
    return fixedQuestions.map((q) => {
      let sum = 0;
      let count = 0;
      responses.forEach((resp) => {
        const ans = (resp.answers || []).find((a) => a.questionId === q.id);
        if (ans && typeof ans.answer === "number") {
          sum += ans.answer;
          count++;
        }
      });
      return {
        name: q.id.toUpperCase(),
        avg: count ? Number((sum / count).toFixed(2)) : 0,
        fullText: q.questionText,
      };
    });
  }, [fixedQuestions, responses]);

  
  const getQuestionAnalytics = (qId) => {
    const allAns = responses
      .map((r) => (r.answers || []).find((a) => a.questionId === qId)?.answer)
      .filter((a) => a !== undefined && a !== null);

    const numericAns = allAns.filter((a) => typeof a === "number");
    const avgScore = numericAns.length
      ? (
          numericAns.reduce((acc, curr) => acc + curr, 0) / numericAns.length
        ).toFixed(2)
      : "0.00";

    const ratingDistribution = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => ({
      rating: `${rating}`,
      count: numericAns.filter((a) => a === rating).length,
    }));

    const yesCount = allAns.filter(
      (a) => String(a).toUpperCase() === "YES"
    ).length;
    const noCount = allAns.filter(
      (a) => String(a).toUpperCase() === "NO"
    ).length;

    const pieData = [
      { name: `YES: ${yesCount}`, value: yesCount || 0 },
      { name: `NO: ${noCount}`, value: noCount || 0 },
    ];

    const isYesNo = yesCount > 0 || noCount > 0;

    return {
      totalCount: allAns.length,
      avgScore,
      ratingDistribution,
      pieData,
      isYesNo,
      textAnswers: allAns.filter((a) => typeof a === "string"),
    };
  };

  const negativeResponsesList = useMemo(() => {
    return responses.filter((resp) =>
      (resp.answers || []).some((ans) => {
        const isLowRating = typeof ans.answer === "number" && ans.answer < 8;
        const hasReason = ans.reason && ans.reason.trim().length > 0;
        const isNegativeChoice = String(ans.answer).toUpperCase() === "NO";
        return isLowRating || hasReason || isNegativeChoice;
      })
    );
  }, [responses]);

  const togglePreviousAnswers = (respId) => {
    setExpandedPrevious((prev) => ({
      ...prev,
      [respId]: !prev[respId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-500 font-medium text-sm animate-pulse">
          Loading response analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <Link
              to="/admin-dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Form Feedback Analytics
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>
                Batch:{" "}
                <strong className="text-slate-700">
                  {responses[0]?.batch || "N/A"}
                </strong>
              </span>
              <span>•</span>
              <span>
                Total Submissions:{" "}
                <strong className="text-emerald-600 font-bold">
                  {responses.length}
                </strong>
              </span>
            </div>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "summary"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Summary View
            </button>
            <button
              onClick={() => setActiveTab("individual")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "individual"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              <User className="w-4 h-4" /> Individual View
            </button>
            <button
              onClick={() => setActiveTab("negative")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "negative"
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-slate-600"
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> Negative (
              {negativeResponsesList.length})
            </button>
          </div>
        </div>

        {/* 1. SUMMARY VIEW */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            {/* STEP 1: CREATED / DYNAMIC QUESTIONS FIRST */}
            {dynamicQuestions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Teacher Created Questions
                </h2>

                {dynamicQuestions.map((q) => {
                  const analytics = getQuestionAnalytics(q.id);

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5"
                    >
                      <div className="space-y-3">
                        <h3 className="font-bold text-slate-800 text-base">
                          {q.questionText}
                        </h3>

                        {q.type === "rating" && (
                          <div className="flex items-center gap-3">
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                              Average: {analytics.avgScore}/10
                            </span>
                            <span className="text-xs text-slate-400 font-medium">
                              Based on {analytics.totalCount} response(s)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* YES/NO PIE CHART CARD */}
                      {analytics.isYesNo ? (
                        <div className="h-64 w-full flex items-center justify-center pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analytics.pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                label={({ name }) => name}
                              >
                                <Cell fill="#22c55e" />
                                <Cell fill="#ef4444" />
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      ) : q.type === "rating" ? (
                        /* RATING BAR GRAPH */
                        <div className="h-60 w-full pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={analytics.ratingDistribution}
                              margin={{
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 0,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="2 2"
                                stroke="#f1f5f9"
                              />
                              <XAxis
                                dataKey="rating"
                                tick={{ fontSize: 11, fill: "#64748b" }}
                              />
                              <YAxis
                                label={{
                                  value: "Responses",
                                  angle: -90,
                                  position: "insideLeft",
                                  style: { fill: "#94a3b8", fontSize: 11 },
                                }}
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                              />
                              <Tooltip />
                              <Bar
                                dataKey="count"
                                fill="#3b82f6"
                                radius={[2, 2, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        /* TEXT / CUSTOM ANSWERS LIST */
                        <div className="space-y-2 pt-1">
                          {analytics.textAnswers.map((ans, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700"
                            >
                              "{ans}"
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 2: OVERALL FIXED QUESTIONS (F1 - F5) BAR CHART (AT THE END) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 mt-8">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-800">
                  Fixed Questions Overall Comparison (F1 - F5)
                </h2>
                <p className="text-xs text-slate-400">
                  Overall aggregate scores for mandatory evaluation parameters
                </p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fixedQuestionsBarData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 12,
                        fontWeight: "bold",
                        fill: "#475569",
                      }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="avg"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 2. INDIVIDUAL VIEW (UPDATED FOR RE-FEEDBACK & STUDENT DETAILS) */}
        {activeTab === "individual" && (
          <div className="space-y-4">
            {responses.map((resp, idx) => (
              <div
                key={resp._id || idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                {/* Student Info Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 font-bold text-indigo-700 flex items-center justify-center text-xs shadow-inner">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-sm">
                          {resp.studentName}
                        </h4>
                        {resp.isReFeedback && (
                          <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border border-purple-200">
                            <History className="w-3 h-3" /> Re-Feedback
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        Batch:{" "}
                        <strong className="text-slate-600">{resp.batch}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {resp.submittedAt
                        ? new Date(resp.submittedAt).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Answers Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {(resp.answers || []).map((ans, aIdx) => (
                    <div
                      key={aIdx}
                      className="p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl space-y-1.5"
                    >
                      <p className="text-xs font-semibold text-slate-500">
                        {ans.questionText}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-800">
                          {typeof ans.answer === "number"
                            ? `${ans.answer} / 10`
                            : ans.answer}
                        </span>
                        {typeof ans.answer === "number" && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              ans.answer >= 8
                                ? "bg-emerald-100 text-emerald-700"
                                : ans.answer >= 6
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            Score: {ans.answer}
                          </span>
                        )}
                      </div>
                      {ans.reason && (
                        <p className="text-xs text-rose-600 bg-rose-50/90 border border-rose-100 p-2 rounded-lg font-medium mt-1">
                          <strong>Student Reason:</strong> "{ans.reason}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Collapsible Previous Answers (For Re-Feedback) */}
                {resp.isReFeedback &&
                  resp.previousAnswers &&
                  resp.previousAnswers.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => togglePreviousAnswers(resp._id || idx)}
                        className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <History className="w-3.5 h-3.5" />
                        {expandedPrevious[resp._id || idx]
                          ? "Hide Initial Feedback Answers"
                          : "View Initial Feedback Answers"}
                        {expandedPrevious[resp._id || idx] ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {expandedPrevious[resp._id || idx] && (
                        <div className="mt-3 p-4 bg-purple-50/50 border border-purple-100 rounded-xl space-y-2">
                          <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                            Original Submission History:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {resp.previousAnswers.map((pAns, pIdx) => (
                              <div
                                key={pIdx}
                                className="p-2.5 bg-white border border-purple-100 rounded-lg text-xs"
                              >
                                <p className="text-slate-500 font-medium">
                                  {pAns.questionText}
                                </p>
                                <p className="font-bold text-slate-800">
                                  Previous Answer: {pAns.answer}
                                </p>
                                {pAns.reason && (
                                  <p className="text-rose-600 italic">
                                    Reason: "{pAns.reason}"
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* 3. NEGATIVE RESPONSES VIEW (UPDATED ACCORDING TO REAL RESPONSES) */}
        {activeTab === "negative" && (
          <div className="space-y-4">
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-xs text-rose-800 font-medium">
                Auto-filtering responses where ratings given are{" "}
                <strong>below 8</strong> or student provided negative comments/reasons.
              </p>
            </div>

            {negativeResponsesList.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-sm">
                🎉 No negative feedback found for this form!
              </div>
            ) : (
              negativeResponsesList.map((resp, idx) => {
                // Filter only the negative answers of this student
                const flaggedAnswers = (resp.answers || []).filter(
                  (ans) =>
                    (typeof ans.answer === "number" && ans.answer < 8) ||
                    ans.reason ||
                    String(ans.answer).toUpperCase() === "NO"
                );

                return (
                  <div
                    key={resp._id || idx}
                    className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {resp.studentName}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Batch: {resp.batch}
                        </p>
                      </div>
                      <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-md border border-rose-200">
                        {flaggedAnswers.length} Flagged Item(s)
                      </span>
                    </div>

                    <div className="space-y-2">
                      {flaggedAnswers.map((ans, aIdx) => (
                        <div
                          key={aIdx}
                          className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-slate-700">
                              {ans.questionText}
                            </p>
                            <span className="text-xs font-black text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-200 shadow-xs">
                              {ans.answer}
                            </span>
                          </div>
                          {ans.reason && (
                            <p className="text-xs text-slate-700 pt-1 font-medium">
                              <strong className="text-rose-700">
                                Student Reason:
                              </strong>{" "}
                              "{ans.reason}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResponses;