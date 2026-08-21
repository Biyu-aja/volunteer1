const { Sequelize } = require("sequelize");
require("dotenv").config();

// Menggunakan library pre-existing (Sequelize ORM) untuk koneksi & akses basis data PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || "voluntree_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: process.env.DB_SSL === "true" ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
