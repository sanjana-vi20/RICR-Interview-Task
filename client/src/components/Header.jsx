import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
    navigate('/login');
  };

//   const isActive = (path) => location.pathname === path;

  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-base tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                  RICR <span className="text-indigo-600 font-semibold">Feedback</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                  Academic Portal
                </span>
              </div>
            </Link>

            {/* Navigation Bar (Desktop) */}
            {user && (
              <nav className="hidden md:flex items-center space-x-1">
                <Link
                  to="/"
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive('/')
                      ? 'bg-indigo-50 text-indigo-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>

                {/* Admin-only Links */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/teachers"
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      isActive('/admin/teachers')
                        ? 'bg-indigo-50 text-indigo-600 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                {/* Create Form Quick CTA */}
                <Link
                  to="/forms/create"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-600/30 transition-all duration-150 active:scale-95"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Form
                </Link>

                <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

                {/* User Info & Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-inner">
                    {userInitial}
                  </div>
                  
                  <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.fullName}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                  title="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5" />
                  </svg>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
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