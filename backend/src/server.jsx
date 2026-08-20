require.extensions['.jsx'] = require.extensions['.js'];
require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Koneksi database berhasil");

    // sync({ alter: true }) dipakai saat development; gunakan migration di production
    await sequelize.sync({ alter: true });
    console.log("✅ Model sinkron dengan database");

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Gagal konek ke database:", err.message);
    process.exit(1);
  }
}

start();
