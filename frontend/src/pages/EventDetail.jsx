import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { eventApi, registrationApi } from "../api/resources";
import { useAuth } from "../context/AuthContext";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState({ loading: false, message: "", error: false });

  function loadEvent() {
    eventApi.getById(id).then((res) => setEvent(res.data.data));
  }

  useEffect(() => { loadEvent(); }, [id]);

  async function handleApply() {
    setStatus({ loading: true, message: "", error: false });
    try {
      await registrationApi.apply(Number(id));
      setStatus({ loading: false, message: "Pendaftaran berhasil dikirim! Menunggu konfirmasi organisasi.", error: false });
      loadEvent();
    } catch (err) {
      setStatus({ loading: false, message: err.message, error: true });
    }
  }

  if (!event) return <div className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-500 font-bold">Memuat...</div>;

  const pct = Math.min(Math.round((Number(event.approved_count || 0) / event.quota) * 100), 100);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-3">
        {event.Category?.name && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            {event.Category.name}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-display font-bold text-emerald-950">{event.title}</h1>
        <p className="text-gray-500 text-sm">
          Diselenggarakan oleh <strong className="text-emerald-900">{event.Organization?.org_name}</strong>
          {event.Organization?.is_verified && " ✅"}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-center text-left">
          <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">📍 Lokasi</strong>
          <span className="text-gray-700 text-sm font-semibold">{event.location}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-center text-left">
          <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">📅 Tanggal</strong>
          <span className="text-gray-700 text-sm font-semibold">{formatDate(event.event_date)}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-center text-left">
          <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">⏰ Waktu</strong>
          <span className="text-gray-700 text-sm font-semibold">{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-center text-left">
          <strong className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">👥 Sisa Kuota</strong>
          <span className="text-emerald-700 text-sm font-bold">{event.remaining_quota} Kursi Tersedia</span>
        </div>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-6 text-left">
        <div>
          <h3 className="text-xl font-display font-bold text-emerald-950 border-b border-gray-100 pb-3">Deskripsi Kegiatan</h3>
          <p className="mt-4 text-gray-600 text-base leading-relaxed whitespace-pre-line">{event.description}</p>
        </div>
        
        {/* Large Quota Progress Bar */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:justify-between text-xs font-bold text-gray-500 mb-2 gap-1">
            <span>Progres Rekrutmen Relawan</span>
            <span className="text-emerald-700">{event.approved_count} dari {event.quota} Relawan Terkumpul ({pct}%)</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
          </div>
        </div>
      </div>

      {user?.role === "volunteer" && (
        <div className="pt-2 text-left">
          <button className="btn-pill-primary w-full sm:w-auto text-sm px-8 py-3.5" onClick={handleApply} disabled={status.loading || event.remaining_quota === 0}>
            {event.remaining_quota === 0 ? "Kuota Penuh" : status.loading ? "Mengirim..." : "Daftar Sebagai Volunteer"}
          </button>
          {status.message && (
            <p className={`mt-3 font-semibold text-sm ${status.error ? "text-red-600" : "text-emerald-700"}`}>
              {status.message}
            </p>
          )}
        </div>
      )}

      {!user && (
        <div className="glass-panel p-4 rounded-2xl text-center text-gray-500 text-sm font-semibold">
          🔑 Masuk sebagai volunteer untuk mendaftar kegiatan ini.
        </div>
      )}
    </div>
  );
}
