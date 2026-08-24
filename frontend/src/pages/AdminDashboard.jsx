import React, { useEffect, useState } from "react";
import { adminApi } from "../api/resources";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("pending"); // 'pending' | 'verified' | 'all'

  async function loadOrgs() {
    try {
      setLoading(true);
      const res = await adminApi.listOrganizations();
      setOrgs(res.data.data);
    } catch (err) {
      setError("Gagal memuat data organisasi: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrgs();
  }, []);

  async function handleVerify(org, is_verified) {
    setBusyId(org.id);
    setError("");
    try {
      await adminApi.setOrganizationVerification(org.id, is_verified);
      setOrgs((prev) => prev.map((o) => (o.id === org.id ? { ...o, is_verified } : o)));
    } catch (err) {
      setError("Gagal memperbarui status: " + err.message);
    } finally {
      setBusyId(null);
    }
  }

  const filteredOrgs = orgs.filter((o) => {
    if (filter === "pending") return !o.is_verified;
    if (filter === "verified") return o.is_verified;
    return true;
  });

  const totalOrgs = orgs.length;
  const pendingCount = orgs.filter((o) => !o.is_verified).length;
  const verifiedCount = orgs.filter((o) => o.is_verified).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-emerald-950">Dashboard Admin</h1>
        <p className="text-gray-500 text-sm">Selamat datang, {user?.full_name}. Tinjau dan verifikasi organisasi/yayasan yang mendaftar.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-sm font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Organisasi</span>
          <strong className="text-3xl font-extrabold text-emerald-950 block">{totalOrgs}</strong>
        </div>
        <div className="glass-panel p-6 rounded-2xl bg-amber-50/50 border-amber-100">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">Menunggu Verifikasi</span>
          <strong className="text-3xl font-extrabold text-amber-900 block">{pendingCount}</strong>
        </div>
        <div className="glass-panel p-6 rounded-2xl bg-emerald-50/50 border-emerald-100">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Sudah Terverifikasi</span>
          <strong className="text-3xl font-extrabold text-emerald-900 block">{verifiedCount}</strong>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {[
          { key: "pending", label: `⏳ Menunggu (${pendingCount})` },
          { key: "verified", label: `✅ Terverifikasi (${verifiedCount})` },
          { key: "all", label: `📋 Semua (${totalOrgs})` },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
              filter === tab.key
                ? "bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/10"
                : "text-gray-500 hover:bg-gray-50"
            }`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 font-bold">Memuat data organisasi...</p>}

      {!loading && filteredOrgs.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-2xl space-y-2">
          <strong className="block text-emerald-950 text-lg">Tidak ada data pada filter ini.</strong>
          <p className="text-gray-500 text-sm">Coba ganti filter di atas untuk melihat organisasi lainnya.</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {filteredOrgs.map((org) => (
          <div key={org.id} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-lg font-display text-emerald-950">{org.org_name}</strong>
                {org.is_verified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">Terverifikasi</span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">Menunggu</span>
                )}
              </div>
              <p className="text-gray-500 text-xs">
                👤 {org.User?.full_name} · ✉️ {org.User?.email} {org.User?.phone ? `· 📞 ${org.User.phone}` : ""}
              </p>
              {org.address && <p className="text-gray-400 text-xs">📍 {org.address}</p>}
              {org.description && <p className="text-gray-500 text-xs max-w-xl">{org.description}</p>}
            </div>

            <div className="flex gap-2 shrink-0">
              {org.is_verified ? (
                <button
                  className="btn-pill-danger text-xs px-3.5 py-2 disabled:opacity-50"
                  disabled={busyId === org.id}
                  onClick={() => handleVerify(org, false)}
                >
                  {busyId === org.id ? "Memproses..." : "Batalkan Verifikasi"}
                </button>
              ) : (
                <button
                  className="btn-pill-primary text-xs px-3.5 py-2 disabled:opacity-50"
                  disabled={busyId === org.id}
                  onClick={() => handleVerify(org, true)}
                >
                  {busyId === org.id ? "Memproses..." : "✅ Verifikasi"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
