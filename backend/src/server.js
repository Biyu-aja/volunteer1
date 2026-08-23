require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

// Hubungkan database secara asinkron tanpa memblokir Serverless Function Vercel
sequelize
  .authenticate()
  .then(() => console.log("✅ Koneksi database Supabase berhasil"))
  .catch((err) => console.error("❌ Gagal konek ke database:", err.message));

// Jalankan server jika dijalankan secara langsung (bukan sebagai module serverless)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
  });
}

// Ekspor app Express agar dibaca oleh Vercel
module.exports = app;