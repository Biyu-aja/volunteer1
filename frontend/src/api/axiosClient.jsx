import axios from "axios";

// Menggunakan library pre-existing (axios) untuk komunikasi dengan REST API backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

// Interceptor: menyisipkan token JWT ke setiap request otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("volunteer_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Menghindari duplikasi path /api/api jika baseURL sudah diakhiri dengan /api
  if (config.baseURL && config.url) {
    if (config.baseURL.endsWith("/api") && config.url.startsWith("/api/")) {
      config.url = config.url.substring(4); // "/api/events" -> "/events"
    } else if (config.baseURL.endsWith("/api/") && config.url.startsWith("/api/")) {
      config.url = config.url.substring(5); // "/api/events" -> "events"
    }
  }

  return config;
});

// Interceptor response: menangani error terstruktur dari backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Terjadi kesalahan jaringan";
    return Promise.reject(new Error(message));
  }
);

export default api;
