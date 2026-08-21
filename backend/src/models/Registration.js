const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Registration extends Model {}

Registration.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "attended"),
      defaultValue: "pending",
    },
    notes: { type: DataTypes.STRING(255), allowNull: true },
    applied_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Registration",
    tableName: "registrations",
    underscored: true,
    timestamps: false,
    indexes: [{ unique: true, fields: ["event_id", "user_id"] }],
  }
);

module.exports = Registration;
