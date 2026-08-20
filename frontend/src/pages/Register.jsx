import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/resources";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "volunteer", org_name: "" });
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
      const res = await authApi.register(form);
      loginSuccess(res.data.data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12 space-y-6 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-emerald-950">Gabung Volunteer</h1>
        <p className="text-gray-500 text-sm">Daftar sebagai volunteer atau organisasi penyelenggara kegiatan.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-emerald-950">Daftar Sebagai</label>
          <div className="flex gap-2">
            {["volunteer", "organization"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl border transition-all ${
                  form.role === r 
                    ? "bg-emerald-500 text-emerald-950 border-emerald-500 shadow-lg shadow-emerald-500/20" 
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {r === "volunteer" ? "Volunteer" : "Organisasi"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-emerald-950">
            {form.role === "organization" ? "Nama Penanggung Jawab" : "Nama Lengkap"}
          </label>
          <input className="glass-input" name="full_name" required value={form.full_name} onChange={handleChange} placeholder={form.role === "organization" ? "Masukkan nama penanggung jawab" : "Masukkan nama lengkap"} />
        </div>

        {form.role === "organization" && (
          <div className="space-y-2">
            <label className="block text-sm font-bold text-emerald-950">Nama Organisasi</label>
            <input className="glass-input" name="org_name" required value={form.org_name} onChange={handleChange} placeholder="Nama organisasi" />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-bold text-emerald-950">Email</label>
          <input className="glass-input" type="email" name="email" required value={form.email} onChange={handleChange} placeholder="nama@email.com" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-emerald-950">Password</label>
          <input className="glass-input" type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="Minimal 6 karakter" />
        </div>

        {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

        <button className="btn-pill-primary w-full text-sm py-3" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Buat Akun"}
        </button>
      </form>

      <p className="text-gray-500 text-sm text-center">
        Sudah punya akun? <Link to="/login" className="text-emerald-700 font-bold hover:underline">Masuk di sini</Link>
      </p>
    </div>
  );
}
