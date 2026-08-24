import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { eventApi, categoryApi } from "../api/resources";
import EventCard from "../components/EventCard";

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get("category_id") || "";
  const querySearch = searchParams.get("search") || "";

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(querySearch);
  const [categoryId, setCategoryId] = useState(queryCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi.list().then((res) => setCategories(res.data.data));
  }, []);

  // Sinkronisasikan state saat parameter URL berubah
  useEffect(() => {
    setCategoryId(searchParams.get("category_id") || "");
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    eventApi
      .list({ search, category_id: categoryId, status: "published" })
      .then((res) => setEvents(res.data.data))
      .finally(() => setLoading(false));
  }, [search, categoryId]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategoryId(val);
    const newParams = {};
    if (search) newParams.search = search;
    if (val) newParams.category_id = val;
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const newParams = {};
    if (val) newParams.search = val;
    if (categoryId) newParams.category_id = categoryId;
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-emerald-950">Jelajahi Kegiatan Volunteer</h1>
        <p className="text-gray-500 text-sm">Cari kegiatan sesuai minat dan lokasimu.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 glass-panel rounded-2xl">
        <input
          className="glass-input flex-[2]"
          placeholder="Cari judul atau lokasi..."
          value={search}
          onChange={handleSearchChange}
        />
        <select className="glass-input flex-[1]" value={categoryId} onChange={handleCategoryChange}>
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 font-bold text-center py-12">Memuat kegiatan...</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
          {events.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-2xl space-y-2">
              <strong className="block text-emerald-950 text-lg">Tidak ada kegiatan yang cocok dengan pencarianmu.</strong>
              <p className="text-gray-500 text-sm">Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
