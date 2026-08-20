import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registrationApi, authApi } from "../api/resources";
import { useAuth } from "../context/AuthContext";

const statusLabel = {
  pending: { text: "Menunggu Konfirmasi", color: "text-amber-600 bg-amber-50 border-amber-100" },
  approved: { text: "Diterima", color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  rejected: { text: "Ditolak", color: "text-rose-600 bg-rose-50 border-rose-100" },
  attended: { text: "Hadir", color: "text-blue-700 bg-blue-50 border-blue-100" },
};

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("registrations"); // tabs: 'registrations', 'profile'
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // States untuk edit profil
  const [profileForm, setProfileForm] = useState({ full_name: "", phone: "" });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  useEffect(() => {
    // Muat pendaftaran kegiatan volunteer
    registrationApi.myRegistrations()
      .then((res) => setRegistrations(res.data.data))
      .finally(() => setLoading(false));

    // Isi formulir profil awal
    if (user) {
      setProfileForm({
        full_name: user.full_name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  function handleProfileChange(e) {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    try {
      const res = await authApi.updateProfile(profileForm);
      setUser(res.data.data); // Update state global auth
      setProfileSuccess("Profil berhasil diperbarui!");
    } catch (err) {
      setProfileError(err.message);
    }
  }

  // Hitung metrik relawan
  const totalRegistrations = registrations.length;
  const approvedRegistrations = registrations.filter((r) => r.status === "approved" || r.status === "attended").length;
  const attendedRegistrations = registrations.filter((r) => r.status === "attended").length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-emerald-950">Dashboard Relawan</h1>
        <p className="text-gray-500 text-sm">Selamat datang kembali, {user?.full_name}.</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button 
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
            activeTab === "registrations" 
              ? "bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/10" 
              : "text-gray-500 hover:bg-gray-50"
          }`} 
          onClick={() => setActiveTab("registrations")}
        >
          🌿 Kegiatan Saya
        </button>
        <button 
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
            activeTab === "profile" 
              ? "bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/10" 
              : "text-gray-500 hover:bg-gray-50"
          }`} 
          onClick={() => setActiveTab("profile")}
        >
          ⚙️ Pengaturan Profil
        </button>
      </div>

      {/* Tab: Kegiatan Saya */}
      {activeTab === "registrations" && (
        <div className="space-y-8">
          {/* Metrics Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Terdaftar</span>
              <strong className="text-3xl font-extrabold text-emerald-950 block">{totalRegistrations}</strong>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Kegiatan Disetujui</span>
              <strong className="text-3xl font-extrabold text-emerald-950 block">{approvedRegistrations}</strong>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Kehadiran (Hadir)</span>
              <strong className="text-3xl font-extrabold text-emerald-950 block">{attendedRegistrations}</strong>
            </div>
          </div>

          {loading && <p className="text-gray-500 font-bold">Memuat kegiatan...</p>}

          {!loading && registrations.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-2xl space-y-4">
              <strong className="block text-emerald-950 text-lg">Kamu belum punya riwayat kegiatan.</strong>
              <p className="text-gray-500 text-sm">Yuk mulai jelajahi event yang paling cocok dengan semangatmu.</p>
              <Link to="/events" className="btn-pill-primary text-sm">Jelajahi Kegiatan</Link>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {registrations.map((r) => (
              <div key={r.id} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <Link to={`/events/${r.Event.id}`} className="font-display font-bold text-lg text-emerald-950 hover:text-emerald-700 transition-colors">
                    {r.Event.title}
                  </Link>
                  <p className="text-gray-500 text-xs flex items-center gap-1.5">
                    <span>📍</span> {r.Event.location} · <span>📅</span> {r.Event.event_date}
                  </p>
                </div>
                <span className={`self-start sm:self-center px-3.5 py-1.5 rounded-full text-xs font-bold border ${statusLabel[r.status].color} whitespace-nowrap`}>
                  {statusLabel[r.status].text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Pengaturan Profil */}
      {activeTab === "profile" && (
        <div className="max-w-xl">
          <form onSubmit={handleProfileSubmit} className="glass-panel p-8 rounded-3xl space-y-5">
            <div>
              <h3 className="text-xl font-display font-bold text-emerald-950 border-b border-gray-100 pb-3">Pengaturan Profil Saya</h3>
              <p className="text-gray-500 text-sm mt-2">Perbarui informasi kontak dan data diri Anda agar memudahkan komunikasi dengan yayasan.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-emerald-950">Nama Lengkap</label>
              <input className="glass-input" name="full_name" required value={profileForm.full_name} onChange={handleProfileChange} placeholder="Masukkan nama lengkap Anda" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-emerald-950">Nomor Telepon/WhatsApp</label>
              <input className="glass-input" name="phone" value={profileForm.phone} onChange={handleProfileChange} placeholder="Contoh: 081234567890" />
            </div>

            {profileError && <p className="text-red-500 text-xs font-semibold">{profileError}</p>}
            {profileSuccess && <p className="text-emerald-700 text-xs font-bold">{profileSuccess}</p>}

            <div className="pt-2">
              <button className="btn-pill-primary w-full sm:w-auto text-sm" type="submit">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
