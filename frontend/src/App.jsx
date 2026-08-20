import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Komunitas from "./pages/Komunitas";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OrgDashboard from "./pages/OrgDashboard";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/komunitas" element={<Komunitas />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/org/dashboard"
          element={
            <ProtectedRoute allowedRoles={["organization"]}>
              <OrgDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div className="container page-shell"><div className="empty-state"><h2>Halaman tidak ditemukan.</h2><p className="text-muted">Kembali ke beranda untuk menjelajahi kegiatan terbaru.</p></div></div>} />
      </Routes>
    </>
  );
}
