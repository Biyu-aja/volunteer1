import axios from "axios";

// Menggunakan library pre-existing (axios) untuk komunikasi dengan REST API backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Interceptor: menyisipkan token JWT ke setiap request otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("volunteer_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
