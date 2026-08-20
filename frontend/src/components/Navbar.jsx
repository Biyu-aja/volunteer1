import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm shadow-emerald-950/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-bold text-emerald-800">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-md shadow-emerald-500/20 text-lg">🤝</span>
          Volunteer
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/events" className="text-gray-500 hover:text-emerald-800 font-semibold transition-colors">Jelajahi Kegiatan</Link>
          <Link to="/komunitas" className="text-gray-500 hover:text-emerald-800 font-semibold transition-colors">Komunitas</Link>

          {!user && (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-500 hover:text-emerald-800 font-semibold transition-colors">Masuk</Link>
              <Link to="/register" className="btn-pill-primary text-sm px-4 py-2">Gabung Sekarang</Link>
            </div>
          )}

          {user?.role === "volunteer" && (
            <Link to="/dashboard" className="text-gray-500 hover:text-emerald-800 font-semibold transition-colors">Dashboard Saya</Link>
          )}
          {user?.role === "organization" && (
            <Link to="/org/dashboard" className="text-gray-500 hover:text-emerald-800 font-semibold transition-colors">Kelola Kegiatan</Link>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{user.full_name}</span>
              <button className="btn-pill-outline text-xs px-3 py-1.5" onClick={handleLogout}>Keluar</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
