const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const organizationRoutes = require("./routes/organizationRoutes");
const errorHandler = require("./middleware/errorHandler");

const { sequelize } = require("./models");
let dbConnected = false;

const app = express();

app.use(cors());

app.use(async (req, res, next) => {
  if (process.env.VERCEL && !dbConnected) {
    try {
      await sequelize.authenticate();
      dbConnected = true;
      console.log("✅ Database initialized successfully on Vercel");
    } catch (err) {
      console.error("❌ Database initialization failed:", err.message);
      return next(err);
    }
  }
  next();
});

app.use(express.json());
app.use(morgan("dev"));

// Struktur route yang rapi per-domain/resource
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/organizations", organizationRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Error handler terpusat, harus paling akhir
app.use(errorHandler);

module.exports = app;
