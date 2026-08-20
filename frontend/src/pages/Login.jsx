import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/resources";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(form);
      loginSuccess(res.data.data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20 space-y-6 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-emerald-950">Masuk</h1>
        <p className="text-gray-500 text-sm">Masuk untuk mendaftar kegiatan atau mengelola organisasimu.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-emerald-950">Email</label>
          <input className="glass-input" type="email" name="email" required value={form.email} onChange={handleChange} placeholder="nama@email.com" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-emerald-950">Password</label>
          <input className="glass-input" type="password" name="password" required value={form.password} onChange={handleChange} placeholder="Masukkan password" />
        </div>

        {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

        <button className="btn-pill-primary w-full text-sm py-3" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="text-gray-500 text-sm text-center">
        Belum punya akun? <Link to="/register" className="text-emerald-700 font-bold hover:underline">Daftar di sini</Link>
      </p>
    </div>
  );
}
