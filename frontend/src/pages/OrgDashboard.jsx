import React, { useEffect, useState } from "react";
import { eventApi, categoryApi, registrationApi, organizationApi } from "../api/resources";

const emptyForm = { title: "", description: "", location: "", quota: 10, category_id: "", event_date: "", start_time: "", end_time: "" };

export default function OrgDashboard() {
  const [activeTab, setActiveTab] = useState("events"); // tabs: 'events', 'profile'
  
  // States untuk Events & Kategori
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [eventError, setEventError] = useState("");
  const [eventSuccess, setEventSuccess] = useState("");

  // States untuk Profil Organisasi
  const [org, setOrg] = useState(null);
  const [orgForm, setOrgForm] = useState({ org_name: "", description: "", address: "" });
  const [orgError, setOrgError] = useState("");
  const [orgSuccess, setOrgSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Ambil data profil organisasi & event miliknya
  async function loadDashboardData() {
    try {
      setLoading(true);
      const orgRes = await organizationApi.me();
      const orgData = orgRes.data.data;
      setOrg(orgData);
      setOrgForm({
        org_name: orgData.org_name || "",
        description: orgData.description || "",
        address: orgData.address || "",
      });

      // Panggil API event difilter berdasarkan organization_id dari profil organisasi
      const eventRes = await eventApi.list({ organization_id: orgData.id });
      setEvents(eventRes.data.data);
    } catch (err) {
      setOrgError("Gagal memuat data dashboard: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
    categoryApi.list().then((res) => setCategories(res.data.data));
  }, []);

  function handleEventChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleEventSubmit(e) {
    e.preventDefault();
    setEventError("");
    setEventSuccess("");
    try {
      if (editingId) {
        await eventApi.update(editingId, form);
        setEventSuccess("Kegiatan berhasil diperbarui!");
      } else {
        await eventApi.create(form);
        setEventSuccess("Kegiatan baru berhasil diterbitkan!");
      }
      setForm(emptyForm);
      setEditingId(null);
      
      // Reload daftar event
      const eventRes = await eventApi.list({ organization_id: org.id });
      setEvents(eventRes.data.data);
    } catch (err) {
      setEventError(err.message);
    }
  }

  function startEdit(event) {
    setEditingId(event.id);
    setForm({
      title: event.title, description: event.description, location: event.location,
      quota: event.quota, category_id: event.category_id || "", event_date: event.event_date,
      start_time: event.start_time, end_time: event.end_time,
    });
    setEventSuccess("");
    setEventError("");
  }

  async function handleEventDelete(id) {
    if (!confirm("Hapus kegiatan ini?")) return;
    try {
      await eventApi.remove(id);
      setEventSuccess("Kegiatan berhasil dihapus!");
      
      // Tutup panel registran jika event yang dihapus sedang dibuka
      if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent(null);
        setRegistrants([]);
      }

      const eventRes = await eventApi.list({ organization_id: org.id });
      setEvents(eventRes.data.data);
    } catch (err) {
      setEventError("Gagal menghapus kegiatan: " + err.message);
    }
  }

  async function viewRegistrants(event) {
    setSelectedEvent(event);
    const res = await registrationApi.listByEvent(event.id);
    setRegistrants(res.data.data);
  }

  async function handleStatusChange(regId, status) {
    try {
      await registrationApi.updateStatus(regId, status);
      viewRegistrants(selectedEvent);
    } catch (err) {
      alert("Gagal mengubah status: " + err.message);
    }
  }

  function handleOrgChange(e) {
    setOrgForm({ ...orgForm, [e.target.name]: e.target.value });
  }

  async function handleOrgSubmit(e) {
    e.preventDefault();
    setOrgError("");
    setOrgSuccess("");
    try {
      const res = await organizationApi.update(orgForm);
      setOrg(res.data.data);
      setOrgSuccess("Profil organisasi berhasil diperbarui!");
    } catch (err) {
      setOrgError(err.message);
    }
  }

  // Hitung metrik sederhana
  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === "published").length;
  const totalQuota = events.reduce((acc, curr) => acc + curr.quota, 0);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-500 font-bold">Memuat data dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-emerald-950">Dashboard Organisasi</h1>
        <p className="text-gray-500 text-sm">Kelola informasi yayasan dan publikasi kegiatan volunteer Anda.</p>
      </div>

      {orgError && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-sm font-semibold">
          ⚠️ {orgError}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button 
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
            activeTab === "events" 
              ? "bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/10" 
              : "text-gray-500 hover:bg-gray-50"
          }`} 
          onClick={() => setActiveTab("events")}
        >
          📅 Kelola Kegiatan
        </button>
        <button 
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
            activeTab === "profile" 
              ? "bg-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/10" 
              : "text-gray-500 hover:bg-gray-50"
          }`} 
          onClick={() => setActiveTab("profile")}
        >
          🏢 Profil Organisasi
        </button>
      </div>

      {/* Tab: Kelola Kegiatan */}
      {activeTab === "events" && (
        <div className="space-y-8">
          {/* Dashboard Metrics Container */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Kegiatan</span>
              <strong className="text-3xl font-extrabold text-emerald-950 block">{totalEvents}</strong>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Kegiatan Aktif</span>
              <strong className="text-3xl font-extrabold text-emerald-950 block">{activeEvents}</strong>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total Kuota Dibuka</span>
              <strong className="text-3xl font-extrabold text-emerald-950 block">{totalQuota}</strong>
            </div>
            {org?.is_verified ? (
              <div className="glass-panel p-6 rounded-2xl bg-emerald-50/50 border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Status Yayasan</span>
                  <strong className="text-xl font-extrabold text-emerald-900 block">Terverifikasi ✅</strong>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-6 rounded-2xl bg-amber-50/50 border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">Status Yayasan</span>
                  <strong className="text-xl font-extrabold text-amber-900 block">Belum Verifikasi</strong>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 items-start">
            {/* Form Create / Edit Event */}
            <form onSubmit={handleEventSubmit} className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-emerald-950 border-b border-gray-100 pb-2">{editingId ? "Ubah Kegiatan" : "Buat Kegiatan Baru"}</h3>

              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-950">Judul Kegiatan</label>
                <input className="glass-input" name="title" required value={form.title} onChange={handleEventChange} placeholder="Contoh: Bersih Sungai Cikapundung" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-950">Deskripsi</label>
                <textarea className="glass-input" name="description" rows={3} required value={form.description} onChange={handleEventChange} placeholder="Tulis rincian tugas relawan, syarat skill, dll..." />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-950">Lokasi</label>
                <input className="glass-input" name="location" required value={form.location} onChange={handleEventChange} placeholder="Tulis alamat/platform online" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-emerald-950">Kategori</label>
                <select className="glass-input" name="category_id" value={form.category_id} onChange={handleEventChange} required>
                  <option value="">Pilih kategori</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-950">Kuota Relawan</label>
                  <input className="glass-input" type="number" name="quota" min={1} required value={form.quota} onChange={handleEventChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-950">Tanggal Pelaksanaan</label>
                  <input className="glass-input" type="date" name="event_date" required value={form.event_date} onChange={handleEventChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-950">Jam Mulai</label>
                  <input className="glass-input" type="time" name="start_time" required value={form.start_time} onChange={handleEventChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-950">Jam Selesai</label>
                  <input className="glass-input" type="time" name="end_time" required value={form.end_time} onChange={handleEventChange} />
                </div>
              </div>

              {eventError && <p className="text-red-500 text-xs font-semibold">{eventError}</p>}
              {eventSuccess && <p className="text-emerald-700 text-xs font-bold">{eventSuccess}</p>}

              <div className="flex gap-3 pt-2">
                <button className="btn-pill-primary text-sm flex-1" type="submit">{editingId ? "Simpan Perubahan" : "Terbitkan Kegiatan"}</button>
                {editingId && (
                  <button type="button" className="btn-pill-outline text-sm" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                    Batal
                  </button>
                )}
              </div>
            </form>

            {/* List of Events */}
            <div className="space-y-6">
              <h3 className="text-xl font-display font-bold text-emerald-950">Kegiatan Saya</h3>
              {events.length === 0 && <p className="text-gray-500 text-sm">Belum ada kegiatan yang Anda buat.</p>}
              <div className="flex flex-col gap-4">
                {events.map((e) => (
                  <div key={e.id} className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <strong className="text-lg font-display text-emerald-950 block">{e.title}</strong>
                        <p className="text-gray-500 text-xs">📍 {e.location} · 📅 {e.event_date}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button className="btn-pill-outline text-xs px-3.5 py-2" onClick={() => viewRegistrants(e)}>Pendaftar</button>
                        <button className="btn-pill-outline text-xs px-3.5 py-2" onClick={() => startEdit(e)}>Ubah</button>
                        <button className="btn-pill-danger text-xs px-3.5 py-2" onClick={() => handleEventDelete(e.id)}>Hapus</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Registrants Table Section */}
              {selectedEvent && (
                <div className="glass-panel p-6 rounded-3xl space-y-4">
                  <h4 className="text-lg font-bold text-emerald-950 border-b border-gray-100 pb-2">Pendaftar: {selectedEvent.title}</h4>
                  {registrants.length === 0 && <p className="text-gray-500 text-sm">Belum ada pendaftar pada kegiatan ini.</p>}
                  <div className="flex flex-col gap-2">
                    {registrants.map((r) => (
                      <div key={r.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-white/50 border border-gray-100 gap-3">
                        <div className="space-y-0.5 text-left">
                          <strong className="text-emerald-950 text-sm">{r.User.full_name}</strong>
                          <p className="text-gray-500 text-xs">{r.User.email} · 📞 {r.User.phone || "No HP belum diatur"}</p>
                        </div>
                        <select className="glass-input text-xs max-w-[140px] px-2 py-1.5" value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value)}>
                          <option value="pending">Menunggu</option>
                          <option value="approved">Diterima</option>
                          <option value="rejected">Ditolak</option>
                          <option value="attended">Hadir</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Profil Organisasi */}
      {activeTab === "profile" && (
        <div className="max-w-xl">
          <form onSubmit={handleOrgSubmit} className="glass-panel p-8 rounded-3xl space-y-5">
            <div>
              <h3 className="text-xl font-display font-bold text-emerald-950 border-b border-gray-100 pb-3">Edit Profil Yayasan/Organisasi</h3>
              <p className="text-gray-500 text-sm mt-2">Lengkapi informasi organisasi Anda agar relawan lebih tertarik bergabung.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-emerald-950">Nama Organisasi/Yayasan</label>
              <input className="glass-input" name="org_name" required value={orgForm.org_name} onChange={handleOrgChange} placeholder="Contoh: Yayasan Peduli Sesama" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-emerald-950">Deskripsi Singkat</label>
              <textarea className="glass-input" name="description" rows={5} value={orgForm.description} onChange={handleOrgChange} placeholder="Jelaskan visi misi, kegiatan umum, dan fokus yayasan Anda..." />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-emerald-950">Alamat Kantor/Markas</label>
              <input className="glass-input" name="address" value={orgForm.address} onChange={handleOrgChange} placeholder="Jl. Raya No. 123, Kota Bandung" />
            </div>

            {orgError && <p className="text-red-500 text-xs font-semibold">{orgError}</p>}
            {orgSuccess && <p className="text-emerald-700 text-xs font-bold">{orgSuccess}</p>}

            <div className="pt-2">
              <button className="btn-pill-primary w-full sm:w-auto text-sm" type="submit">Simpan Profil</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
