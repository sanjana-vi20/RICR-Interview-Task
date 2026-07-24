import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from '../config/API';

const Login = () => {
  const { setUser, setIsLogin, setRole } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({ email: "", password: "" });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res =  await api.post("/auth/login", formData);
      toast.success(res.data.message);
    //   setUser(res.data.data);
      setIsLogin(true);
      sessionStorage.setItem("User", JSON.stringify(res.data.data));

      handleClear();

      const role = res.data.data.role;
      setRole(role);
      
      const dashboardMap = {
        admin: "/admin-dashboard",
        teacher: "/teacher-dashboard",
      };
      
      navigate(dashboardMap[role] || "/");

    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Brand & Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold text-xl mb-3 shadow-sm">
            LOGIN
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Portal Sign In
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Academic Feedback Management System
          </p>
        </div>

        {/* Login Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@ricr.in"
              className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white text-slate-900 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white text-slate-900 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all placeholder:text-slate-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all duration-150 active:scale-[0.99]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
