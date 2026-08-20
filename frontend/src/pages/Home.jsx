import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { eventApi, categoryApi } from "../api/resources";
import EventCard from "../components/EventCard";

const categoryIcons = {
  "Lingkungan": "🌿",
  "Pendidikan": "📚",
  "Bencana Alam": "🚨",
  "Kesehatan": "🏥",
};

const categoryColors = {
  "Lingkungan": { bg: "bg-emerald-50 hover:bg-emerald-100/70", border: "border-emerald-100", text: "text-emerald-700", glow: "hover:shadow-emerald-200/50" },
  "Pendidikan": { bg: "bg-blue-50 hover:bg-blue-100/70", border: "border-blue-100", text: "text-blue-700", glow: "hover:shadow-blue-200/50" },
  "Bencana Alam": { bg: "bg-orange-50 hover:bg-orange-100/70", border: "border-orange-100", text: "text-orange-700", glow: "hover:shadow-orange-200/50" },
  "Kesehatan": { bg: "bg-rose-50 hover:bg-rose-100/70", border: "border-rose-100", text: "text-rose-700", glow: "hover:shadow-rose-200/50" },
};
const defaultColor = { bg: "bg-purple-50 hover:bg-purple-100/70", border: "border-purple-100", text: "text-purple-700", glow: "hover:shadow-purple-200/50" };

export default function Home() {
  const [events, setEvents] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroSearch, setHeroSearch] = useState("");
  const [stats, setStats] = useState({
    volunteers: 0,
    eventsThisMonth: 0,
    totalEvents: 0,
    organizations: 0,
    satisfactionRate: 96,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil event terbaru (terbit)
    eventApi.list({ status: "published" }).then((res) => setEvents(res.data.data.slice(0, 3)));
    
    // Ambil kategori
    categoryApi.list().then((res) => setCategories(res.data.data));

    // Ambil event terpopuler
    eventApi.popular().then((res) => setPopularEvents(res.data.data));

    // Ambil statistik publik
    eventApi.publicStats()
      .then((res) => {
        if (res.data && res.data.data) {
          setStats(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/events?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate(`/events`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-teal-950 to-emerald-950 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-400 blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-amber-400 blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 items-center relative z-10">
          <div className="space-y-6">
            <span className="inline-block text-xs font-bold tracking-widest text-emerald-400 uppercase">Untuk setiap aksi kecil</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              Temukan aksi nyata, tumbuhkan dampak bersama komunitasmu.
            </h1>
            <p className="text-emerald-100/85 text-lg max-w-xl">
              Volunteer menghubungkan relawan dengan organisasi yang membutuhkan tenaga,
              waktu, dan kepedulianmu — mulai dari lingkungan, pendidikan, hingga tanggap bencana.
            </p>

            {/* Hero Search Box */}
            <form onSubmit={handleHeroSearchSubmit} className="flex flex-col sm:flex-row gap-2.5 p-1.5 bg-white/10 border border-white/20 rounded-2xl max-w-xl backdrop-blur-md">
              <input
                className="w-full bg-transparent px-4 py-2.5 outline-none text-white placeholder-emerald-200/60 text-sm"
                type="text"
                placeholder="Cari kegiatan sosial (mis. bersih-bersih, mengajar)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
              />
              <button type="submit" className="btn-pill-primary text-sm whitespace-nowrap px-6 py-2.5">
                Cari Aksi
              </button>
            </form>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/events" className="btn-pill-primary">Jelajahi Kegiatan</Link>
              <Link to="/register" className="btn-pill-outline border-white text-white hover:bg-white hover:text-emerald-950">Daftar Volunteer</Link>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white">Komunitas yang bergerak</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <strong className="block text-2xl font-extrabold text-white">{stats.volunteers}</strong>
                <span className="text-xs text-emerald-200/80">Volunteer aktif</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <strong className="block text-2xl font-extrabold text-white">
                  {stats.eventsThisMonth > 0 ? stats.eventsThisMonth : stats.totalEvents}
                </strong>
                <span className="text-xs text-emerald-200/80">
                  {stats.eventsThisMonth > 0 ? "Event bulan ini" : "Event terdaftar"}
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <strong className="block text-2xl font-extrabold text-white">{stats.organizations}</strong>
                <span className="text-xs text-emerald-200/80">Organisasi terhubung</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <strong className="block text-2xl font-extrabold text-white">{stats.satisfactionRate}%</strong>
                <span className="text-xs text-emerald-200/80">Kepuasan relawan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-display font-bold text-emerald-950">Cari Berdasarkan Kategori</h2>
          <p className="text-gray-500">Pilih bidang sosial yang ingin kamu dukung hari ini.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const colors = categoryColors[cat.name] || defaultColor;
            return (
              <div 
                key={cat.id} 
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${colors.bg} ${colors.border} ${colors.text} ${colors.glow} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
                onClick={() => navigate(`/events?category_id=${cat.id}`)}
              >
                <span className="text-4xl mb-3">{categoryIcons[cat.name] || "✨"}</span>
                <h4 className="font-bold text-sm">{cat.name}</h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center text-2xl bg-emerald-50 text-emerald-600">🌿</div>
            <h3 className="font-bold text-lg text-emerald-950">Pilih aksi yang cocok</h3>
            <p className="text-gray-500 text-sm">Jelajahi kegiatan berdasarkan kategori, lokasi, hingga misi sosial yang paling kamu pedulikan.</p>
          </div>
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center text-2xl bg-blue-50 text-blue-600">🤝</div>
            <h3 className="font-bold text-lg text-emerald-950">Terhubung dengan komunitas</h3>
            <p className="text-gray-500 text-sm">Temukan organisasi dan relawan lain yang memiliki semangat yang sama untuk menciptakan perubahan.</p>
          </div>
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <div className="inline-flex w-12 h-12 rounded-2xl items-center justify-center text-2xl bg-amber-50 text-amber-600">✨</div>
            <h3 className="font-bold text-lg text-emerald-950">Bangun dampak nyata</h3>
            <p className="text-gray-500 text-sm">Ikuti event yang berdampak, nikmati prosesnya, dan lihat kontribusimu menjadi nyata setiap hari.</p>
          </div>
        </div>
      </section>

      {/* Popular Events Section */}
      {popularEvents.length > 0 && (
        <section className="max-w-6xl mx-auto px-6">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-display font-bold text-emerald-950">🔥 Kegiatan Paling Populer</h2>
            <p className="text-gray-500 text-sm">Kegiatan dengan peminat terbanyak saat ini.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularEvents.map((pe) => (
              <Link to={`/events/${pe.id}`} key={pe.id} className="glass-card relative flex flex-col p-6 rounded-2xl text-left hover:scale-[1.01] hover:border-emerald-300">
                <span className="absolute top-4 right-4 bg-amber-400 text-amber-950 px-2.5 py-1 text-[10px] font-extrabold rounded-lg shadow-sm">
                  {pe.total_pendaftar} Pendaftar
                </span>
                {pe.category_name && (
                  <span className="self-start px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3.5">
                    {pe.category_name}
                  </span>
                )}
                <h3 className="font-display font-bold text-[1.2rem] text-emerald-950 mb-2.5 line-clamp-2 pr-20">{pe.title}</h3>
                <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-1.5"><span>📍</span> {pe.location}</p>
                <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4">
                  <span>📅</span> {new Date(pe.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <div className="border-t border-gray-100/80 pt-3 mt-auto text-xs font-bold text-emerald-800/80">
                  🏢 {pe.org_name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Events Section */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-display font-bold text-emerald-950">Kegiatan Terbaru</h2>
          <p className="text-gray-500 text-sm">Beberapa kegiatan volunteer yang baru saja dipublikasikan.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
        {events.length === 0 && <p className="text-muted">Belum ada kegiatan yang dipublikasikan.</p>}
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-white text-left">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Siap untuk mulai membantu?</h2>
            <p className="text-emerald-100/80 text-sm md:text-base max-w-xl">Gabung jadi volunteer atau buka kesempatan bagi komunitasmu untuk terhubung dengan relawan yang siap bergerak.</p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link to="/events" className="btn-pill-primary">Lihat Kegiatan</Link>
            <Link to="/register" className="btn-pill-outline border-white/60 text-white hover:bg-white hover:text-emerald-950">Daftar Sekarang</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
