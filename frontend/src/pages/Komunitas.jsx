import React from "react";
import { useNavigate } from "react-router-dom";

export default function Komunitas() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 text-left">
      {/* Hero Section */}
      <section className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
          Tentang Kami
        </span>
        <h1 className="text-4xl font-display font-extrabold text-emerald-950 leading-tight">
          Voluntree Foundation
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Voluntree Foundation adalah organisasi sosial nirlaba yang berdedikasi untuk mendorong kolaborasi, aksi kepedulian nyata, dan transformasi berkelanjutan di tengah masyarakat.
        </p>
      </section>

      {/* Grid: Visi & Misi */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-3xl space-y-3 border-emerald-100 bg-gradient-to-br from-white/80 to-emerald-50/10">
          <span className="text-3xl">👁️‍🗨️</span>
          <h3 className="text-xl font-display font-bold text-emerald-950">Visi Kami</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Menjadi wadah penggerak perubahan sosial terdepan yang menginspirasi individu untuk beraksi, menumbuhkan kepedulian, dan membangun ekosistem masyarakat yang harmonis dan berkelanjutan.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl space-y-3 border-teal-100 bg-gradient-to-br from-white/80 to-teal-50/10">
          <span className="text-3xl">🚀</span>
          <h3 className="text-xl font-display font-bold text-emerald-950">Misi Kami</h3>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>Menyelenggarakan program aksi relawan yang inklusif dan berdampak langsung bagi masyarakat.</li>
            <li>Mengembangkan kapasitas pemuda melalui edukasi dan kepemimpinan berorientasi sosial.</li>
            <li>Membangun kolaborasi dengan komunitas lokal dan global untuk mengatasi tantangan lingkungan hidup.</li>
          </ul>
        </div>
      </section>

      {/* Fokus Gerakan */}
      <section className="space-y-6">
        <h3 className="text-2xl font-display font-bold text-emerald-950 text-center">Fokus Gerakan Aksi Sosial</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🌿", title: "Lingkungan", desc: "Konservasi alam, bersih sungai, kampanye zero waste." },
            { icon: "📚", title: "Pendidikan", desc: "Kelas mengajar gratis, literasi anak jalanan." },
            { icon: "🚨", title: "Tanggap Darurat", desc: "Distribusi logistik bencana, aksi bantuan kemanusiaan." },
            { icon: "🏥", title: "Kesehatan", desc: "Pemeriksaan kesehatan gratis, donor darah sosial." },
          ].map((fokus, index) => (
            <div key={index} className="glass-card p-5 rounded-2xl flex flex-col items-center text-center space-y-2 hover:border-emerald-200">
              <span className="text-3xl mb-1">{fokus.icon}</span>
              <h4 className="font-bold text-sm text-emerald-950">{fokus.title}</h4>
              <p className="text-[11px] text-gray-400 leading-snug">{fokus.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Profil Kontak */}
      <section className="glass-panel p-8 rounded-3xl space-y-6 bg-gradient-to-br from-white/80 to-emerald-50/20 border-emerald-100">
        <h3 className="text-xl font-display font-bold text-emerald-950">Hubungi Markas Kami</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg">📍</span>
              <div>
                <strong className="block text-emerald-950">Alamat Markas</strong>
                <span>Jl. Dago No. 10, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">✉️</span>
              <div>
                <strong className="block text-emerald-950">Email Resmi</strong>
                <span>kontak@voluntree.id</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-lg">📞</span>
              <div>
                <strong className="block text-emerald-950">Telepon & WhatsApp</strong>
                <span>+62 812-3456-7890</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">⏰</span>
              <div>
                <strong className="block text-emerald-950">Jam Operasional Kantor</strong>
                <span>Senin - Jumat · 09:00 - 17:00 WIB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Button */}
      <section className="text-center">
        <button
          onClick={() => navigate("/events")}
          className="btn-pill-primary px-8 py-3.5 text-sm font-bold shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-transform"
        >
          Ikut Aksi Relawan Bersama Kami
        </button>
      </section>
    </div>
  );
}
