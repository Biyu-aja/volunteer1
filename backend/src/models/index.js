const sequelize = require("../config/database");
const User = require("./User");
const Category = require("./Category");
const Event = require("./Event");
const Registration = require("./Registration");

// =========================================================
// Rancangan relasi antar entitas (Kompetensi #2)
// =========================================================

// 1 Category -> N Events
Category.hasMany(Event, { foreignKey: "category_id" });
Event.belongsTo(Category, { foreignKey: "category_id" });

// N Users <-> N Events, melalui tabel penghubung Registration
User.belongsToMany(Event, { through: Registration, foreignKey: "user_id" });
Event.belongsToMany(User, { through: Registration, foreignKey: "event_id" });

// Akses langsung ke baris Registration (untuk melihat status pendaftaran per-user/per-event)
Event.hasMany(Registration, { foreignKey: "event_id", onDelete: "CASCADE" });
Registration.belongsTo(Event, { foreignKey: "event_id" });

User.hasMany(Registration, { foreignKey: "user_id", onDelete: "CASCADE" });
Registration.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  sequelize,
  User,
  Category,
  Event,
  Registration,
};
