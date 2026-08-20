import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { organizationApi } from "../api/resources";

export default function Komunitas() {
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    organizationApi
      .list()
      .then((res) => {
        if (res.data && res.data.data) {
          setOrganizations(res.data.data);
        }
      })
      .catch((err) => console.error("Error fetching organizations:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter organisasi berdasarkan pencarian lokal
  const filteredOrgs = organizations.filter((org) =>
    org.org_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (org.address && org.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (org.description && org.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-emerald-950">Komunitas & Organisasi</h1>
        <p className="text-gray-500 text-sm">
          Temukan berbagai komunitas yang berdedikasi menciptakan dampak nyata bagi masyarakat.
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-4 p-4 glass-panel rounded-2xl">
        <input
          type="text"
          className="glass-input"
          placeholder="Cari nama komunitas, alamat, atau deskripsi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-gray-500 font-bold text-center py-12">Memuat daftar komunitas...</p>
      ) : (
        <div>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="glass-card flex flex-col p-6 rounded-3xl relative hover:scale-[1.01] hover:border-emerald-300 transition-all duration-200"
              >
                {/* Community avatar / icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-2xl shadow-inner">
                    🏢
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-emerald-950 line-clamp-1">
                      {org.org_name}
                    </h3>
                    {org.is_verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        ✓ Terverifikasi
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-3 min-h-[60px]">
                  {org.description || "Tidak ada deskripsi yang tersedia untuk organisasi ini."}
                </p>

                {/* Info List */}
                <div className="space-y-2 mb-6 mt-auto text-xs text-gray-500">
                  <div className="flex items-start gap-2">
                    <span className="text-sm">📍</span>
                    <span className="line-clamp-2">{org.address || "Lokasi tidak dicantumkan"}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => navigate(`/events?organization_id=${org.id}`)}
                  className="w-full btn-pill-primary py-2.5 text-xs font-bold"
                >
                  Lihat Kegiatan Sosial
                </button>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredOrgs.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-2xl space-y-2">
              <strong className="block text-emerald-950 text-lg">
                Tidak ada komunitas yang ditemukan.
              </strong>
              <p className="text-gray-500 text-sm">
                Coba gunakan kata kunci pencarian yang lain.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
