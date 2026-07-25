import { useState } from "react";
// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import {Toaster} from "react-hot-toast";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import FillForm from "./components/FillForm";

import FormResponses from "./pages/FormResponses";
import EditForm from "./pages/EditForm";
import ViewResponses from "./components/ViewResponse";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/fill-form/:token" element={<FillForm />} />
          <Route path="/forms/edit/:id" element={<EditForm />} />
          <Route path="/forms/:id/responses" element={<FormResponses />} />
          <Route path="/view-response" element={<ViewResponses />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
