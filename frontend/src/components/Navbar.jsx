import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    logout();
    setIsOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm shadow-emerald-950/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2.5 font-display text-xl font-bold text-emerald-800"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-md shadow-emerald-500/20 text-lg">🤝</span>
          Volunteer
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
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
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className="text-gray-500 hover:text-emerald-800 font-semibold transition-colors">Kelola Kegiatan</Link>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{user.full_name}</span>
              <button className="btn-pill-outline text-xs px-3 py-1.5" onClick={handleLogout}>Keluar</button>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 hover:text-emerald-800 transition-all active:scale-95 cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-6 py-4 space-y-4 shadow-inner animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-3">
            <Link 
              to="/events" 
              className="text-gray-600 hover:text-emerald-800 font-semibold py-1.5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Jelajahi Kegiatan
            </Link>
            <Link 
              to="/komunitas" 
              className="text-gray-600 hover:text-emerald-800 font-semibold py-1.5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Komunitas
            </Link>

            {user?.role === "volunteer" && (
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-emerald-800 font-semibold py-1.5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dashboard Saya
              </Link>
            )}
            {user?.role === "admin" && (
              <Link 
                to="/admin/dashboard" 
                className="text-gray-600 hover:text-emerald-800 font-semibold py-1.5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Kelola Kegiatan
              </Link>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-gray-400">Pengguna</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{user.full_name}</span>
                </div>
                <button className="btn-pill-outline w-full text-xs py-2" onClick={handleLogout}>Keluar</button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link 
                  to="/login" 
                  className="text-center text-gray-600 hover:text-emerald-800 font-semibold py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="btn-pill-primary w-full text-sm py-2.5 text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Gabung Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
