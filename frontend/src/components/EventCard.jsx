import React from "react";
import { Link } from "react-router-dom";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function EventCard({ event }) {
  const approved = Number(event.approved_count || 0);
  const pct = Math.min(Math.round((approved / event.quota) * 100), 100);

  return (
    <Link to={`/events/${event.id}`} className="glass-card flex flex-col p-6 rounded-2xl text-left hover:scale-[1.01] hover:border-emerald-300">
      {event.Category?.name && (
        <span className="self-start px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3.5">
          {event.Category.name}
        </span>
      )}
      <h3 className="font-display font-bold text-[1.2rem] text-emerald-950 mb-2.5 line-clamp-2">{event.title}</h3>
      <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-1.5"><span>📍</span> {event.location}</p>
      <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4"><span>📅</span> {formatDate(event.event_date)}</p>
      
      {/* Quota Progress Bar */}
      <div className="mt-auto pt-2">
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
          <span>Relawan Terisi</span>
          <span className="text-emerald-700">{approved}/{event.quota}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
        </div>
      </div>

      <div className="border-t border-gray-100/80 pt-3 mt-4 text-xs font-bold text-emerald-800/80">
        🏢 {event.Organization?.org_name}
      </div>
    </Link>
  );
}
