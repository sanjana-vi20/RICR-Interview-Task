import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, setUser, isLogin, setIsLogin, setRole } = useAuth();

  // 2. Direct Logout Handler
  const handleLogout = () => {
    sessionStorage.removeItem("User");
    setUser(null);
    setIsLogin(false);
    setRole("");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-8">
            <Link
              to={user ? "/" : "/login"}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-base tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                  RICR{" "}
                  <span className="text-indigo-600 font-semibold">
                    Feedback
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                  Academic Portal
                </span>
              </div>
            </Link>

            {/* Navigation Links (Logged In Only) */}
            {user && (
              <nav className="hidden md:flex items-center space-x-1">
                {user.role === "admin" ? (
                  <Link
                    to="/admin-dashboard"
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isActive("/")
                        ? "bg-indigo-50 text-indigo-600 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/teacher-dashboard"
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isActive("/")
                        ? "bg-indigo-50 text-indigo-600 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}

                {/* Admin Only Link */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/teachers"
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isActive("/admin/teachers")
                        ? "bg-indigo-50 text-indigo-600 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Manage Teachers
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Info Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700 shadow-inner">
                    {userInitial}
                  </div>

                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.fullName || "User"}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider ${
                        user.role === "admin"
                          ? "text-purple-600"
                          : "text-blue-600"
                      }`}
                    >
                      {user.role || "Teacher"}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                  title="Logout"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                    />
                  </svg>
                </button>
              </>
            ) : (
              /* Logged Out State */
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
