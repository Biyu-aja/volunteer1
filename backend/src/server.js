require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

// Hubungkan database secara asinkron tanpa memblokir Serverless Function Vercel
sequelize
  .authenticate()
  .then(() => console.log("✅ Koneksi database Supabase berhasil"))
  .catch((err) => console.error("❌ Gagal konek ke database:", err.message));

// Ekspor app Express agar dibaca oleh Vercel
module.exports = app;